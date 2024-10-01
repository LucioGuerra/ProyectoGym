package com.desarrollo.criminal.configuration;

import com.desarrollo.criminal.dto.response.GetPackageActivityDTO;
import com.desarrollo.criminal.dto.response.GetPackageDTO;
import com.desarrollo.criminal.entity.Package;
import com.desarrollo.criminal.entity.PackageActivity;
import org.modelmapper.Conditions;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeMap;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDate;
import java.util.stream.Collectors;

@Configuration
public class ModelMapperConfig {

   @Bean
   public ModelMapper modelMapper(){
       ModelMapper modelMapper = new ModelMapper();
       TypeMap<Package, GetPackageDTO> typeMap01 = modelMapper.createTypeMap(Package.class, GetPackageDTO.class);
           typeMap01.addMappings(mapper -> {
               mapper.when(Conditions.isNotNull()).map(src -> src.getUser().getId(), GetPackageDTO::setUserId);
               mapper.skip(GetPackageDTO::setCreatedAt);
               mapper.map(src -> src.getPackageActivities() != null? src.getPackageActivities().stream().map(packageActivity -> modelMapper.map(packageActivity, GetPackageActivityDTO.class)).collect(Collectors.toList()): new PackageActivity(), GetPackageDTO::setActivities);
           });

       TypeMap<PackageActivity, GetPackageActivityDTO> typeMap02 = modelMapper.createTypeMap(PackageActivity.class, GetPackageActivityDTO.class);
           typeMap02.addMappings(mapper -> {
               mapper.when(Conditions.isNotNull()).map(src -> src.getActivity().getName(), GetPackageActivityDTO::setName);
               mapper.when(Conditions.isNotNull()).map(PackageActivity::getQuantity, GetPackageActivityDTO::setQuantity);
           });

       return modelMapper;
   }
}