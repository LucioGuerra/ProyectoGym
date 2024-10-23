import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {AsyncPipe, NgForOf} from "@angular/common";
import {CreatePackage} from "../../layout/create-package/create-package";
import {MatAutocomplete, MatAutocompleteTrigger, MatOption} from "@angular/material/autocomplete";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatError, MatFormField, MatLabel} from "@angular/material/form-field";
import {MatIcon} from "@angular/material/icon";
import {MatInput} from "@angular/material/input";
import {MatSelect} from "@angular/material/select";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {Activity} from "../models";
import {ActivityService} from "../services/services";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-create-activity',
  standalone: true,
  imports: [
    AsyncPipe,
    CreatePackage,
    MatAutocomplete,
    MatAutocompleteTrigger,
    MatButton,
    MatError,
    MatFormField,
    MatIcon,
    MatIconButton,
    MatInput,
    MatLabel,
    MatOption,
    MatSelect,
    NgForOf,
    ReactiveFormsModule
  ],
  templateUrl: './create-activity.component.html',
  styleUrl: './create-activity.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateActivityComponent implements OnInit {
  activityId: string | null = null;
  activityName = new FormControl('');
  activityDescription = new FormControl('');
  activityPrice = new FormControl<number>(1000.0);

  constructor(private activityService: ActivityService, private router: Router, private route: ActivatedRoute) {

  }

  ngOnInit(): void {
    this.activityId = this.route.snapshot.paramMap.get('id');
    this.loadActivity();
  }

  loadActivity() {
    if (this.activityId) {
      this.activityService.getActivitybyId(this.activityId).subscribe((activity: Activity) => {
        this.activityName.setValue(activity.name);
        this.activityDescription.setValue(activity.description!);
        this.activityPrice.setValue(activity.price!);
      });
    }
  }

  create() {
    console.log(this.activityName.value);
    console.log(this.activityDescription.value);
    console.log(this.activityPrice.value);
    if (this.activityName.value && this.activityDescription.value && this.activityPrice.value && this.activityPrice.value > 0) {
      let createdActivity: Activity = {
        name: this.activityName.value,
        description: this.activityDescription.value,
        price: this.activityPrice.value
      }
      this.activityService.createActivity(createdActivity).subscribe(
        (response) => {
          console.log(response);
          alert("se creo correctamente");
        },
        (error) => {
          console.error(error);
          alert(`error ${error}`);
        }
      );
      alert(`creado ${createdActivity}`);
    } else {
      alert('Faltan campos por completar');
    }
  }

  return() {
    this.router.navigate(['/admin/agenda']);
  }
}
