package com.desarrollo.criminal.controller;

import java.util.List;

import com.desarrollo.criminal.dto.request.PackageDTO;
import com.desarrollo.criminal.dto.request.UpdatePackageDTO;
import com.desarrollo.criminal.dto.response.GetPackageDTO;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.desarrollo.criminal.entity.Package;
import com.desarrollo.criminal.service.PackageService;

import lombok.AllArgsConstructor;

@AllArgsConstructor
@RestController
@RequestMapping("/api/public/packages")
public class PackageController {
    private final PackageService packageService;

    @PostMapping
    public ResponseEntity<Package> createPackage(@RequestBody PackageDTO aPackage){
        return packageService.createPackage(aPackage);
    }

    @GetMapping
    public ResponseEntity<List<GetPackageDTO>> getAllPackage(){
        return packageService.getAllPackages();
    }

    @GetMapping("/{id}")
    public ResponseEntity<GetPackageDTO> getPackageById(@PathVariable Long id){
        return packageService.getPackageById(id);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<Package> updatePackage(@PathVariable Long id, @RequestBody UpdatePackageDTO aPackage){
        return packageService.updatePackage(id, aPackage);
    }

    @DeleteMapping
    public ResponseEntity<Package> deletePackage(){
        //packageService.deleteExpiredPackages();
        return ResponseEntity.status(HttpStatus.OK).build();
    }
}
