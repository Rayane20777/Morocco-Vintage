import { createReducer, on } from '@ngrx/store';
import { ProductState } from './product.types';
import { ProductActions } from './product.actions';

export const initialState: ProductState = {
  products: [],
  loading: false,
  error: null,
  selectedProduct: null
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
    loading: false
  })),
  
  on(ProductActions.loadProductsFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false
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
    loading: false
  })),
  
  on(ProductActions.createProductFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false
  })),
  
  // Update Product
  on(ProductActions.updateProduct, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  
  on(ProductActions.updateProductSuccess, (state, { product }) => ({
    ...state,
    products: state.products.map(p => p.id === product.id ? product : p),
    loading: false
  })),
  
  on(ProductActions.updateProductFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false
  })),
  
  // Delete Product
  on(ProductActions.deleteProduct, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  
  on(ProductActions.deleteProductSuccess, (state, { id }) => ({
    ...state,
    products: state.products.filter(p => p.id !== id),
    loading: false
  })),
  
  on(ProductActions.deleteProductFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false
  })),
  
  // Select Product
  on(ProductActions.selectProduct, (state, { id }) => ({
    ...state,
    selectedProduct: state.products.find(p => p.id === id) || null
  })),
  
  on(ProductActions.clearSelectedProduct, (state) => ({
    ...state,
    selectedProduct: null
  }))
); 