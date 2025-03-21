import { createSelector, createFeatureSelector } from '@ngrx/store';
import type { ProductState } from './product.types';

export const selectProductState = createFeatureSelector<ProductState>('products');

export const selectSelectedProductType = createSelector(
  selectProductState,
  (state: ProductState) => state.selectedProductType
);

export const selectProducts = createSelector(
  selectProductState,
  (state: ProductState) => state.products
);

export const selectProductLoading = createSelector(
  selectProductState,
  (state: ProductState) => state.loading
);

export const selectProductError = createSelector(
  selectProductState,
  (state: ProductState) => state.error
); 