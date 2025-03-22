import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartsviewComponent } from './partsview.component';

describe('PartsviewComponent', () => {
  let component: PartsviewComponent;
  let fixture: ComponentFixture<PartsviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PartsviewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PartsviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
