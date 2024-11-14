import {ChangeDetectionStrategy, Component, inject, OnInit, signal} from '@angular/core';
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {Observable, startWith} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {map} from "rxjs/operators";
import {MainScreenComponent} from "../../layout/main-screen/main-screen.component";
import {MatIconModule} from "@angular/material/icon";
import {MatFormField} from "@angular/material/form-field";
import {MatAutocomplete, MatAutocompleteTrigger, MatOption} from "@angular/material/autocomplete";
import { MatTableModule } from "@angular/material/table";
import {AsyncPipe, CurrencyPipe, NgOptimizedImage} from "@angular/common";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import { CommonModule } from '@angular/common';
import {ShopListService} from "../services/shop-list/shop-list.service";
import {EcommerceProducts} from "../models/ecommerceProducts.models";
import {EcommerceProductsService} from "../services/ecommerce/ecommerce-products.service";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-shopping-cart',
  standalone: true,
  imports: [
    CommonModule,
    MainScreenComponent,
    MatIconModule,
    MatFormField,
    MatAutocompleteTrigger,
    ReactiveFormsModule,
    MatAutocomplete,
    MatOption,
    MatTableModule,
    NgOptimizedImage,
    MatTooltipModule,
    CurrencyPipe,
    AsyncPipe,
    MatLabel,
    MatInput,
    MatButtonModule
  ],
  templateUrl: './shopping-cart.component.html',
  styleUrl: './shopping-cart.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShoppingCartComponent implements OnInit {
  private _snackBar = inject(MatSnackBar);
  productsOptions: EcommerceProducts[] = [];
  filteredProducts= signal<{
    id: number;
    titulo: string;
    descripcion: string;
    precio: number;
    imagen: string;
    unidades_disponibles: number;
  }[]>([]);

  displayedColumns: string[] = ['imagen', 'titulo', 'descripcion', 'precio', 'unidades_disponibles', "acciones"];

  constructor(private router: Router, private shopListService: ShopListService, private ecommerceProductsService: EcommerceProductsService) {
    this.productsOptions = this.ecommerceProductsService.getProducts();
  }

  ngOnInit() {
    console.log(this.shopListService.getListaComprados());
    console.log(this.filteredProducts());

    if (this.shopListService.getListaComprados() !== null) {
      this.shopListService.getListaComprados()!.forEach(producto => {
        this.filteredProducts.set([...this.filteredProducts(), this.productsOptions.find(product => product.id === producto.id)!]);
      });
    }
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
    // Incrementar la cantidad de unidades de un producto en la lista de comprados
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

  getProductQuantity(productId: number) {
    const product = this.shopListService.getListaComprados()?.find(producto => producto.id === productId);
    return product ? product.unidades : 0;
  }

  volver() {
    //const listaComprados = this.listaComprados();
    this.router.navigate(['/admin/ecommerce']);

  }

  precioTotal() {
    let total = 0;
    this.shopListService.getListaComprados()?.forEach(producto => {
      total += this.productsOptions.find(product => product.id === producto.id)!.precio * producto.unidades;
    });
    return total;
  }

  comprar() {
    if (this.shopListService.getListaComprados() !== null && this.shopListService.getListaComprados()!.length > 0) {
      let cantidadProductosTotal = this.shopListService.getListaComprados()!.reduce((acc, producto) => acc + producto.unidades, 0);
      this.ecommerceProductsService.comprarProducto(this.shopListService.getListaComprados()!);
      this._snackBar.open(`se ha enviado un pedido de ${cantidadProductosTotal} productos por $${this.precioTotal()}`, "close", {"duration": 5000})
    } else {
      this._snackBar.open("No hay productos en el carrito", "close", {"duration": 3000})
    }
  }
}
