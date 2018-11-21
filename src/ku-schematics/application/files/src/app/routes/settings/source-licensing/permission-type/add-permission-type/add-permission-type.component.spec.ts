import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPermissionTypeComponent } from './add-permission-type.component';

describe('AddPermissionTypeComponent', () => {
  let component: AddPermissionTypeComponent;
  let fixture: ComponentFixture<AddPermissionTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddPermissionTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPermissionTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
