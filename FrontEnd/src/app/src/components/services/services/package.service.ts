import { Injectable } from '@angular/core';
import {environment} from "../../../../../environments";
import {HttpClient} from "@angular/common/http";
import {Package} from "../../models/package.models";

@Injectable({
  providedIn: 'root'
})
export class PackageService {
  private apiUrl = `${environment.apiUrl}/packages`;

  constructor(private http: HttpClient) {
  }


  createPackage(packageData: Package) {
    console.log(packageData);
    return this.http.post<Package>(this.apiUrl, packageData);
  }
}