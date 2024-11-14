import {Injectable, signal} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ShopListService {

  listaComprados = signal<{
    id: number;
    unidades: number;
  }[] | null>(null);

  setListaComprados(data: {
    id: number;
    unidades: number;
  }[]) {
    this.listaComprados.set(data);
  }

  getListaComprados() {
    return this.listaComprados();
  }

}
