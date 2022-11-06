import { Component, OnInit } from '@angular/core';
import { ClienteImpactadoDetails } from 'src/app/entities/ClienteImpactadoDetails';
import { ClienteImpactadoService } from 'src/app/services/cliente-impactado.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  allClientesImpactadosDetails: ClienteImpactadoDetails[] = [];
  now: Date = new Date();
  
  appName: string;
  selectedDate: string;

  constructor(private clienteImpactadoService: ClienteImpactadoService) { }

  ngOnInit(): void {
    this.updateAllClientesImpactadosDetails();
  }

  updateAllClientesImpactadosDetails() {
    this.clienteImpactadoService.getClienteImpactadoDetailsFromTheLast5Minutes()
    .subscribe({next: list => this.allClientesImpactadosDetails = list,
                error: e => console.error(e),
                complete: () => console.log("getLast5Minutes complete!")});
  }

  refresh(): void {
    this.updateAllClientesImpactadosDetails();
    this.now = new Date();
  }

  selectApp(appName: string): void {
    this.appName = appName;
  }

  onNotify(date: string): void {
    this.selectedDate = date;
  }

}
