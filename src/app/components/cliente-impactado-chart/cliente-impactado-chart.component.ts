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
  hours: string[] = ["19:00", "19:05", "19:10", "19:15", "19:20", "19:25", "19:30", "19:35", "19:40", "19:45", "19:50", "19:55"];
  clientes: string[] = ["100", "90", "80", "110", "100", "90", "80", "110", "100", "90", "80", "110"];
  impactados: string[] = ["50", "30", "20", "60", "50", "30", "20", "60", "50", "30", "20", "60"];
  baixaPrioridade: string[] = ["10", "25", "10", "42", "10", "25", "10", "42", "10", "25", "10", "42"];
  altaPrioridade: string[] = ["40", "5", "10", "18", "40", "5", "10", "18", "40", "5", "10", "18"];

  datasets = [
    {
      label: "Clientes",
      data: this.clientes,
      backgroundColor: "rgb(0, 61, 131)",
      pointRadius: 4,
      borderColor: "rgba(0, 61, 131, 0.25)",
      hoverBorderColor: "black",
      hoverBorderWidth: 1,
      pointHoverRadius: 6,
    },
    {
      label: "Impactados",
      data: this.impactados,
      backgroundColor: "rgb(241, 194, 50)",
      pointRadius: 4,
      borderColor: "rgb(241, 194, 50, 0.25)",
      hoverBorderColor: "black",
      hoverBorderWidth: 1,
      pointHoverRadius: 6,
    },
    {
      label: "Baixa Prioridade",
      data: this.baixaPrioridade,
      backgroundColor: "rgb(255, 110, 0)",
      pointRadius: 4,
      borderColor: "rgba(255, 110, 0, 0.25)",
      hoverBorderColor: "black",
      hoverBorderWidth: 1,
      pointHoverRadius: 6,
      
    },
    {
      label: "Alta Prioridade",
      data: this.altaPrioridade,
      backgroundColor: "rgb(210, 0, 0)",
      pointRadius: 4,
      borderColor: "rgba(210, 0, 0, 0.25)",
      hoverBorderColor: "black",
      hoverBorderWidth: 1,
      pointHoverRadius: 6,
    }
  ]

  private readonly hoverBackgroundColor = {
    id: "hoverBackgroundColor",
    // beforeDatasetsDraw(chart: any): void {
    //   const arr: any[] = [];
    //   const {boxes, tooltip} = chart;
      
    //   if(tooltip._active[0]) {
    //     let tooltipTitle = tooltip.title[0];
    //     let itemIndex = boxes[3].ticks.findIndex((obj: any) => obj.label === tooltipTitle);
        
    //     let sortedMetasets: any[] = chart._sortedMetasets;

    //     for(let datasetIndex = 0; datasetIndex < sortedMetasets.length; datasetIndex++) {
    //       let element = sortedMetasets[datasetIndex].data[itemIndex];
    //       element.active = true;
    //       let toBeActive = {element: element, index: itemIndex, datasetIndex: datasetIndex}

    //       chart._active.push(toBeActive);
    //     }

    //     // console.log("all active: ")
    //     // console.log(chart._active)
    //     document.body.style.cursor = "pointer";

    //     chart.updateHoverStyle(chart._active, null, true)
    //     chart.render();
    //   } else {
    //     document.body.style.cursor = "unset";
    //     chart.updateHoverStyle(arr, null, false);
    //     chart.render();
    //   }
    // },


    // beforeEvent(chart: any, args: any): void {
    //   const { tooltip, boxes } = chart;
    //   const { event, inChartArea } = args;
    //   console.log(chart)
    //   if(event.native instanceof MouseEvent) {
    //     if(inChartArea) {
    //       if(tooltip._active[0]) {
    //         let tooltipTitle = tooltip.title[0];
    //         let columnIndex = boxes[3].ticks.findIndex((obj: any) => obj.label === tooltipTitle);
            
    //         let sortedMetasets: any[] = chart._sortedMetasets;

    //         let arr: any[] = [];
    //         for(let datasetIndex = 0; datasetIndex < sortedMetasets.length; datasetIndex++) {
    //           let element = sortedMetasets[datasetIndex].data[columnIndex];
    //           arr.push({element: element, index: columnIndex, datasetIndex: datasetIndex});
    //         }

    //         document.body.style.cursor = "pointer";
            
    //         chart.updateHoverStyle(arr, null, true)
    //         chart.render();
    //       }
    //     } else {
    //       chart.updateHoverStyle(this.findActivePoints(chart._sortedMetasets), null, false)
    //       chart.render();
    //     }
    //   }

    //   console.log(args);
    // },
    // findActivePoints(sortedMetasets: any[]): any[] {
    //   let arr: any[] = [];
    //   for(let datasetIndex = 0; datasetIndex < sortedMetasets.length; datasetIndex++) {
    //     let dataset = sortedMetasets[datasetIndex];
    //     for(let column = 0; column < dataset.length; column++) {
    //       let element = dataset.data[column];
    //       if(element.active) {
    //         arr.push({element: element, index: column, datasetIndex: datasetIndex});
    //       }
    //     }
    //   }
    //   return arr;
    // }

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
            titleFont: {
              size: 15
            },
            mode: "index",
            intersect: false
          },
          legend: {
            display: true
          },
        },
        hover: {
          mode: "index",
          intersect: false,
        },
        onHover: (event, chartElement) => {
          const target: any = event.native?.target;
          target.style.cursor = chartElement[0] ? 'pointer' : 'default';
        }
      },
      plugins: [this.hoverBackgroundColor, this.tooltipClick]
    });
    console.log(this.chart);
  }


}
