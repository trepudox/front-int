import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ClienteImpactadoDetails } from 'src/app/entities/ClienteImpactadoDetails';
import { ClienteImpactadoService } from 'src/app/services/cliente-impactado.service';

@Component({
  selector: 'app-cliente-impactado-card-detail',
  templateUrl: './cliente-impactado-card-detail.component.html',
  styleUrls: ['./cliente-impactado-card-detail.component.css']
})
export class ClienteImpactadoCardDetailComponent implements OnChanges {

  @Input() selectedApp: string;
  @Input() selectedDate: string;
  cid: ClienteImpactadoDetails;

  constructor(private clienteImpactadoService: ClienteImpactadoService) { }
  
  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes)
    this.getClienteImpactadoDetailsByAppAndDate(this.selectedApp, this.selectedDate);
  }

  getClienteImpactadoDetailsByAppAndDate(app: string, date: string): void {
    this.clienteImpactadoService.getClienteImpactadoDetailByAppAndData(app, date)
      .subscribe({next: cid => this.cid = cid, error: e => console.error(e), 
        complete: () => console.log("getClienteImpactadoDetailsByAppAndDate complete!")});
  }

}
