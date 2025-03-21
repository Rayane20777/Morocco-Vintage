import { createReducer, on } from '@ngrx/store';
import { ProductActions } from './product.actions';
import type { ProductState } from './product.types';
import { ProductType } from './product.types';

export const initialState: ProductState = {
  products: [],
  loading: false,
  error: null,
  selectedProduct: null,
  selectedProductType: 'VINYL'
};

export const productReducer = createReducer(
  initialState,
  
  // Load Products
  on(ProductActions.loadProducts, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  
  on(ProductActions.loadProductsSuccess, (state, { products }) => ({
    ...state,
    products,
    loading: false,
    error: null
  })),
  
  on(ProductActions.loadProductsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  
  // Create Product
  on(ProductActions.createProduct, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  
  on(ProductActions.createProductSuccess, (state, { product }) => ({
    ...state,
    products: [...state.products, product],
    loading: false,
    error: null
  })),
  
  on(ProductActions.createProductFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  
  // Update Product
  on(ProductActions.updateProduct, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  
  on(ProductActions.updateProductSuccess, (state, { product }) => ({
    ...state,
    products: state.products.map((p) => (p.id === product.id ? product : p)),
    loading: false,
    error: null
  })),
  
  on(ProductActions.updateProductFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  
  // Delete Product
  on(ProductActions.deleteProduct, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  
  on(ProductActions.deleteProductSuccess, (state, { id }) => ({
    ...state,
    products: state.products.filter((p) => p.id !== id),
    loading: false,
    error: null
  })),
  
  on(ProductActions.deleteProductFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  
  // Select Product
  on(ProductActions.selectProduct, (state, { id }) => ({
    ...state,
    selectedProduct: state.products.find((p) => p.id === id) || null
  })),
  
  on(ProductActions.clearSelectedProduct, (state) => ({
    ...state,
    selectedProduct: null
  })),
  
  on(ProductActions.setProductType, (state, { productType }) => ({
    ...state,
    selectedProductType: productType
  }))
); 