import { Injectable } from "@angular/core"
import { Actions, createEffect, ofType } from "@ngrx/effects"
import { Store } from "@ngrx/store"
import { of } from "rxjs"
import { map, catchError, switchMap, take } from "rxjs/operators"
import { ApiService } from "../../services/api.service"
import { ProductActions } from "./product.actions"
import { selectSelectedProductType } from "./product.selectors"
import { ErrorHandlerService } from "../../services/error-handler.service"

@Injectable()
export class ProductEffects {
  constructor(
    private actions$: Actions,
    private apiService: ApiService,
    private store: Store,
    private errorHandler: ErrorHandlerService,
  ) {}

  loadProducts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductActions.loadProducts),
      switchMap((action) => {
        return this.apiService.getProducts(action.productType || "VINYL").pipe(
          map((products) => ProductActions.loadProductsSuccess({ products })),
          catchError((error) => {
            // Use the error handler service to handle token expiration
            const errorMessage = this.errorHandler.handleError(error)
            return of(ProductActions.loadProductsFailure({ error: errorMessage }))
          }),
        )
      }),
    ),
  )

  loadVinyls$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductActions.loadVinyls),
      switchMap(() => {
        return this.apiService.getAllVinyls().pipe(
          map((vinyls) => ProductActions.loadVinylsSuccess({ vinyls })),
          catchError((error) => {
            const errorMessage = this.errorHandler.handleError(error)
            return of(ProductActions.loadVinylsFailure({ error: errorMessage }))
          }),
        )
      }),
    ),
  )

  loadEquipment$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductActions.loadEquipment),
      switchMap(() => {
        return this.apiService.getAllEquipment().pipe(
          map((equipment) => ProductActions.loadEquipmentSuccess({ equipment })),
          catchError((error) => {
            const errorMessage = this.errorHandler.handleError(error)
            return of(ProductActions.loadEquipmentFailure({ error: errorMessage }))
          }),
        )
      }),
    ),
  )

  loadEquipmentById$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductActions.loadEquipmentById),
      switchMap((action) => {
        return this.apiService.getEquipmentById(action.id).pipe(
          map((equipment) => ProductActions.loadEquipmentByIdSuccess({ equipment })),
          catchError((error) => {
            const errorMessage = this.errorHandler.handleError(error)
            return of(ProductActions.loadEquipmentByIdFailure({ error: errorMessage }))
          }),
        )
      }),
    ),
  )

  createProduct$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductActions.createProduct),
      switchMap((action) =>
        this.apiService.createProduct(action.product).pipe(
          map((product) => ProductActions.createProductSuccess({ product })),
          catchError((error) => {
            console.error("Error creating product:", error)
            return of(ProductActions.createProductFailure({ error: error.message }))
          }),
        ),
      ),
    ),
  )

  updateProduct$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductActions.updateProduct),
      switchMap((action) =>
        this.apiService.updateProduct(action.id, action.product).pipe(
          map((product) => ProductActions.updateProductSuccess({ product })),
          catchError((error) => {
            console.error("Error updating product:", error)
            return of(ProductActions.updateProductFailure({ error: error.message }))
          }),
        ),
      ),
    ),
  )

  deleteProduct$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductActions.deleteProduct),
      switchMap((action) => {
        return this.store.select(selectSelectedProductType).pipe(
          take(1),
          switchMap((productType) => {
            switch (productType) {
              case "VINYL":
                return this.apiService.deleteVinyl(action.id)
              case "ANTIQUE":
                return this.apiService.deleteAntique(action.id)
              case "MUSIC_EQUIPMENT":
                return this.apiService.deleteEquipment(action.id)
              default:
                throw new Error(`Invalid product type: ${productType}`)
            }
          }),
          map(() => ProductActions.deleteProductSuccess({ id: action.id })),
          catchError((error) => {
            console.error("Error deleting product:", error)
            return of(ProductActions.deleteProductFailure({ error: error.message }))
          }),
        )
      }),
    ),
  )
}

