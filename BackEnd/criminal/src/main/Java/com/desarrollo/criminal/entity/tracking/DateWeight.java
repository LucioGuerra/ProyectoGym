package com.desarrollo.criminal.entity.tracking;

import jakarta.persistence.*;
import lombok.Getter;

import java.util.Date;

@Getter
@Entity
public class DateWeight {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Double weight;

    @Column(nullable = false)
    private Date date;

    @ManyToOne
    @JoinColumn(name = "tracking_id", nullable = false)
    private Tracking tracking;

    private DateWeight() {}
}
