package com.desarrollo.criminal.entity.user;

import com.desarrollo.criminal.entity.Activity;
import com.desarrollo.criminal.entity.Appointment;
import com.desarrollo.criminal.entity.Package;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
public class UserXAnnouncement {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "appointment_id", nullable = false)
    private Appointment appointment;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private Boolean present;

    public UserXAnnouncement(Appointment appointment, User user) {
        this.appointment = appointment;
        this.user = user;
        this.present = false;
    }
}
