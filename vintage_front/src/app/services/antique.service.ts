import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable, map } from 'rxjs'
import { environment } from '../../environments/environment'
import { Antique } from '../store/antiques/antique.types'
import { ApiService } from './api.service'
import { Product } from '../store/products/product.types'

@Injectable({
  providedIn: 'root'
})
export class AntiqueService {
  private apiUrl = `${environment.apiUrl}/antiques`

  constructor(
    private http: HttpClient,
    private apiService: ApiService
  ) {}

  private mapProductToAntique(product: Product): Antique {
    return {
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      imageUrl: product.imageId ? `${environment.apiUrl}/images/${product.imageId}` : '/assets/placeholder.svg',
      category: product.typeId || 'Uncategorized',
      condition: product.condition || 'Unknown',
      year: product.year,
      dimensions: {
        length: 0,
        width: 0,
        height: 0
      },
      materials: [],
      status: product.status as 'AVAILABLE' | 'SOLD' | 'RESERVED',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  }

  getAllAntiques(): Observable<Antique[]> {
    return this.apiService.getProducts('ANTIQUE').pipe(
      map(products => products.map(product => this.mapProductToAntique(product)))
    )
  }

  getAntiqueById(id: string): Observable<Antique> {
    return this.apiService.getProducts('ANTIQUE').pipe(
      map(products => {
        const product = products.find(p => p.id === id)
        if (!product) throw new Error(`Antique with ID ${id} not found`)
        return this.mapProductToAntique(product)
      })
    )
  }

  searchAntiques(query: string): Observable<Antique[]> {
    return this.apiService.getProducts('ANTIQUE').pipe(
      map(products => products
        .filter(product => 
          product.name.toLowerCase().includes(query.toLowerCase()) ||
          product.description.toLowerCase().includes(query.toLowerCase())
        )
        .map(product => this.mapProductToAntique(product))
      )
    )
  }
} 