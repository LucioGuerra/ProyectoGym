package com.desarrollo.criminal.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.AssertTrue;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;


@Setter
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

    @Column(nullable = false)
    private Boolean softDelete = false;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    public Activity() {
    }

    @PrePersist
    private void onCreate() {
        createdAt = LocalDateTime.now();
    }

}
