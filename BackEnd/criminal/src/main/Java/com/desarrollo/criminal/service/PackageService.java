package com.desarrollo.criminal.service;

import java.util.List;
import java.util.Optional;
import java.util.Set;

import com.desarrollo.criminal.dto.request.ActivitiesPackageDTO;
import com.desarrollo.criminal.dto.request.PackageDTO;
import com.desarrollo.criminal.dto.request.UpdatePackageDTO;
import com.desarrollo.criminal.dto.response.GetPackageDTO;
import com.desarrollo.criminal.entity.Activity;
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

    public ResponseEntity<Package> createPackage(PackageDTO packageDTO){
        User user = userService.getUserById(packageDTO.getUserId());

        if (Optional.ofNullable(user.getAPackage()).isPresent()){
            throw new CriminalCrossException("USER_ALREADY_PACKAGE","User already has a package");
        }

        Package aPackage = this.convertToEntity(packageDTO);
        aPackage.setUser(user);

        List<Long> activitiesIds = packageDTO.getActivities().stream().map(ActivitiesPackageDTO::getActivityId).toList();
        Set<Activity> activities = activityService.getActivitiesByIds(activitiesIds);

        aPackage.setActivities(activities);
        aPackage.setPrice(this.calculatePrice(activities.stream().toList(), packageDTO.getActivities().stream().map(ActivitiesPackageDTO::getQuantity).toList()));
        aPackage.setCredits(this.calculateCredits(activities.stream().toList(), packageDTO.getActivities().stream().map(ActivitiesPackageDTO::getQuantity).toList()));

        user.setAPackage(aPackage);
        packageRepository.save(aPackage);
        userService.save(user);

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
        if (aPackage.getCredits() != null){
            packageToUpdate.setCredits(aPackage.getCredits());
        }
        if (aPackage.getActivities() != null){
            packageToUpdate.setActivities(activityService.getActivitiesByIds(aPackage.getActivities()));
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

    private Package convertToEntity(PackageDTO packageDTO){
        return new Package(
                packageDTO.getName(),
                packageDTO.getDescription());
    }


    private Float calculatePrice(List<Activity> activities, List<Integer> quantities){
        Float price = 0.00F;

        for (int i = 0; i < activities.size(); i++){
            price += activities.get(i).getPrice() * quantities.get(i) * 4;
        }
        return price;
    }

    private Integer calculateCredits(List<Activity> activities, List<Integer> quantities){
        Integer credits = 0;

        for (int i = 0; i < activities.size(); i++){
            credits += activities.get(i).getCredits() * quantities.get(i) * 4;
        }

        return credits;
    }
}
