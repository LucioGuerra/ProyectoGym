package com.desarrollo.criminal.entity.user;

import com.desarrollo.criminal.entity.Appointment;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
public class UserXAppointment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "appointment_id", nullable = false)
    private Appointment appointment;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private Boolean attendance;

    private UserXAppointment() {
    }

    public UserXAppointment(Appointment appointment, User user) {
        this.appointment = appointment;
        this.user = user;
        this.attendance = false;
    }
}
