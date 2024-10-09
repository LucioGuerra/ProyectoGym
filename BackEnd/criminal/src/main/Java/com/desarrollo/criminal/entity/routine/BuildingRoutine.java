package com.desarrollo.criminal.entity.routine;

import com.desarrollo.criminal.entity.user.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "building_routine")
@AllArgsConstructor
public class BuildingRoutine extends Routine{

    @OneToOne
    private User user;

    private Day day;

    public BuildingRoutine(){

    }
}
