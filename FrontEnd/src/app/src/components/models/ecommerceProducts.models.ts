export interface EcommerceProducts {
  id: number;
  titulo: string;
  descripcion: string;
  precio: number;
  imagen: string;
  unidades_disponibles: number;
}

export interface ProductQuantity {
  id: number;
  unidades: number;
}
