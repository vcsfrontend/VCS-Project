import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { SwitherService } from '../shared/services/swither.service';

export const salesOnlyGuard: CanActivateFn = (route, state) => {
  const switchService = inject(SwitherService);
  const router = inject(Router);

   const userDataStorage = localStorage.getItem('userDetails');
  const userData = userDataStorage ? JSON.parse(userDataStorage) : null;
  const userEmail = userData?.email || '';

  if (!userEmail) {
    router.navigate(['/auth/login']);
    return of(false);
  }

  return switchService.allSalesUsers().pipe(
    map(res => {
      const salesUsers = Array.isArray(res) ? res : [res];
      const isSales = salesUsers.some((user: any) => user.email === userEmail);
      if (!isSales) {
        router.navigate(['/auth/login']);
      }
      return isSales;
    }),
    catchError(() => {
      router.navigate(['/unauthorized']);
      return of(false);
    })
  );
};


