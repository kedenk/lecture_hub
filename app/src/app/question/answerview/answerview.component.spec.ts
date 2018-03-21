import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnswerviewComponent } from './answerview.component';

describe('AnswerviewComponent', () => {
  let component: AnswerviewComponent;
  let fixture: ComponentFixture<AnswerviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnswerviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnswerviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
