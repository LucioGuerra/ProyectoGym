package com.desarrollo.criminal.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@Entity
public class PackageActivity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "activity_id", nullable = false)
    private Activity activity;

    @ManyToOne
    @JoinColumn(name = "package_id", nullable = false)
    private Package aPackage;

    @Column(nullable = false)
    private Integer quantity;

    public PackageActivity(Activity activity, Integer quantity, Package aPackage) {
        this.activity = activity;
        this.quantity = quantity;
        this.aPackage = aPackage;
    }

}
