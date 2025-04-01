import { createSelector, createFeatureSelector } from "@ngrx/store"
import { ProductState } from "./product.types"

export const selectProductState = createFeatureSelector<ProductState>("products")

export const selectSelectedProductType = createSelector(
  selectProductState,
  (state: ProductState) => state.selectedProductType,
)

export const selectProducts = createSelector(selectProductState, (state: ProductState) => state.products)

export const selectFilteredProducts = createSelector(
  selectProductState,
  (state: ProductState) => state.filteredProducts,
)

export const selectProductLoading = createSelector(selectProductState, (state: ProductState) => state.loading)

export const selectProductError = createSelector(selectProductState, (state: ProductState) => state.error)

export const selectProductFilters = createSelector(selectProductState, (state: ProductState) => state.filters)

export const selectVinyls = createSelector(selectProducts, (products) =>
  products.filter((product) => product.type === "VINYL"),
)

export const selectFilteredVinyls = createSelector(selectFilteredProducts, (products) =>
  products.filter((product) => product.type === "VINYL"),
)

export const selectEquipment = createSelector(selectProducts, (products) =>
  products.filter((product) => product.type === "MUSIC_EQUIPMENT"),
)

export const selectFilteredEquipment = createSelector(selectFilteredProducts, (products) =>
  products.filter((product) => product.type === "MUSIC_EQUIPMENT"),
)

export const selectSelectedProduct = createSelector(selectProductState, (state: ProductState) => state.selectedProduct)

export const selectGenres = createSelector(selectVinyls, (vinyls) => {
  const genreSet = new Set<string>()
  vinyls.forEach((vinyl) => {
    if (vinyl.genres && Array.isArray(vinyl.genres)) {
      vinyl.genres.forEach((genre) => genreSet.add(genre))
    }
  })
  return Array.from(genreSet)
})

export const selectStyles = createSelector(selectVinyls, (vinyls) => {
  const styleSet = new Set<string>()
  vinyls.forEach((vinyl) => {
    if (vinyl.styles && Array.isArray(vinyl.styles)) {
      vinyl.styles.forEach((style) => styleSet.add(style))
    }
  })
  return Array.from(styleSet)
})

export const selectEquipmentConditions = createSelector(selectEquipment, (equipment) => {
  const conditionSet = new Set<string>()
  equipment.forEach((item) => {
    if (item.equipmentCondition) {
      conditionSet.add(item.equipmentCondition)
    }
  })
  return Array.from(conditionSet)
})

export const selectEquipmentOrigins = createSelector(selectEquipment, (equipment) => {
  const originSet = new Set<string>()
  equipment.forEach((item) => {
    if (item.origin) {
      originSet.add(item.origin)
    }
  })
  return Array.from(originSet)
})

