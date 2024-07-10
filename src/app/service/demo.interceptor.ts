import { HttpInterceptorFn } from '@angular/common/http';
export const demoInterceptor: HttpInterceptorFn = (req, next) => {
  // Clone the request and add the authorization header
    let authReq;
    const token = localStorage.getItem('token');
 
  if(token){
     authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });  
  }else{
    authReq = req.clone();
  }
 
  // Pass the cloned request with the updated header to the next handler
  return next(authReq);
};