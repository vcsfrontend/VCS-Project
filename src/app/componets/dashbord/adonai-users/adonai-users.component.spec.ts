import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdonaiUsersComponent } from './adonai-users.component';

describe('AdonaiUsersComponent', () => {
  let component: AdonaiUsersComponent;
  let fixture: ComponentFixture<AdonaiUsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdonaiUsersComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdonaiUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
