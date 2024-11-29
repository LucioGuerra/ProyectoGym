import {Injectable, signal} from '@angular/core';
import {ProductQuantity} from "../../models/ecommerceProducts.models";

@Injectable({
  providedIn: 'root'
})
export class ShopListService {

  listaComprados = signal<ProductQuantity[] | null>(null);

  setListaComprados(data: ProductQuantity[]) {
    this.listaComprados.set(data);
  }

  getListaComprados() {
    return this.listaComprados();
  }

}
