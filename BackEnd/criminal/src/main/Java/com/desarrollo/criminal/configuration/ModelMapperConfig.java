package com.desarrollo.criminal.configuration;

import com.desarrollo.criminal.dto.response.GetPackageDTO;
import com.desarrollo.criminal.entity.Package;
import com.desarrollo.criminal.entity.Activity;
import org.modelmapper.ModelMapper;
import org.modelmapper.PropertyMap;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.DependsOn;

import java.util.stream.Collectors;

@Configuration
@DependsOn({"modelMapper"})
public class ModelMapperConfig {

   @Bean
   public ModelMapper modelMapper(){
       ModelMapper modelMapper = new ModelMapper();

       return modelMapper;
   }
}