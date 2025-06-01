import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { salesOnlyGuard } from './sales-only.guard';

describe('salesOnlyGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => salesOnlyGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
