import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Windial } from './windial';

describe('Windial', () => {
  let component: Windial;
  let fixture: ComponentFixture<Windial>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Windial],
    }).compileComponents();

    fixture = TestBed.createComponent(Windial);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
