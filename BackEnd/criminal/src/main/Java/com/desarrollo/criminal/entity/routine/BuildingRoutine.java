package com.desarrollo.criminal.entity.routine;

import com.desarrollo.criminal.entity.user.User;
import jakarta.persistence.*;
import lombok.Getter;

import java.util.List;

@Getter
@Entity
@Table(name = "building_routine")
public class BuildingRoutine extends Routine{

    @OneToOne
    private User user;

    private BuildingRoutine(){}
}
