import { ProfessionalDataService } from "src/app/services/professional-data.service";

export interface WebsocketResponse {
    code: number,
    success: boolean,
    error?: string,
    data?: any
}

export interface GlassHttpResponse {
    code: number,
    success: boolean,
    error?: string,
    data?: any
}

export interface GetAllRequestBody {
    employeeId: number,
    month: number,
    year: number
}

export interface AddAppointmentRequestBody {
    token?: string
    roomId: number
    professionalId: number;
    patientId: number;
    appointment: {
        appointmentType: number,
        appointmentDate: string
    }
    componentId?: string;
}

export interface GetAllMessageData {
    appointments: Appointment[],
    eventualSchedules: any[],
    schedules: Schedule[]
}

export interface Schedule {
    id: number,
    dayOfWeek: number,
    startTime: string,
    endTime: string,
    frequency: number,
}


export type CellDataAppointments = Map<string, Appointment | null> | null;

export interface CellData {
    date: Date,
    appointments: CellDataAppointments
}


export interface Appointment {
    appointmentDate: string,
    appointmentType: number,
    id: number,
    patient: Costumer,
    professional: Professional,
    room: Room
}

export interface Costumer {
    id: number,
    name: string,
    birthday: string | null,
    cpf: string | null,
    rg: string | null,
    phone: string | null
}

export interface Professional {
    id: number,
    admin: boolean,
    cpf: string,
    name: string,
    birthday: Date | null,
    password: string | null,
    phone: string | null,
    rg: string | null
}

export interface Room {
    id: number,
    name: string,
}

export type WebsocketMessageHandler = (data: WebsocketResponse, service: ProfessionalDataService) => any;



export interface ActivityListInput {
    appointments: [string, Appointment | null][] | undefined // Se isso nao for um array nao funciona
    date: Date
}
