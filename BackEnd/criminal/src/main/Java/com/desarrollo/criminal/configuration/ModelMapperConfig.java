package com.desarrollo.criminal.configuration;

import com.desarrollo.criminal.dto.request.UserRequestDTO;
import com.desarrollo.criminal.dto.response.*;
import com.desarrollo.criminal.entity.Appointment;
import com.desarrollo.criminal.entity.user.User;
import com.desarrollo.criminal.entity.Package;
import com.desarrollo.criminal.entity.PackageActivity;
import com.desarrollo.criminal.entity.Activity;
import org.modelmapper.Conditions;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeMap;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.net.URL;
import java.time.LocalDate;
import java.util.ArrayList;
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

       TypeMap<Package, GetRandomPackageDTO> packageGetRandomPackageDTOTypeMap = modelMapper.createTypeMap(Package.class, GetRandomPackageDTO.class);
           packageGetRandomPackageDTOTypeMap.addMappings(mapper -> {
               mapper.using(ctx -> {
                   //todo arreglar esto
                   PackageActivity packageActivity = (PackageActivity) ctx.getSource();
                   if (packageActivity != null) {
                       return packageActivity.getActivity().getName();
                   }
                   else {
                       return null;
                   }
               })
                .map(src -> src.getPackageActivities().stream().map(PackageActivity::getActivity).map(Activity::getName).toList(), GetRandomPackageDTO::setActivities);
           });

       /*TypeMap<User, UserResponseDTO> typeMap03 = modelMapper.createTypeMap(User.class, UserResponseDTO.class);
         typeMap03.addMappings(mapper -> {
            mapper.map(src -> src.getRoutine().getId() != null ? src.getRoutine().getId(): null, UserResponseDTO::setRoutineId);
            //mapper.map(src -> src.getAPackage().getId() != null ? src.getAPackage().getId(): null, UserResponseDTO::setAPackageId);
             mapper.map(src -> src.getPicture(), UserResponseDTO::setPicture);
         });

        */

         TypeMap<UserRequestDTO, User> typeMap04 = modelMapper.createTypeMap(UserRequestDTO.class, User.class);
            typeMap04.addMappings(mapper -> {
                mapper.map(src -> src.getPicture() != null? src.getPicture(): "", User::setPicture);
            });

         //TODO Arreglar el mapeo
       /*TypeMap<Appointment, AppointmentResponseDTO> typeMap04 = modelMapper.createTypeMap(Appointment.class,
               AppointmentResponseDTO.class);
         typeMap04.addMappings(mapper -> {
             mapper.map(src -> src.getActivity() != null? src.getActivity().getName(): null,
                     AppointmentResponseDTO::setActivity);
             mapper.map(src -> src.getInstructor() != null?
                             src.getInstructor().getFirstName() + " " + src.getInstructor().getLastName(): null,
                     AppointmentResponseDTO::setInstructor);
             mapper.map(src -> src.getParticipants() != null? (long) src.getParticipants().size() : 0L,
                     AppointmentResponseDTO::setParticipantsCount);
             mapper.map(src -> src.getParticipants() != null ?
                     src.getParticipants().stream().map(user -> modelMapper.map(user,
                     AppointmentUserDTO.class)).toList(): new ArrayList<>(), AppointmentResponseDTO::setParticipants);

         });*/
       return modelMapper;
   }
}