import { AfterViewInit, Component, OnInit } from '@angular/core';

import { HttpClient } from "@angular/common/http";
import * as L from 'leaflet';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  title = 'pathdrawer_fe';
  public data: Array<any> = [];

  public startIcon = L.icon({ //add this new icon
    iconUrl: 'assets/img/start.png',

    iconSize: [35, 47],
    shadowSize: [5, 5],
    iconAnchor: [22, 50],
    shadowAnchor: [4, 62],
    popupAnchor: [-3, -76]
  });

  public endIcon = L.icon({ //add this new icon
    iconUrl: 'assets/img/end.png',

    iconSize: [35, 47],
    shadowSize: [5, 5],
    iconAnchor: [22, 50],
    shadowAnchor: [4, 62],
    popupAnchor: [-3, -76]
  });


  public locationIcon = L.icon({ //add this new icon
    iconUrl: 'assets/img/location.png',

    iconSize: [35, 47],
    shadowSize: [5, 5],
    iconAnchor: [22, 50],
    shadowAnchor: [4, 62],
    popupAnchor: [-3, -76]
  });

  public currentLocation: any;
  public locationInterval: any;
  constructor(private http: HttpClient) {
  }

  private map: any;

  private initMap(): void {
    this.map = L.map('map', {
      center: [35.62224166666667, 10.737660000000002],
      zoom: 11
    });

    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 3,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });

    tiles.addTo(this.map);

  }

  private getPolyLine(): void {
    this.http.get('http://localhost:8080/api/arch/polyline').subscribe((res: any) => {
      this.data = res;
      this.drawPolyline();
    });
  }

  ngAfterViewInit(): void {
    this.initMap();
    this.getPolyLine();
  }

  drawPolyline(): void {
    const multiPolyLineOptions = {
      color: 'red',
      weight: 4,
      opacity: 0.8
    };
    L.polyline(this.data, multiPolyLineOptions).addTo(this.map);
    this.drawMarker(this.data[0], this.startIcon);
    this.drawMarker(this.data[this.data.length - 1], this.endIcon);
    this.animateTrajectory();
  }

  drawMarker(langLalt: any, icon: any) {
    L.marker(langLalt).setIcon(icon).addTo(this.map);
  }

  animateTrajectory(){
    let index=0;
    this.locationInterval=setInterval(()=>{
      if(index>=this.data.length){
        this.locationInterval
      }
      if(this.currentLocation){
        this.map.removeLayer(this.currentLocation);
      }
      this.currentLocation=L.marker(this.data[index]).setIcon(this.locationIcon).addTo(this.map);
      index++;
    },50);
  }

  stopAnimation(){
    clearInterval(this.locationInterval);
  }
}
