import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NbaHub } from './nba-hub';

describe('NbaHub', () => {
  let component: NbaHub;
  let fixture: ComponentFixture<NbaHub>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NbaHub],
    }).compileComponents();

    fixture = TestBed.createComponent(NbaHub);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
