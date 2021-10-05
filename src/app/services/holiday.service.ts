import { Injectable } from '@angular/core';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class HolidayService {
  private cache: Cache = {

  }

  constructor() { }

  async getHolidays(year: number, month?: number, includeOptionals: boolean = false){
    let holidays: Holiday[];
    const cached = this.cache[year];

    if (cached){
      holidays = cached;
    } else {
      const response = await fetch(`https://api.calendario.com.br/?json=true&ano=${year}&token=YWx2b3JvZHJpZ3VpbmhvMTFAZ21haWwuY29tJmhhc2g9MjQxMzQ0NzI1`);
      holidays = await response.json();
    }
    
    this.cache[year] = holidays;

    const filteredHolidays = includeOptionals ? holidays : holidays.filter(h => h.type_code !== '4');

    return {
      requestedMonth: month,
      requestedYear: year,
      holidays: typeof month !== 'undefined' ? this.filterByMonth(filteredHolidays, month) : filteredHolidays
    };

    
  }

  private filterByMonth(holidays: Holiday[], month: number, ){
    return holidays.filter(holiday => {
      const holidayMonth = parseInt(holiday.date.split('/')[1]);
      return month === holidayMonth - 1; 
    })
  }
}

// Os dados que vem da API de feriados
interface Holiday {
  date:	string,
  name:	string,
  link: string,
  type: string,
  description: string,	
  type_code: string
}

interface Cache {
  [key: number]: Holiday[]
}