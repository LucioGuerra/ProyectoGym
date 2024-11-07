package com.desarrollo.criminal.service;

import com.desarrollo.criminal.entity.Package;
import com.desarrollo.criminal.entity.PackageActivity;
import com.desarrollo.criminal.repository.PackageActivityRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@AllArgsConstructor
@Service
public class PackageActivityService {
    private final PackageActivityRepository packageActivityRepository;

    public void save(PackageActivity packageActivity) {
        packageActivityRepository.save(packageActivity);
    }

    public void saveAll(List<PackageActivity> packageActivities) {
        for (PackageActivity packageActivity : packageActivities) {
            packageActivityRepository.save(packageActivity);
        }
    }

    public Optional<PackageActivity> findPackageActivityByActivityIdAndPackageId(Long id, Long id1) {
        return packageActivityRepository.findPackageActivityByActivityIdAndAPackageId(id, id1);
    }
}
