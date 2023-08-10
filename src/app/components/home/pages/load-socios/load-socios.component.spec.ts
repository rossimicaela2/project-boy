import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadSociosComponent } from './load-socios.component';

describe('LoadSociosComponent', () => {
  let component: LoadSociosComponent;
  let fixture: ComponentFixture<LoadSociosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LoadSociosComponent]
    });
    fixture = TestBed.createComponent(LoadSociosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
