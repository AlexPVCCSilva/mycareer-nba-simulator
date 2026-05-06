import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeasonHub } from './season-hub';

describe('SeasonHub', () => {
  let component: SeasonHub;
  let fixture: ComponentFixture<SeasonHub>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeasonHub],
    }).compileComponents();

    fixture = TestBed.createComponent(SeasonHub);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
