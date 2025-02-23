import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VinylCardComponent } from './vinyl-card.component';

describe('VinylCardComponent', () => {
  let component: VinylCardComponent;
  let fixture: ComponentFixture<VinylCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VinylCardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VinylCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
