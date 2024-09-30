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
    private final UserService userService;
    private final ModelMapper modelMapper;
    private final PackageActivityService packageActivityService;

    public ResponseEntity<Package> createPackage(PackageDTO packageDTO){
        User user = userService.getUserById(packageDTO.getUserId());

        if (Optional.ofNullable(user.getAPackage()).isPresent()){
            throw new CriminalCrossException("USER_ALREADY_PACKAGE","User already has a package");
        }

        Package aPackage = this.convertToEntity(packageDTO);
        aPackage.setUser(user);

        aPackage.setPackageActivities(this.createPackageActivity(packageDTO.getActivities().stream().toList(), aPackage)
        );

        aPackage.setPrice(this.calculatePrice(packageDTO.getActivities().stream().toList()));

        user.setAPackage(aPackage);
        packageRepository.save(aPackage);
        userService.save(user);
        packageActivityService.saveAll(aPackage.getPackageActivities().stream().toList());

        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    public ResponseEntity<List<GetPackageDTO>> getAllPackages(){
        List<Package> packages = packageRepository.findAll();
        return ResponseEntity.status(HttpStatus.OK).body(packages.stream().map(aPackage -> modelMapper.map(aPackage, GetPackageDTO.class)).toList());
    }

    public ResponseEntity<GetPackageDTO> getPackageById(Long id){
        Package aPackage = packageRepository.findById(id).orElseThrow(() -> new CriminalCrossException("PACKAGE_NOT_FOUND","Package not found"));
        return ResponseEntity.status(HttpStatus.OK).body(modelMapper.map(aPackage, GetPackageDTO.class));
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

    @Transactional
    @Scheduled(cron = "0 0 0 * * *")
    public void deleteExpiredPackages(){
        List<Package> packages = packageRepository.findExpiredToday();

        for(Package aPackage : packages){
            User user = aPackage.getUser();
            user.deletePackage();
            userService.save(user);
        }
    }

    private Set<PackageActivity> createPackageActivity(List<ActivitiesPackageDTO> activitiesPackageDTO,
                                                       Package aPackage){
        Set<PackageActivity> packageActivities = new HashSet<>();

        for (ActivitiesPackageDTO packageDTO : activitiesPackageDTO) {
            Activity activity = activityService.getActivityById(packageDTO.getActivityId());
            Integer quantity = packageDTO.getQuantity();

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

            price += activity.getPrice() * quantity * 4;
        }
        return price;
    }

}
