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
import {PackageService} from "../services/services/package.service";

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
  selectedUser = signal<UserModel | null>(null);
  activityQuantity = signal<number[]>([1]);
  selectedValues = signal<ActivityPackage[]>([{activityId: -1, quantity: 1}]);
  filteredOptions: Observable<UserModel[]> = new Observable<UserModel[]>();
  packageName = new FormControl('');
  packageDescription = new FormControl('');

  constructor(private packageService: PackageService, private activityService: ActivityService, private userService: UserService, private router: Router) {
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

  onSelectChange(event: MatSelectChange, index: number) {
    const value = (event as unknown as HTMLSelectElement).value;
    const updatedValues = [...this.selectedValues()];
    console.log(value);
    console.log(index);
    console.log(updatedValues);
    // Actualizamos el valor en el índice correspondiente
    updatedValues[index - 1] = { ...updatedValues[index - 1], activityId: parseInt(value, 10) };
    console.log(updatedValues)
    // Establecemos la nueva lista actualizada en la señal
    this.selectedValues.set(updatedValues);
    console.log(updatedValues);
  }

  displayUser(user: UserModel): string {
    return user && user.firstName ? `${user.firstName} ${user.lastName}` : '';
  }

  private _filter(dni: string): UserModel[] {
    const filterValue = dni;
    return this.users.filter(user => user.dni.includes(filterValue));
  }

  onUserSelected(user: UserModel) {
    this.selectedUser.set(user);
  }

  create() {
    console.log(this.packageName.value);
    console.log(this.packageDescription.value);
    console.log(this.selectedUser());
    console.log(this.selectedValues());
    if (this.packageName.value && this.packageDescription.value && this.selectedUser() != null && this.selectedValues().length > 0 && this.selectedValues().every(value => value.activityId !== -1)) {
      let createdPackage: Package = {
        name: this.packageName.value,
        description: this.packageDescription.value,
        userId: this.selectedUser()!.id!,
        activities: this.selectedValues().map(value => value),
      }
      this.packageService.createPackage(createdPackage).subscribe(
        (response) => {
          console.log(response);
          alert(`creado ${response}`);
        },
        (error) => {
          console.error(error);
          alert(`error ${error}`);
        }
      );
      alert(`creado ${createdPackage}`);
    } else {
      alert('Faltan campos por completar');
    }
  }

  return() {
    this.router.navigate(['/admin/agenda']);
  }

  onQuantityChange(event: Event, index: number) {
    const inputElement = event.target as HTMLInputElement;
    const value = parseInt(inputElement.value, 10);

    const updatedValues = [...this.selectedValues()];

    updatedValues[index - 1] = { ...updatedValues[index-1], quantity: value };

    this.selectedValues.set(updatedValues);

    console.log(updatedValues);
  }
}

