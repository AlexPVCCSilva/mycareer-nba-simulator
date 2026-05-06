import { TestBed } from '@angular/core/testing';

import { CareerState } from './career-state';

describe('CareerState', () => {
  let service: CareerState;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CareerState);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
