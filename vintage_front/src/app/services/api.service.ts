import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../store/products/product.types';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:8081/api'; // Adjust URL as needed

  constructor(private http: HttpClient) {}

  getAllVinyls(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/vinyls`);
  }

  getAllAntiques(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/antiques`);
  }

  getAllEquipment(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/music-equipment`);
  }

  createVinyl(product: FormData): Observable<Product> {
    return this.http.post<Product>(`${this.apiUrl}/admin/vinyls`, product);
  }

  updateVinyl(id: string, product: FormData): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/admin/vinyls/${id}`, product);
  }

  deleteVinyl(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/admin/vinyls/${id}`);
  }

  createAntique(product: FormData): Observable<Product> {
    return this.http.post<Product>(`${this.apiUrl}/admin/antiques`, product);
  }

  updateAntique(id: string, product: FormData): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/admin/antiques/${id}`, product);
  }

  deleteAntique(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/admin/antiques/${id}`);
  }

  createEquipment(product: FormData): Observable<Product> {
    return this.http.post<Product>(`${this.apiUrl}/admin/music-equipment`, product);
  }

  updateEquipment(id: string, product: FormData): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/admin/music-equipment/${id}`, product);
  }

  deleteEquipment(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/admin/music-equipment/${id}`);
  }
} 