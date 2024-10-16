import {ChangeDetectionStrategy, Component, OnInit, signal} from '@angular/core';
import {CreatePackage} from "../../layout/create-package/create-package";
import {CreateAppointmentFormComponent} from "../create-appointment-form/create-appointment-form.component";
import {FormControl, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatError, MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatOption, MatSelect, MatSelectChange} from "@angular/material/select";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {Activity, UserModel} from "../models";
import {ActivityService} from "../services/services";
import {MatAutocomplete, MatAutocompleteTrigger} from "@angular/material/autocomplete";
import {UserService} from "../services/services/user.service";
import {AsyncPipe, NgForOf} from "@angular/common";
import {Observable, startWith} from "rxjs";
import {User} from "@auth0/auth0-angular";
import {map} from "rxjs/operators";
import {Router} from '@angular/router';
import {ActivityPackage, Package} from "../models/package.models";

@Component({
  selector: 'app-creat-package-form',
  standalone: true,
  imports: [
    CreatePackage,
    CreateAppointmentFormComponent,
    FormsModule,
    MatError,
    MatFormField,
    MatInput,
    MatLabel,
    ReactiveFormsModule,
    MatSelect,
    MatOption,
    MatButton,
    MatIconButton,
    MatIcon,
    MatAutocomplete,
    MatAutocompleteTrigger,
    AsyncPipe,
    NgForOf
  ],
  templateUrl: './creat-package-form.component.html',
  styleUrl: './creat-package-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreatPackageFormComponent implements OnInit {
  myControl = new FormControl<string>('');
  activities: Activity[] = [];
  users: UserModel[] = [];
  activityQuantity = signal<number[]>([1]);
  selectedValues = signal<ActivityPackage[]>([{activityId: -1, quantity: 1}]);
  filteredOptions: Observable<UserModel[]> = new Observable<UserModel[]>();
  packageName = new FormControl<string>('');
  packageDescription = new FormControl<string>('');

  constructor(private activityService: ActivityService, private userService: UserService, private router: Router) {
    this.activityService.getActivities().subscribe(activities => this.activities = activities);
  }

  ngOnInit() {
    this.loadUsers();
    this.loadActivities();
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || ''))
    );
  }

  private loadUsers() {
    this.userService.getAllUsers().subscribe(users => this.users = users);
  }

  private loadActivities() {
    this.activityService.getActivities().subscribe(activities => this.activities = activities);
  }

  add() {
    this.activityQuantity.set([...this.activityQuantity(), this.activityQuantity().length + 1]);
    this.selectedValues.set([...this.selectedValues(), {activityId: -1, quantity: 1}]);
  }

  remove() {
    if (this.activityQuantity().length > 1) {
      this.activityQuantity.set([...this.activityQuantity().slice(0, -1)]);
      this.selectedValues.set([...this.selectedValues().slice(0, -1)]);
    }
  }

  onSelectChange(event: MatSelectChange) {
    const value = (event as unknown as HTMLSelectElement).value;
    this.selectedValues.set([...this.selectedValues(), {activityId: parseInt(value), quantity: 1}]);
  }

  displayUser(user: UserModel): string {
    return user && user.firstName ? `${user.firstName} ${user.lastName}` : '';
  }

  private _filter(dni: string): UserModel[] {
    const filterValue = dni.toLowerCase();
    return this.users.filter(user => user.dni.toLowerCase().includes(filterValue));
  }

  create() {
    if (this.packageName.value && this.packageDescription.value && this.myControl.value && this.myControl.value !== '' && this.selectedValues().length > 0 && this.selectedValues().every(value => value.activityId !== -1)) {
      let createdPackage: Package = {
        name: this.packageName.value,
        description: this.packageDescription.value!,
        userId: this.users.find(user => user.dni === this.myControl.value)?.id!,
        activities: this.selectedValues().map(value => value),
      }
      alert(`creado ${createdPackage}`);
    } else {
      alert('Faltan campos por completar');
    }
  }

  return() {
    this.router.navigate(['/admin/agenda']);
  }
}

