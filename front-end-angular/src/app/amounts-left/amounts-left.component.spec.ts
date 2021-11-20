import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmountsLeftComponent } from './amounts-left.component';

describe('AmountsLeftComponent', () => {
  let component: AmountsLeftComponent;
  let fixture: ComponentFixture<AmountsLeftComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AmountsLeftComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AmountsLeftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
