package com.desarrollo.criminal.service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import com.desarrollo.criminal.dto.request.PackageDTO;
import com.desarrollo.criminal.dto.response.GetPackageDTO;
import com.desarrollo.criminal.entity.Activity;
import com.desarrollo.criminal.entity.user.User;
import com.desarrollo.criminal.exception.CriminalCrossException;
import jakarta.transaction.Transactional;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.desarrollo.criminal.repository.PackageRepository;
import com.desarrollo.criminal.entity.Package;

import lombok.AllArgsConstructor;

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

        Set<Activity> activities = activityService.getActivitiesByIds(packageDTO.getActivities());
        aPackage.setActivities(activities);

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

    public ResponseEntity<Package> updatePackage(Long id, Package aPackage){
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
                packageDTO.getDescription(),
                packageDTO.getCredits());
    }
}
