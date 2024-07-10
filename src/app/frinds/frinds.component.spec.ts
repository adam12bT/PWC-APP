import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FrindsComponent } from './frinds.component';

describe('FrindsComponent', () => {
  let component: FrindsComponent;
  let fixture: ComponentFixture<FrindsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FrindsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FrindsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
