import {ChangeDetectionStrategy, Component, effect, OnInit, signal} from '@angular/core';
import {CreatePackage} from "../../layout/create-package/create-package";
import {MainScreenComponent} from "../../layout/main-screen/main-screen.component";
import {MatTooltipModule} from '@angular/material/tooltip';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell, MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow, MatRowDef, MatTable
} from "@angular/material/table";
import {MatIcon} from "@angular/material/icon";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatMenu, MatMenuItem, MatMenuTrigger} from "@angular/material/menu";
import {AsyncPipe, CurrencyPipe} from "@angular/common";
import {MatAutocomplete, MatAutocompleteTrigger, MatOption} from "@angular/material/autocomplete";
import {MatError, MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {FormControl, ReactiveFormsModule, Validators} from "@angular/forms";
import {Observable, startWith} from "rxjs";
import {map} from "rxjs/operators";
import {Router} from "@angular/router";
import {ShopListService} from "../services/shop-list/shop-list.service";
import {EcommerceProductsService} from "../services/ecommerce/ecommerce-products.service";
import {EcommerceProducts} from "../models/ecommerceProducts.models";
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import {AuthService} from "../services/services";

@Component({
  selector: 'app-ecommerce',
  standalone: true,
  imports: [
    CreatePackage,
    MainScreenComponent,
    MatCell,
    MatCellDef,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderRow,
    MatHeaderRowDef,
    MatIcon,
    MatIconButton,
    MatMenu,
    MatMenuItem,
    MatRow,
    MatRowDef,
    MatTable,
    MatMenuTrigger,
    CurrencyPipe,
    MatHeaderCellDef,
    MatButton,
    AsyncPipe,
    MatAutocomplete,
    MatAutocompleteTrigger,
    MatError,
    MatFormField,
    MatInput,
    MatLabel,
    MatOption,
    ReactiveFormsModule,
    MatTooltipModule
  ],
  templateUrl: './ecommerce.component.html',
  styleUrl: './ecommerce.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EcommerceComponent implements OnInit {

  productsControl = new FormControl('');
  productsOptions: EcommerceProducts[] = [];
  filteredProductsOptions: Observable<string[]> | undefined;
  filteredProducts= signal<EcommerceProducts[]>(this.productsOptions);

  private _filter(value: string, options: string[]): string[] {
    const filterValue = value.toLowerCase();
    this.filteredProducts.set(this.productsOptions.filter(option => option.titulo.toLowerCase().includes(filterValue)));
    return options.filter(option => option.toLowerCase().includes(filterValue));
  }

  displayedColumns: string[] = ['imagen', 'titulo', 'descripcion', 'precio', 'unidades_disponibles', "acciones"];

  constructor(
    private router: Router,
    private shopListService: ShopListService,
    private ecommerceProductsService: EcommerceProductsService,
    private dialog: MatDialog,
    private auth0: AuthService
  ) {
    effect(() => {
      if (this.auth0.isAuthenticated()) {
        if (this.auth0.isAdmin()) {
          return
        } else if (this.auth0.isClient()) {
          this.router.navigate(['/agenda']);
        } else {
          this.router.navigate(['/home']);
        }
      } else {
        this.router.navigate(['/login']);
      }
    });
    console.log('is admin? ', this.auth0.isAdmin(), 'is client? ', this.auth0.isClient());
    this.productsOptions = this.ecommerceProductsService.getProducts();
  }

  ngOnInit() {
    this.filteredProductsOptions = this.productsControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '', this.productsOptions.map(product => product.titulo))),
    );

  }

  restarUnidad(elementid: number) {
    this.shopListService.setListaComprados(
      this.shopListService.getListaComprados()!
        .map(product => {
          if (product.id === elementid) {
            let producto = {
              id: product.id,
              unidades: product.unidades - 1
            };
            if (producto.unidades > 0) {
              return producto;
            } else {
              return null;
            }
          }
          return product;
        })
        .filter(product => product !== null) as { id: number; unidades: number; }[]
    );
  }

  sumarUnidad(elementid: number) {
    if (this.shopListService.getListaComprados() === null || this.shopListService.getListaComprados()!.length === 0) {
      this.shopListService.setListaComprados([{id: elementid, unidades: 1}]);
    } else {
      let added = false;
      this.shopListService.setListaComprados(this.shopListService.getListaComprados()!.map(product => {
        if (product.id === elementid) {
          added = true;
          return {
            id: product.id,
            unidades: product.unidades + 1
          };
        }
        return product;
      }));
      if (!added) {
        this.shopListService.setListaComprados([...this.shopListService.getListaComprados()!, {id: elementid, unidades: 1}]);
      }
    }
  }

  comprar() {
    if (this.shopListService.getListaComprados() != null || this.shopListService.getListaComprados()?.length != 0) {
      this.router.navigate(['/ecommerce/shopping_cart']);
    }
  }

  getProductQuantity(productId: number) {
    const product = this.shopListService.getListaComprados()?.find(producto => producto.id === productId);
    return product ? product.unidades : 0;
  }

  volver() {
    if (this.shopListService.getListaComprados() != null && this.shopListService.getListaComprados()?.length != 0) {
      this.dialog.open(ConfirmationDialogComponent, {data: {message: '¿Estás seguro de que deseas cancelar? Los cambios se perderán.'}}).afterClosed().subscribe((result: boolean) => {
        if (result) {
          this.router.navigate(['/admin/agenda']);
        }
      });
    } else {
      window.history.back();
    }
  }
}
