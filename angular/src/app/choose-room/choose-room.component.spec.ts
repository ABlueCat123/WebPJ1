import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChooseRoomComponent } from './choose-room.component';

describe('ChooseRoomComponent', () => {
  let component: ChooseRoomComponent;
  let fixture: ComponentFixture<ChooseRoomComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChooseRoomComponent]
    });
    fixture = TestBed.createComponent(ChooseRoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
