import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EdgebandComponent } from './edgeband.component';

describe('EdgebandComponent', () => {
  let component: EdgebandComponent;
  let fixture: ComponentFixture<EdgebandComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EdgebandComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EdgebandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
