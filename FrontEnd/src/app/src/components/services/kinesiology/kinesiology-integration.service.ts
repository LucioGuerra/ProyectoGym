import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class KinesiologyIntegrationService {

  kinesiologos = [
    {
      "id": 1,
      "name": "Kinesiologo 1",
      "bodyParts": [1, 2, 3, 8], // IDs de "Cuello", "Hombros", "Espalda", "Manos"
      "apellido": "Apellido",
      "email": "algo@algo",
      "dni": "12345678",
    },
    {
      "id": 2,
      "name": "Kinesiologo 2",
      "bodyParts": [3, 4, 5, 6, 7], // IDs de "Espalda", "Codos", "Muñecas", "Cadera", "Rodillas"
      "apellido": "Apellido",
      "email": "algo@algo",
      "dni": "12345678",
    },
    {
      "id": 3,
      "name": "Kinesiologo 3",
      "bodyParts": [8, 9, 10], // IDs de "Manos", "Pies", "Tobillos"
      "apellido": "Apellido",
      "email": "algo@algo",
      "dni": "12345678",
    },
    {
      "id": 4,
      "name": "Kinesiologo 4",
      "bodyParts": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], // Todos los IDs
      "apellido": "Apellido",
      "email": "algo@algo",
      "dni": "12345678",
    },
    {
      "id": 5,
      "name": "Kinesiologo 5",
      "bodyParts": [1, 2, 3, 4, 5],
      "apellido": "Apellido",
      "email": "algo@algo",
      "dni": "12345678",
    },
    {
      "id": 6,
      "name": "Kinesiologo 6",
      "bodyParts": [6, 7, 8, 9, 10],
      "apellido": "Apellido",
      "email": "algo@algo",
      "dni": "12345678",
    },
    {
      "id": 7,
      "name": "Kinesiologo 7",
      "bodyParts": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      "apellido": "Apellido",
      "email": "algo@algo",
      "dni": "12345678",
    },
    {
      "id": 8,
      "name": "Kinesiologo 8",
      "bodyParts": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      "apellido": "Apellido",
      "email": "algo@algo",
      "dni": "12345678",
    },
    {
      "id": 9,
      "name": "Kinesiologo 9",
      "bodyParts": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      "apellido": "Apellido",
      "email": "algo@algo",
      "dni": "12345678",
    },
    {
      "id": 10,
      "name": "Kinesiologo 10",
      "bodyParts": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      "apellido": "Apellido",
      "email": "algo@algo",
      "dni": "12345678",
    },
  ]
  bodyPartOptions = [
    {"id": 1, "name": "Cuello"},
    {"id": 2, "name": "Hombros"},
    {"id": 3, "name": "Espalda"},
    {"id": 4, "name": "Codos"},
    {"id": 5, "name": "Muñecas"},
    {"id": 6, "name": "Cadera"},
    {"id": 7, "name": "Rodillas"},
    {"id": 8, "name": "Manos"},
    {"id": 9, "name": "Pies"},
    {"id": 10, "name": "Tobillos"},
  ];

  endpointResponse = {
    "kinesiologos": this.kinesiologos,
    "bodyParts": this.bodyPartOptions,
  }

  constructor() { }

  getKinesiologos() {
    return this.endpointResponse;
  }
}
