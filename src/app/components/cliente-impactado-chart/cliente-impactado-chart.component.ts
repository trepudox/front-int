import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import Chart from 'chart.js/auto'
import { ClienteImpactado } from 'src/app/entities/ClienteImpactado';
import { ClienteImpactadoService } from 'src/app/services/cliente-impactado.service';

@Component({
  selector: 'app-cliente-impactado-chart',
  templateUrl: './cliente-impactado-chart.component.html',
  styleUrls: ['./cliente-impactado-chart.component.css']
})
export class ClienteImpactadoChartComponent implements OnInit, OnChanges {

  @Input() selectedApp: string;
  @Output() eventEmitter = new EventEmitter();
  chart?: Chart<"bar", string[], string>;

  clientesImpactados: ClienteImpactado[];
  hours: string[];
  clientes: string[];
  impactados: string[];
  baixaPrioridade: string[];
  altaPrioridade: string[];

  private readonly hoverBackgroundColor = {
    id: "hoverBackgroundColor",
    beforeDatasetsDraw(chart: any): void {
      const {ctx, tooltip, chartArea: {top, height}, scales: {x}} = chart;
      
      if(tooltip._active[0]) {
        let index = tooltip._active[0].index + 1;
        let newWidth;
        if(index === 0) {
          newWidth = 0;
        } else {
          newWidth = x._gridLineItems[1].x1 - x._gridLineItems[2].x1;
        }
  
        document.body.style.cursor = "pointer";
        ctx.fillStyle = 'rgba(128, 128, 128, .25)';
        ctx.fillRect(x._gridLineItems[index].x1, top, newWidth, height);
      } else {
        document.body.style.cursor = "unset";
      }

    }
  }

  private readonly tooltipClick = {
    id: "tooltipClick",
    tooltipClickEventEmitter: new EventEmitter(),
    beforeEvent(chart: any, event: any, options: any): void {
      if(event.event.type === "click") {
        let hora: string = String(chart.tooltip.title);
        let horaMinuto: string[] = hora.split(":");

        let data: Date = new Date();
        data.setHours(Number(horaMinuto[0]));
        data.setMinutes(Number(horaMinuto[1]));

        let datePipe: DatePipe = new DatePipe("en-US");
        let dataFormatada: string | null = datePipe.transform(data, "yyyyMMddHHmm");
        this.tooltipClickEventEmitter.emit(dataFormatada);
      }
    }
  }

  constructor(private clienteImpactadoService: ClienteImpactadoService) {}

  ngOnInit(): void {
    this.tooltipClick.tooltipClickEventEmitter.subscribe({next: (v: string) => this.eventEmitter.emit(v)});
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(this.selectedApp) {
      console.log(this.selectedApp);
      this.getAllClienteImpactadosByAppFromLastHour(this.selectedApp);
    }
  }

  getAllClienteImpactadosByAppFromLastHour(app: string): void {
    this.clienteImpactadoService.getAllClienteImpactadosByAppFromLastHour(app)
          .subscribe({next: list => this.clientesImpactados = list,
                      error: e => console.error(e),
                      complete: () => { console.log("getClienteImpactadosFromLastHour complete!"); 
                                        this.filterClientesImpactados();
                                        this.createChart(); } });
  }

  filterClientesImpactados(): void {
    this.hours = this.clientesImpactados.map(ci => {var date = new Date(ci.data); return `${date.getHours().toLocaleString(undefined, {minimumIntegerDigits: 2})}:${date.getMinutes().toLocaleString(undefined, {minimumIntegerDigits: 2})}`});
    this.clientes = this.clientesImpactados.map(ci => `${ci.clientes}`);
    this.impactados = this.clientesImpactados.map(ci => `${ci.impactados}`);
    this.baixaPrioridade = this.clientesImpactados.map(ci => `${ci.baixaPrioridade}`);
    this.altaPrioridade = this.clientesImpactados.map(ci => `${ci.altaPrioridade}`);
  }

  createChart(): void {
    if(this.chart != undefined) {
      this.chart.destroy();
    }

    this.chart = new Chart("clienteImpactadoChart", {
      type: "bar",
      data: {
        labels: this.hours,
        datasets: [
          {
            label: "Clientes",
            data: this.clientes,
            backgroundColor: "green",
            hoverBorderColor: "black",
            hoverBorderWidth: .66
          },
          {
            label: "Impactados",
            data: this.impactados,
            backgroundColor: "yellow",
            hoverBorderColor: "black",
            hoverBorderWidth: .66
          },
          {
            label: "Baixa Prioridade",
            data: this.baixaPrioridade,
            backgroundColor: "orange",
            hoverBorderColor: "black",
            hoverBorderWidth: .66
          },
          {
            label: "Alta Prioridade",
            data: this.altaPrioridade,
            backgroundColor: "red",
            hoverBorderColor: "black",
            hoverBorderWidth: .66
          }
        ]
      },
      options: {
        aspectRatio: 5,
        plugins: {
          legend: {
            display: true
          },
          tooltip: {
            mode: "index",
            intersect: false
          }
        }
      },
      plugins: [this.hoverBackgroundColor, this.tooltipClick]
    });

  }


}
