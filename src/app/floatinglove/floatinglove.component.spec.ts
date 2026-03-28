import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FloatingloveComponent } from './floatinglove.component';

describe('FloatingloveComponent', () => {
  let component: FloatingloveComponent;
  let fixture: ComponentFixture<FloatingloveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FloatingloveComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FloatingloveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
