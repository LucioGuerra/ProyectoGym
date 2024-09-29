package com.desarrollo.criminal.entity;

import com.desarrollo.criminal.entity.user.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Setter
@Getter
@Entity
public class Package {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 50)
    private String name;

    @Column(length = 150)
    private String description;

    @Column(name = "expiration_date", nullable = false)
    private LocalDate expirationDate;

    @Column(nullable = false)
    private Integer credits;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Getter
    @ManyToMany
    @JoinTable(
            name = "package_activity",
            joinColumns = @JoinColumn(name = "package_id"),
            inverseJoinColumns = @JoinColumn(name = "activity_id")
    )
    private Set<Activity> activities;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private Package(){

    }

    public Package(String name, String description, Integer credits) {
        this.name = name;
        this.description = description;
        this.expirationDate = LocalDate.now().plusDays(30);
        this.credits = credits;
        this.activities = new HashSet<>();
    }

    public List<String> getActivitiesNames(){
        return activities.stream().map(Activity::getName).toList();
    }

    public void deleteUser(){
        this.user = null;
    }

    @PrePersist
    private void onCreate() {
        LocalDateTime now = LocalDateTime.now();
        this.createdAt = now;
        this.updatedAt = now;
    }

    @PreUpdate
    private void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

}
