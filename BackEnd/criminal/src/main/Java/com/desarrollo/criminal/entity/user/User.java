package com.desarrollo.criminal.entity.user;

import com.desarrollo.criminal.entity.Package;
import com.desarrollo.criminal.entity.routine.Routine;
import com.desarrollo.criminal.entity.tracking.Tracking;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.net.URL;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Getter
@Setter
@Entity
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "first_name",length = 25, nullable = false)
    private String firstName;

    @Column(name = "last_name",length = 25, nullable = false)
    private String lastName;

    @Column(unique = true)
    private String email;

    @Column(unique = true)
    private String dni;

    private Role role;

    @Column(length = 15)
    private String phone;

    @Column
    private URL picture;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @OneToOne
    private Routine routine;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    @JsonManagedReference
    private List<Package> aPackage;

    @OneToMany(cascade = CascadeType.ALL)
    private List<Tracking> trackings;

    @OneToMany(cascade = CascadeType.ALL)
    @JoinColumn(name = "user_id")
    @JsonBackReference
    private Set<UserXAppointment> userXAppointments;

    private User(){
        aPackage = new ArrayList<>();
        userXAppointments = new HashSet<>();
    }

    public void deletePackage(){
        this.aPackage = null;
    }

    public void addAPackage(Package aPackage){
        this.aPackage.add(aPackage);
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