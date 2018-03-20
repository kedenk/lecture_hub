import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionviewComponent } from './questionview.component';

describe('QuestionviewComponent', () => {
  let component: QuestionviewComponent;
  let fixture: ComponentFixture<QuestionviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuestionviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
