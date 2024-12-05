import { Injectable } from '@angular/core';
import {EcommerceProducts, ProductQuantity} from "../../models/ecommerceProducts.models";

@Injectable({
  providedIn: 'root'
})
export class EcommerceProductsService {
  productos: EcommerceProducts[] = [
    {
      "id": 1,
      "titulo": "Mancuernas Ajustables",
      "descripcion": "Mancuernas con peso ajustable de 2 a 24 kg, ideales para entrenamiento de fuerza.",
      "precio": 150000,
      "imagen": "https://th.bing.com/th/id/OIP.4jFJxHRegQ8c7gxExALcvQAAAA?rs=1&pid=ImgDetMain",
      "unidades_disponibles": 50
    },
    {
      "id": 2,
      "titulo": "Cinta de Correr",
      "descripcion": "Cinta de correr plegable con velocidad ajustable y monitor de frecuencia cardíaca.",
      "precio": 700000,
      "imagen": "https://www.runnium.es/wp-content/uploads/2019/08/4-ejercicios-definitivos-en-cinta-de-correr-2048x1692.jpg",
      "unidades_disponibles": 20
    },
    {
      "id": 3,
      "titulo": "Banco de Pesas",
      "descripcion": "Banco de pesas ajustable para ejercicios de pecho, espalda y brazos.",
      "precio": 120000,
      "imagen": "https://th.bing.com/th/id/OIP.FG8ivJaGfFfKiLgoI0DqVwHaHa?rs=1&pid=ImgDetMain",
      "unidades_disponibles": 30
    },
    {
      "id": 4,
      "titulo": "Banda de Resistencia",
      "descripcion": "Banda elástica de resistencia media para entrenamiento funcional y rehabilitación.",
      "precio": 15000,
      "imagen": "https://images-na.ssl-images-amazon.com/images/I/71jFoWWIH8L._AC_SL1500_.jpg",
      "unidades_disponibles": 200
    },
    {
      "id": 5,
      "titulo": "Kettlebell de 12 kg",
      "descripcion": "Pesa rusa de 12 kg para entrenamiento de fuerza y acondicionamiento físico.",
      "precio": 35000,
      "imagen": "https://th.bing.com/th/id/OIP.VUeWFTBII-JepNMyNcdLRAHaHa?w=217&h=217&c=7&r=0&o=5&dpr=1.2&pid=1.7",
      "unidades_disponibles": 75
    },
    {
      "id": 6,
      "titulo": "Esterilla de Yoga",
      "descripcion": "Esterilla antideslizante para yoga y ejercicios de piso, fácil de limpiar.",
      "precio": 25000,
      "imagen": "https://th.bing.com/th/id/R.261a769b768a510e4fe06d70eaf9f2a3?rik=t5%2bcNrmMhJyl7Q&pid=ImgRaw&r=0",
      "unidades_disponibles": 100
    },
    {
      "id": 7,
      "titulo": "Rueda Abdominal",
      "descripcion": "Rueda para ejercicios abdominales, fortalecimiento de core y equilibrio.",
      "precio": 20000,
      "imagen": "https://th.bing.com/th/id/OIP.AXpbel-zHXMSiQ3xs9ed1wHaHa?rs=1&pid=ImgDetMain",
      "unidades_disponibles": 150
    },
    {
      "id": 8,
      "titulo": "Chaleco de Peso 10 kg",
      "descripcion": "Chaleco con peso ajustable de hasta 10 kg para mejorar la resistencia.",
      "precio": 60000,
      "imagen": "https://realplaza.vtexassets.com/arquivos/ids/15417285/image-401acf3729d84421a03cf4bce32a60ee.jpg?v=637408189732130000",
      "unidades_disponibles": 40
    },
    {
      "id": 9,
      "titulo": "Soga de Batalla",
      "descripcion": "Cuerda de 12 metros para entrenamiento de alta intensidad y resistencia cardiovascular.",
      "precio": 80000,
      "imagen": "https://th.bing.com/th/id/OIP.GURGFcLQ_7N3bTLfN9ZTzAHaHa?rs=1&pid=ImgDetMain",
      "unidades_disponibles": 25
    },
    {
      "id": 10,
      "titulo": "Rodillera Deportiva",
      "descripcion": "Rodillera con soporte ajustable para evitar lesiones durante el ejercicio.",
      "precio": 18000,
      "imagen": "https://i5.walmartimages.com.mx/mg/gm/3pp/asr/c0fde7e6-96ef-4de5-8ad6-b13bac32bf19.668421d2e6c6a7588074124b86d7b39d.jpeg?odnHeight=2000&odnWidth=2000&odnBg=ffffff",
      "unidades_disponibles": 300
    }
  ];
  constructor() { }

  getProducts(){
    return this.productos;
  }

  comprarProductos(listaProductos: ProductQuantity[]) {
    const productInfo = listaProductos.map(product => {
      const productDetails = this.productos.find(p => p.id === product.id);
      return `Product: ${productDetails?.titulo}\nQuantity: ${product.unidades}\nPrice: ${productDetails?.precio}\n\n`;
    }).join('');

    const blob = new Blob([productInfo], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'product_info.txt';
    a.click();
    window.URL.revokeObjectURL(url);
  }
}
