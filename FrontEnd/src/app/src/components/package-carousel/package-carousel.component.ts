import { ActivityService } from './../services/services/activity.service';
import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Activity, Announcement } from '../models';
import { AnnouncementService } from '..';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { Package } from '../models/package.models';
import { PackageService } from '../services/services/package.service';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-package-carousel',
  standalone: true,
  imports: [
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatTabsModule,
    CurrencyPipe
  ],
  templateUrl: './package-carousel.component.html',
  styleUrl: './package-carousel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PackageCarouselComponent implements OnInit {
  
  packages: Package[] = [];
  groupedpackages: Package[][] = [];
  
  firstCarouselIndex = 0;
  secondCarouselIndex = 0;
  thirdCarouselIndex = 0;

  constructor(private packageService: PackageService) {
    this.loadpackages();
  }

  loadpackages() {
    this.packageService.getRandomPackages().subscribe(packages => {
      this.packages = packages;
      this.grouppackages();
      this.secondCarouselIndex = 1;
      this.thirdCarouselIndex = 2;
    });
  }

  ngOnInit() {
    console.log('Actividades agrupadas:', this.groupedpackages);
    console.log('Actividades:', this.packages);
  }

  grouppackages() {
    // Agrupar actividades en grupos de 3
    this.groupedpackages = [];
    for (let i = 0; i < this.packages.length; i += 3) {
      this.groupedpackages.push(this.packages.slice(i, i + 3));
    }
  }


  prevSlide() {
    // Ir al slide anterior
    if (this.firstCarouselIndex > 0) {
      this.firstCarouselIndex--;
      this.secondCarouselIndex--;
      this.thirdCarouselIndex--;
    }
  }

  nextSlide() {
    // Ir al siguiente slide
    if (this.thirdCarouselIndex < this.packages.length - 1) {
      this.firstCarouselIndex++;
      this.secondCarouselIndex++;
      this.thirdCarouselIndex++;
    }
  }
}
