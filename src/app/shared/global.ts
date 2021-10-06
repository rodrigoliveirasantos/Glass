import { Frequency } from "./interfaces/types";

/* Todo - Tornar isso mais limpo */
const frequencyInTime = {} as { [key: number]: number }
frequencyInTime[Frequency.TEN_MINUTES] = 600;
frequencyInTime[Frequency.FIFTEEN_MINUTES] = 900;
frequencyInTime[Frequency.THIRTY_MINUTES] = 1800;
frequencyInTime[Frequency.ONE_HOUR] = 3600;
frequencyInTime[Frequency.TWO_HOURS] = 7200;
frequencyInTime[Frequency.THREE_HOURS] = 10800;
frequencyInTime[Frequency.FIVE_HOURS] = 18000;

const frequencyName = {} as { [key: number]: string }
frequencyName[Frequency.TEN_MINUTES] = '10 minutos';
frequencyName[Frequency.FIFTEEN_MINUTES] = '15 minutos';
frequencyName[Frequency.THIRTY_MINUTES] = '30 minutos';
frequencyName[Frequency.ONE_HOUR] = '1 hora';
frequencyName[Frequency.TWO_HOURS] = '2 horas';
frequencyName[Frequency.THREE_HOURS] = '3 horas';
frequencyName[Frequency.FIVE_HOURS] = '5 horas';

export default {
    getFrequencyInTime(frequency: Frequency){
        return frequencyInTime[frequency];
    },

    getFrequencyName(frequency: Frequency){
        return frequencyName[frequency]
    },

      /** Converte uma data com fuso horário brasileiro para o formato JSON */
    brazilianDateToJson(date: Date){
        const [dateString, timeString] = date.toLocaleString('pt-BR').split(' ');
        const [day, month, year] = dateString.split('/');

        return `${year}-${month}-${day}T${timeString}`;
    },
}
