import { createActionGroup, props, emptyProps } from '@ngrx/store';
import { Product, ProductType } from './product.types';

export const ProductActions = createActionGroup({
  source: 'Products',
  events: {
    'Load Products': props<{ productType?: 'VINYL' | 'ANTIQUE' | 'MUSIC_EQUIPMENT' }>(),
    'Load Products Success': props<{ products: Product[] }>(),
    'Load Products Failure': props<{ error: string }>(),
    
    'Create Product': props<{ product: FormData }>(),
    'Create Product Success': props<{ product: Product }>(),
    'Create Product Failure': props<{ error: string }>(),
    
    'Update Product': props<{ id: string; product: FormData }>(),
    'Update Product Success': props<{ product: Product }>(),
    'Update Product Failure': props<{ error: string }>(),
    
    'Delete Product': props<{ id: string; productType: ProductType }>(),
    'Delete Product Success': props<{ id: string }>(),
    'Delete Product Failure': props<{ error: string }>(),
    
    'Select Product': props<{ id: string }>(),
    'Clear Selected Product': emptyProps(),

    'Set Product Type': props<{ productType: ProductType }>()
  }
}); 