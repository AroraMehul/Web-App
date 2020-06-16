import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigurationdetailsComponent } from './configurationdetails.component';

describe('ConfigurationComponent', () => {
  let component: ConfigurationdetailsComponent;
  let fixture: ComponentFixture<ConfigurationdetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfigurationdetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigurationdetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
