package com.desarrollo.criminal.configuration;

import com.desarrollo.criminal.dto.response.GetPackageDTO;
import com.desarrollo.criminal.entity.Package;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeMap;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Collections;
import java.util.stream.Collectors;

@Configuration
public class ModelMapperConfig {

   @Bean
   public ModelMapper modelMapper(){
       ModelMapper modelMapper = new ModelMapper();
       TypeMap<Package, GetPackageDTO> typeMap = modelMapper.createTypeMap(Package.class, GetPackageDTO.class);

       typeMap.addMapping(src -> src.getActivitiesNames() != null ? src.getActivitiesNames(): Collections.emptyList(), GetPackageDTO::setActivities);

       return modelMapper;
   }
}