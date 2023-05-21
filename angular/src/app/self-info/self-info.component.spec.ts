import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelfInfoComponent } from './self-info.component';

describe('SelfInfoComponent', () => {
  let component: SelfInfoComponent;
  let fixture: ComponentFixture<SelfInfoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SelfInfoComponent]
    });
    fixture = TestBed.createComponent(SelfInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
