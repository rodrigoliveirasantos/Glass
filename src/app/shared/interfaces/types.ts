import { ProfessionalDataService } from "src/app/services/professional-data.service";

export interface WebsocketResponse {
    code: number,
    success: boolean,
    error?: string,
    data?: any
}

export interface GetAllMessageBody {
    employeeId: number,
    month: number,
    year: number
}

export type WebsocketMessageHandler = (data: WebsocketResponse, service: ProfessionalDataService) => any;
