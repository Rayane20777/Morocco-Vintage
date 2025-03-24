import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { AuthInterceptor } from './services/auth.interceptor';

@NgModule({
  // ... other configurations ...
  providers: [
    provideHttpClient(withInterceptors([AuthInterceptor])),
    // ... other providers
  ],
})
export class AppModule { } 