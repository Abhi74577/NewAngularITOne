import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BcdrrequestComponent } from './bcdrrequest.component';

describe('BcdrrequestComponent', () => {
  let component: BcdrrequestComponent;
  let fixture: ComponentFixture<BcdrrequestComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BcdrrequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BcdrrequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
