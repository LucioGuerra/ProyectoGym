package com.desarrollo.criminal.service;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import com.desarrollo.criminal.dto.request.ActivitiesPackageDTO;
import com.desarrollo.criminal.dto.request.PackageDTO;
import com.desarrollo.criminal.dto.request.UpdatePackageDTO;
import com.desarrollo.criminal.dto.response.GetPackageDTO;
import com.desarrollo.criminal.entity.Activity;
import com.desarrollo.criminal.entity.PackageActivity;
import com.desarrollo.criminal.entity.user.User;
import com.desarrollo.criminal.exception.CriminalCrossException;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.desarrollo.criminal.repository.PackageRepository;
import com.desarrollo.criminal.entity.Package;

import lombok.AllArgsConstructor;
import org.springframework.transaction.annotation.Transactional;

@AllArgsConstructor
@Service
public class PackageService {
    private final PackageRepository packageRepository;
    private final ActivityService activityService;
    private UserService userService;
    private final ModelMapper modelMapper;
    private final PackageActivityService packageActivityService;

    public ResponseEntity<Package> createPackage(PackageDTO packageDTO){
        User user = userService.getUserById(packageDTO.getUserId());

        if (this.checkIfUserHasPackage(user)){
            throw new CriminalCrossException("USER_ALREADY_PACKAGE","User already has a package");
        }

        Package aPackage = this.convertToEntity(packageDTO);
        aPackage.setUser(user);

        aPackage.setPackageActivities(this.createPackageActivity(packageDTO.getActivities().stream().toList(), aPackage)
        );

        aPackage.setPrice(this.calculatePrice(packageDTO.getActivities().stream().toList()));

        user.addAPackage(aPackage);
        packageRepository.save(aPackage);
        userService.save(user);
        packageActivityService.saveAll(aPackage.getPackageActivities().stream().toList());

        return ResponseEntity.status(HttpStatus.CREATED).build();
    }


    public ResponseEntity<List<GetPackageDTO>> getAllPackages(){
        List<Package> packages = packageRepository.findAll();

        List<GetPackageDTO> packagesDTO = packages.stream().map(aPackage -> {
            GetPackageDTO dto = modelMapper.map(aPackage, GetPackageDTO.class);
            dto.setCreatedAt(aPackage.getCreatedAt().toLocalDate());
            return dto;
        }).toList();

        return ResponseEntity.status(HttpStatus.OK).body(packagesDTO);
    }

    public ResponseEntity<GetPackageDTO> getPackageById(Long id){
        Package aPackage = packageRepository.findById(id).orElseThrow(() -> new CriminalCrossException("PACKAGE_NOT_FOUND","Package not found"));
        GetPackageDTO packageDTO = modelMapper.map(aPackage, GetPackageDTO.class);
        packageDTO.setCreatedAt(aPackage.getCreatedAt().toLocalDate());
        return ResponseEntity.status(HttpStatus.OK).body(packageDTO);
    }

    public ResponseEntity<List<GetPackageDTO>> getPackageHistoryByUserId(Long id){
        User user = userService.getUserById(id);
        List<Package> packages = packageRepository.findByUser(user);

        List<GetPackageDTO> packagesDTO = packages.stream().map(aPackage -> {
            GetPackageDTO dto = modelMapper.map(aPackage, GetPackageDTO.class);
            dto.setCreatedAt(aPackage.getCreatedAt().toLocalDate());
            return dto;
        }).toList();

        return ResponseEntity.status(HttpStatus.OK).body(packagesDTO);
    }

    public ResponseEntity<Package> updatePackage(Long id, UpdatePackageDTO aPackage){
        Package packageToUpdate = packageRepository.findById(id).orElseThrow(() -> new CriminalCrossException("PACKAGE_NOT_FOUND","Package not found"));

        if (aPackage.getName() != null){
            packageToUpdate.setName(aPackage.getName());
        }
        if (aPackage.getDescription() != null){
            packageToUpdate.setDescription(aPackage.getDescription());
        }
        if(aPackage.getExpirationDate() != null){
            packageToUpdate.setExpirationDate(aPackage.getExpirationDate());
        }

        packageRepository.save(packageToUpdate);
        return ResponseEntity.status(HttpStatus.OK).build();
    }

    /*
    @Transactional
    @Scheduled(cron = "0 0 0 * * *")
    public void deleteExpiredPackages(){
        List<Package> packages = packageRepository.findExpiredTodayAndActive();

        for(Package aPackage : packages){
            User user = aPackage.getUser();
            if(user.getAPackage().getId() == aPackage.getId()){
                user.deletePackage();
                userService.save(user);
                aPackage.setActive(false);
                packageRepository.save(aPackage);
            }
        }
    }*/
    public List<Package> getUserHistory(User user){
        return packageRepository.findByUser(user);
    }


    private Set<PackageActivity> createPackageActivity(List<ActivitiesPackageDTO> activitiesPackageDTO,
                                                       Package aPackage){
        Set<PackageActivity> packageActivities = new HashSet<>();

        for (ActivitiesPackageDTO packageDTO : activitiesPackageDTO) {
            Activity activity = activityService.getActivityById(packageDTO.getActivityId());
            Integer quantity = (packageDTO.getQuantity() * 4);

            packageActivities.add(new PackageActivity(activity, quantity, aPackage));
        }

        return packageActivities;
    }

    private Package convertToEntity(PackageDTO packageDTO){
        return new Package(
                packageDTO.getName(),
                packageDTO.getDescription());
    }


    private Float calculatePrice(List<ActivitiesPackageDTO> activitiesPackageDTO){
        Float price = 0.00F;

        for (ActivitiesPackageDTO packageDTO : activitiesPackageDTO) {
            Activity activity = activityService.getActivityById(packageDTO.getActivityId());
            Integer quantity = packageDTO.getQuantity();

            price += (activity.getPrice() * quantity * 4);
        }
        return price;
    }

    private boolean checkIfUserHasPackage(User user) {
        for(Package aPackage : user.getAPackage()){
            if(aPackage.getActive()){
                return true;
            }
        }
        return false;
    }

}
