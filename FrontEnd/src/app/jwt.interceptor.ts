import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpInterceptorFn } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './src/components/services/services/auth.service';

export const JwtInterceptor: HttpInterceptorFn = (req, next) => {
  console.log('Interceptor');
  const token = localStorage.getItem('access_token');
  if (token && !req.url.includes('public')) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }
  return next(req);
}
