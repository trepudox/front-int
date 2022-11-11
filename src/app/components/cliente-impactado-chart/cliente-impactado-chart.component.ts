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
  chart?: Chart<"line", string[], string>;

  clientesImpactados: ClienteImpactado[];
  hours: string[] = ["19:00", "19:05", "19:10", "19:15"];
  clientes: string[] = ["100", "90", "80", "110"];
  impactados: string[] = ["50", "30", "20", "60"];
  baixaPrioridade: string[] = ["10", "25", "10", "42"];
  altaPrioridade: string[] = ["40", "5", "10", "18"];

  datasets = [
    {
      label: "Clientes",
      data: this.clientes,
      backgroundColor: "green",
      hoverBorderColor: "black",
      hoverBorderWidth: .66,
      pointHoverRadius: 6
    },
    {
      label: "Impactados",
      data: this.impactados,
      backgroundColor: "yellow",
      hoverBorderColor: "black",
      hoverBorderWidth: .66,
      pointHoverRadius: 6
    },
    {
      label: "Baixa Prioridade",
      data: this.baixaPrioridade,
      backgroundColor: "orange",
      hoverBorderColor: "black",
      hoverBorderWidth: .66,
      pointHoverRadius: 6
    },
    {
      label: "Alta Prioridade",
      data: this.altaPrioridade,
      backgroundColor: "red",
      hoverBorderColor: "black",
      hoverBorderWidth: .66,
      pointHoverRadius: 6
    }
  ]

  private readonly hoverBackgroundColor = {
    id: "hoverBackgroundColor",
    beforeDatasetsDraw(chart: any): void {
      const arr: any[] = [];
      const {boxes, tooltip} = chart;
      
      if(tooltip._active[0]) {
        let tooltipTitle = tooltip.title[0];
        let itemIndex = boxes[3].ticks.findIndex((obj: any) => obj.label === tooltipTitle);
        
        let sortedMetasets: any[] = chart._sortedMetasets;

        for(let datasetIndex = 0; datasetIndex < sortedMetasets.length; datasetIndex++) {
          let element = sortedMetasets[datasetIndex].data[itemIndex];
          element.active = true;
          let toBeActive = {element: element, index: itemIndex, datasetIndex: datasetIndex}

          chart._active.push(toBeActive);
        }

        // console.log("all active: ")
        // console.log(chart._active)
        document.body.style.cursor = "pointer";

        chart.updateHoverStyle(chart._active, null, true)
        chart.render();
      } else {
        document.body.style.cursor = "unset";
        chart.updateHoverStyle(arr, null, false);
        chart.render();
      }
    },

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
    // this.tooltipClick.tooltipClickEventEmitter.subscribe({next: (v: string) => this.eventEmitter.emit(v)});
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.createChart();
    if(this.selectedApp) {
      console.log(this.selectedApp);
      // this.getAllClienteImpactadosByAppFromLastHour(this.selectedApp);
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
      type: "line",
      data: {
        labels: this.hours,
        datasets: this.datasets
      },
      options: {
        aspectRatio: 5,
        plugins: {
          tooltip: {
            mode: "index",
            intersect: false
          },
          legend: {
            display: true
          },
        }
      },
      plugins: [this.hoverBackgroundColor, this.tooltipClick]
    });
    console.log(this.chart);
  }


}
