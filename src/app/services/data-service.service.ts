import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { GlobalDataSummary } from '../models/global-data';

@Injectable({
  providedIn: 'root',
})
export class DataServiceService {
  // tslint:disable-next-line: max-line-length
  private globalDataurl = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/06-22-2020.csv';
  constructor(private http: HttpClient) {}

  // getCountries():Observable<any>{
  //   const url = "https://api.covid19api.com/countries";
  //   console.log(url);
  //   return this.http.get<any>(url);

  getGlobalData() {
    return this.http.get(this.globalDataurl , { responseType: 'text'}).pipe(
      map(result => {
        let data: GlobalDataSummary[] = [];
        let raw = {}
        let rows = result.split('\n');
        rows.splice(0,1);
        //console.log(rows);
        rows.forEach(row=>{
          let cols = row.split(/,(?=\S)/);

          let cs = {
            country: cols[3],
            confirmed: +cols[7],
            deaths: +cols[8],
            recovered: +cols[9],
            active: +cols[10],
          };
          let temp : GlobalDataSummary = row[cs.country];
          if(temp){
            temp.active = cs.active + temp.active;
            temp.confirmed = cs.confirmed + temp.confirmed;
            temp.deaths = cs.deaths + temp.deaths;
            temp.recovered = cs.recovered + temp.recovered;

          raw[cs.country] = temp;
          }else{
            raw[cs.country] = cs;
          }


        })

           return <GlobalDataSummary[]>Object.values(raw);
      })
    )

  }
}
