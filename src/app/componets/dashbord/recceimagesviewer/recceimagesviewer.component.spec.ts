import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecceimagesviewerComponent } from './recceimagesviewer.component';

describe('RecceimagesviewerComponent', () => {
  let component: RecceimagesviewerComponent;
  let fixture: ComponentFixture<RecceimagesviewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecceimagesviewerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RecceimagesviewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
