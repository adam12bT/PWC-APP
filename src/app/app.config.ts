import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
 
import { routes } from './app.routes';
import { HTTP_INTERCEPTORS, provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { demoInterceptor } from './service/demo.interceptor';
 
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withFetch())
    ,
    // { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true }
    provideHttpClient(withInterceptors([demoInterceptor])),
   
  ]
};
 