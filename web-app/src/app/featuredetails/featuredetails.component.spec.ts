import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeaturedetailsComponent } from './featuredetails.component';

describe('FeaturedetailsComponent', () => {
  let component: FeaturedetailsComponent;
  let fixture: ComponentFixture<FeaturedetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeaturedetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeaturedetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
