import { createReducer, on } from "@ngrx/store"
import { ProductActions } from "./product.actions"
import { ProductState, ProductFilters } from "./product.types"

const initialFilters: ProductFilters = {
  category: [],
  price: { min: 0, max: 1000 },
  condition: [],
  genre: [],
  style: [],
  searchTerm: "",
}

export const initialState: ProductState = {
  products: [],
  loading: false,
  error: null,
  selectedProduct: null,
  selectedProductType: "VINYL",
  filteredProducts: [],
  filters: initialFilters,
}

export const productReducer = createReducer(
  initialState,

  // Load Products
  on(ProductActions.loadProducts, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(ProductActions.loadProductsSuccess, (state, { products }) => ({
    ...state,
    products,
    filteredProducts: products, // Initialize filtered products with all products
    loading: false,
    error: null,
  })),

  on(ProductActions.loadProductsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Load Vinyls
  on(ProductActions.loadVinyls, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(ProductActions.loadVinylsSuccess, (state, { vinyls }) => ({
    ...state,
    products: vinyls,
    filteredProducts: vinyls, // Initialize filtered products with all vinyls
    loading: false,
    error: null,
  })),

  on(ProductActions.loadVinylsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Load Equipment
  on(ProductActions.loadEquipment, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(ProductActions.loadEquipmentSuccess, (state, { equipment }) => ({
    ...state,
    products: equipment,
    filteredProducts: equipment,
    loading: false,
    error: null,
  })),

  on(ProductActions.loadEquipmentFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Load Equipment By Id
  on(ProductActions.loadEquipmentById, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(ProductActions.loadEquipmentByIdSuccess, (state, { equipment }) => ({
    ...state,
    selectedProduct: equipment,
    loading: false,
    error: null,
  })),

  on(ProductActions.loadEquipmentByIdFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Create Product
  on(ProductActions.createProduct, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(ProductActions.createProductSuccess, (state, { product }) => ({
    ...state,
    products: [...state.products, product],
    filteredProducts: applyFilters([...state.products, product], state.filters),
    loading: false,
    error: null,
  })),

  on(ProductActions.createProductFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Update Product
  on(ProductActions.updateProduct, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(ProductActions.updateProductSuccess, (state, { product }) => {
    const updatedProducts = state.products.map((p) => (p.id === product.id ? product : p))
    return {
      ...state,
      products: updatedProducts,
      filteredProducts: applyFilters(updatedProducts, state.filters),
      loading: false,
      error: null,
    }
  }),

  on(ProductActions.updateProductFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Delete Product
  on(ProductActions.deleteProduct, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(ProductActions.deleteProductSuccess, (state, { id }) => {
    const updatedProducts = state.products.filter((p) => p.id !== id)
    return {
      ...state,
      products: updatedProducts,
      filteredProducts: applyFilters(updatedProducts, state.filters),
      loading: false,
      error: null,
    }
  }),

  on(ProductActions.deleteProductFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Select Product
  on(ProductActions.selectProduct, (state, { id }) => ({
    ...state,
    selectedProduct: state.products.find((p) => p.id === id) || null,
  })),

  on(ProductActions.clearSelectedProduct, (state) => ({
    ...state,
    selectedProduct: null,
  })),

  on(ProductActions.setProductType, (state, { productType }) => ({
    ...state,
    selectedProductType: productType,
  })),

  // Filter Products
  on(ProductActions.applyFilters, (state, { filters }) => ({
    ...state,
    filters,
    filteredProducts: applyFilters(state.products, filters),
  })),

  on(ProductActions.resetFilters, (state) => ({
    ...state,
    filters: initialFilters,
    filteredProducts: state.products,
  })),
)

// Helper function to apply filters
function applyFilters(products: any[], filters: ProductFilters) {
  return products.filter((product) => {
    // Search term filter
    const matchesSearch =
      !filters.searchTerm ||
      filters.searchTerm === "" ||
      product.name?.toLowerCase().includes(filters.searchTerm?.toLowerCase() || "") ||
      product.description?.toLowerCase().includes(filters.searchTerm?.toLowerCase() || "") ||
      (product.artists &&
        product.artists.some((artist: string) =>
          artist.toLowerCase().includes(filters.searchTerm?.toLowerCase() || ""),
        ))

    // Category filter
    const matchesCategory =
      filters.category.length === 0 ||
      (product.genres && product.genres.some((genre: string) => filters.category.includes(genre)))

    // Price filter
    const matchesPrice =
      product.price >= filters.price.min && (filters.price.max === 0 || product.price <= filters.price.max)

    // Genre filter
    const matchesGenre =
      !filters.genre ||
      filters.genre.length === 0 ||
      (product.genres && product.genres.some((genre: string) => filters.genre?.includes(genre)))

    // Style filter
    const matchesStyle =
      !filters.style ||
      filters.style.length === 0 ||
      (product.styles && product.styles.some((style: string) => filters.style?.includes(style)))

    return matchesSearch && matchesCategory && matchesPrice && matchesGenre && matchesStyle
  })
}

