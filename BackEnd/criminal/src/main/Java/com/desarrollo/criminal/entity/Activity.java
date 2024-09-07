package com.desarrollo.criminal.entity;

import com.desarrollo.criminal.entity.routine.ActivityRoutine;
import jakarta.persistence.*;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Entity
public class Activity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 20)
    private String name;

    @Column(length = 100)
    private String description;

    @Column(nullable = false)
    private Float price;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "activity", cascade = CascadeType.ALL)
    private List<ActivityRoutine> routines;

    private Activity(){
    }

    public Activity(String name, String description) {
        this.name = name;
        this.description = description;
    }

    @PrePersist
    private void onCreate() {
        createdAt = LocalDateTime.now();
    }

}
