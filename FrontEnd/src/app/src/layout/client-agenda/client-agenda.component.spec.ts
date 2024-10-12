import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientAgendaComponent } from './client-agenda.component';

describe('ClientAgendaComponent', () => {
  let component: ClientAgendaComponent;
  let fixture: ComponentFixture<ClientAgendaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientAgendaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientAgendaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
