package com.desarrollo.criminal.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.desarrollo.criminal.entity.Package;
import com.desarrollo.criminal.service.PackageService;

import lombok.AllArgsConstructor;

@AllArgsConstructor
@RestController
@RequestMapping("/api/packages")
public class PackageController {
    private final PackageService packageService;

    @PostMapping
    public ResponseEntity<Package> createPackage(@RequestBody Package aPackage){
        return packageService.createPackage(aPackage);
    }

    @GetMapping
    public ResponseEntity<List<Package>> getAllPackage(){
        return packageService.getAllPackage();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Package> getPackageById(@RequestParam Long id){
        return packageService.getPackageById(id);
    }

    @PutMapping
    public ResponseEntity<Package> updatePackage(@RequestParam Long id, @RequestBody Package aPackage){
        return packageService.updatePackage(id, aPackage);
    }
}
