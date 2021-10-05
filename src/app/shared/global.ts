import { Frequency } from "./interfaces/types";

const frequencyInTime = {} as { [key: number]: number }
frequencyInTime[Frequency.TEN_MINUTES] = 600;
frequencyInTime[Frequency.FIFTEEN_MINUTES] = 900;
frequencyInTime[Frequency.THIRTY_MINUTES] = 1800;
frequencyInTime[Frequency.ONE_HOUR] = 3600;
frequencyInTime[Frequency.TWO_HOURS] = 7200;
frequencyInTime[Frequency.THREE_HOURS] = 10800;

export default {
    getFrequencyInTime(frequency: Frequency){
        return frequencyInTime[frequency];
    }
}