import { createActionGroup, props, emptyProps } from "@ngrx/store"
import { Product, ProductType, ProductFilters } from "./product.types"

export const ProductActions = createActionGroup({
  source: "Products",
  events: {
    "Load Products": props<{ productType?: "VINYL" | "ANTIQUE" | "MUSIC_EQUIPMENT" }>(),
    "Load Products Success": props<{ products: Product[] }>(),
    "Load Products Failure": props<{ error: string }>(),

    "Load Vinyls": emptyProps(),
    "Load Vinyls Success": props<{ vinyls: Product[] }>(),
    "Load Vinyls Failure": props<{ error: string }>(),

    "Load Equipment": emptyProps(),
    "Load Equipment Success": props<{ equipment: Product[] }>(),
    "Load Equipment Failure": props<{ error: string }>(),

    "Load Equipment By Id": props<{ id: string }>(),
    "Load Equipment By Id Success": props<{ equipment: Product }>(),
    "Load Equipment By Id Failure": props<{ error: string }>(),

    "Create Product": props<{ product: FormData }>(),
    "Create Product Success": props<{ product: Product }>(),
    "Create Product Failure": props<{ error: string }>(),

    "Update Product": props<{ id: string; product: FormData }>(),
    "Update Product Success": props<{ product: Product }>(),
    "Update Product Failure": props<{ error: string }>(),

    "Delete Product": props<{ id: string; productType: ProductType }>(),
    "Delete Product Success": props<{ id: string }>(),
    "Delete Product Failure": props<{ error: string }>(),

    "Select Product": props<{ id: string }>(),
    "Clear Selected Product": emptyProps(),

    "Set Product Type": props<{ productType: ProductType }>(),

    "Apply Filters": props<{ filters: ProductFilters }>(),
    "Reset Filters": emptyProps(),
  },
})

