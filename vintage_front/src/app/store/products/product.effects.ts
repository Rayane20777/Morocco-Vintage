import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';
import { ApiService } from '../../services/api.service';
import { ProductActions } from './product.actions';

@Injectable()
export class ProductEffects {
  loadProducts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductActions.loadProducts),
      mergeMap(({ productType }) => {
        let request$;
        switch (productType) {
          case 'VINYL':
            request$ = this.apiService.getAllVinyls();
            break;
          case 'ANTIQUE':
            request$ = this.apiService.getAllAntiques();
            break;
          default:
            request$ = this.apiService.getAllVinyls(); // Default to vinyls
        }
        
        return request$.pipe(
          map(products => ProductActions.loadProductsSuccess({ products })),
          catchError(error => of(ProductActions.loadProductsFailure({ error: error.message })))
        );
      })
    )
  );

  createProduct$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductActions.createProduct),
      mergeMap(({ product }) =>
        this.apiService.createVinyl(product).pipe(
          map(newProduct => ProductActions.createProductSuccess({ product: newProduct })),
          catchError(error => of(ProductActions.createProductFailure({ error: error.message })))
        )
      )
    )
  );

  updateProduct$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductActions.updateProduct),
      mergeMap(({ id, product }) =>
        this.apiService.updateVinyl(id, product).pipe(
          map(updatedProduct => ProductActions.updateProductSuccess({ product: updatedProduct })),
          catchError(error => of(ProductActions.updateProductFailure({ error: error.message })))
        )
      )
    )
  );

  deleteProduct$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductActions.deleteProduct),
      mergeMap(({ id }) =>
        this.apiService.deleteVinyl(id).pipe(
          map(() => ProductActions.deleteProductSuccess({ id })),
          catchError(error => of(ProductActions.deleteProductFailure({ error: error.message })))
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private apiService: ApiService
  ) {}
} 