/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { Edit.bannerComponent } from './edit.banner.component';

describe('Edit.bannerComponent', () => {
  let component: Edit.bannerComponent;
  let fixture: ComponentFixture<Edit.bannerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Edit.bannerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Edit.bannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
