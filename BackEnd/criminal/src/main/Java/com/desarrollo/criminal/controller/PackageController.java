package com.desarrollo.criminal.controller;

import java.util.List;

import com.desarrollo.criminal.dto.request.PackageDTO;
import com.desarrollo.criminal.dto.request.UpdatePackageDTO;
import com.desarrollo.criminal.dto.response.GetPackageDTO;
import com.desarrollo.criminal.dto.response.GetRandomPackageDTO;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.desarrollo.criminal.entity.Package;
import com.desarrollo.criminal.service.PackageService;

import lombok.AllArgsConstructor;

@AllArgsConstructor
@RestController
@RequestMapping("/api/packages")
public class PackageController {
    private final PackageService packageService;

    @PostMapping("/admin")
    public ResponseEntity<Package> createPackage(@RequestBody @Valid PackageDTO aPackage){
        return packageService.createPackage(aPackage);
    }

    @GetMapping("/admin")
    public ResponseEntity<List<GetPackageDTO>> getAllPackage(){
        return packageService.getAllPackages();
    }

    @GetMapping("/admin/{id}")
    public ResponseEntity<GetPackageDTO> getPackageById(@PathVariable Long id){
        return packageService.getPackageById(id);
    }

    @GetMapping("/public/random")
    public ResponseEntity<List<GetRandomPackageDTO>> getRandomPackage(){
        //todo revisar las activities
        return packageService.getRandomPackage();
    }

    @PatchMapping("/admin/{id}")
    public ResponseEntity<Package> updatePackage(@PathVariable Long id, @RequestBody @Valid UpdatePackageDTO aPackage){
        return packageService.updatePackage(id, aPackage);
    }

    @DeleteMapping("/admin")
    public ResponseEntity<Package> deletePackage(){
        packageService.deleteExpiredPackages();
        return ResponseEntity.status(HttpStatus.OK).build();
    }
}
