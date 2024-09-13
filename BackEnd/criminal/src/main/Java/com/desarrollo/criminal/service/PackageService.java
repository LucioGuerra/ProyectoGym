package com.desarrollo.criminal.service;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.desarrollo.criminal.repository.PackageRepository;
import com.desarrollo.criminal.entity.Package;

import lombok.AllArgsConstructor;

@AllArgsConstructor
@Service
public class PackageService {
    private final PackageRepository packageRepository;

    public ResponseEntity<Package> createPackage(Package aPackage){
        Package savedPackage = packageRepository.save(aPackage);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedPackage);
    }

    public ResponseEntity<List<Package>> getAllPackage(){
        List<Package> packages = packageRepository.findAll();
        return ResponseEntity.status(HttpStatus.OK).body(packages);
    }

    public ResponseEntity<Package> getPackageById(Long id){
        Package aPackage = packageRepository.findById(id).get();
        return ResponseEntity.status(HttpStatus.OK).body(aPackage);
    }

    public ResponseEntity<Package> updatePackage(Long id, Package aPackage){
        return ResponseEntity.status(HttpStatus.OK).build();
    }
}
