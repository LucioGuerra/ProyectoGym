package com.desarrollo.criminal.configuration;

import com.desarrollo.criminal.dto.reponse.UserResponseDTO;
import com.desarrollo.criminal.dto.response.AppointmentListResponseDTO;
import com.desarrollo.criminal.dto.response.AppointmentResponseDTO;
import com.desarrollo.criminal.entity.Appointment;
import com.desarrollo.criminal.entity.user.User;
import org.modelmapper.Conditions;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeMap;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ModelMapperConfig {

   @Bean
   public ModelMapper modelMapper(){
       ModelMapper modelMapper = new ModelMapper();
       TypeMap<User, UserResponseDTO> typeMapUser = modelMapper.createTypeMap(User.class, UserResponseDTO.class);
         typeMapUser.addMappings(mapper -> {
            mapper.map(src -> src.getRoutine().getId() != null ? src.getRoutine().getId(): null, UserResponseDTO::setRoutineId);
            mapper.map(src -> src.getAPackage().getId() != null ? src.getAPackage().getId(): null, UserResponseDTO::setAPackageId);
         });

       return modelMapper;
   }
}