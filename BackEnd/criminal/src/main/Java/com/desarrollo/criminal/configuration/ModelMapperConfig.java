package com.desarrollo.criminal.configuration;

import com.desarrollo.criminal.dto.response.AppointmentListResponseDTO;
import com.desarrollo.criminal.dto.response.AppointmentResponseDTO;
import com.desarrollo.criminal.entity.Appointment;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeMap;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ModelMapperConfig {

   @Bean
   public ModelMapper modelMapper(){
       ModelMapper modelMapper = new ModelMapper();


       return modelMapper;
   }
}