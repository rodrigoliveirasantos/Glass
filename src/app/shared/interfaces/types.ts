import { ProfessionalDataService } from "src/app/services/professional-data.service";

export type Token = string;
export type componentId = string | number | undefined;

// Modelo de responsta das mensagens WebSocket
export interface WebsocketResponse {
    method: string,
    code: number,
    success: boolean,
    error?: string,
    data?: any,
    componentId?: string, // Aqui vem sempre em string
}
// Modelo de responsta das requisições HTTP 
export interface GlassHttpResponse {
    code: number,
    success: boolean,
    error?: string,
    data?: any
}

// Modelo de corpo da requisição da mensagem GET_ALL 
export interface GetAllRequestBody {
    employeeId: number,
    month: number,
    year: number
}

// Modelo de corpo da requisição da mensagem GET_PATIENTS 
export interface GetAllPatientsRequestBody {
    componentId?: componentId
}

// Modelo de corpo da requisição da mensagem ADD_APPOINTMENT 
export interface AddAppointmentRequestBody {
    token: Token,
    roomId: number
    professionalId: number;
    patientId: number;
    appointment: {
        appointmentType: string,
        appointmentDate: string
    }
    componentId?: componentId;
}

// Modelo de corpo da requisição da mensagem DELETE_APPOINTMENT
export interface DeleteAppointmentRequestBody {
    token: Token,
    appointmentId: number,
    componentId?: componentId,
}

// Modelo de corpo da requisição da mensagem ADD_EVENTUAL_SCHEDULE 
// Existe uma versão simplificada disso usado no método "ProfessionalDataService.blockDay()"
export interface AddEventualScheduleRequestBody {
    eventualSchedule: EventualSchedule,
    employeeId: number,
    componentId?: componentId,
}

// Modelo de corpo da requisição da mensagem DELETE_EVENTUAL_SCHEDULE  
export interface DeleteEventualScheduleRequestBody {
    eventualScheduleId: number,
    employeeId: number,
    componentId?: componentId,
}

export interface GetSchedulesRequestBody {
    employeeId: number;
    componentId?: componentId;
}

export interface AddRoomRequestBody {
    room: {
        name: string;
    }
    
    componentId?: componentId;
}

export interface UpdateRoomRequestBody {
    room: Room,
    componentId?: componentId;
}

export interface DeleteRoomRequestBody {
    roomId: number;
    componentId?: componentId;
}



export interface GetAllMessageData {
    appointments: Appointment[],
    eventualSchedules: any[],
    schedules: Schedule[]
}


/** Atributos que estão presentes numa Schedule normal e eventual. */
interface BasicScheduleAttributes {
    id: number,
    startTime: string,
    endTime: string,
    frequency: number,
}

export interface Schedule extends BasicScheduleAttributes{
    dayOfWeek: number
}

export interface EventualSchedule extends BasicScheduleAttributes {
    eventualDate: string,
    eventualState: EventualStates
}


export type CellDataAppointments = Map<string, Appointment | null> | null;

export enum EventualStates {
    // Esses três correspondem a estados guardados no servidor
    BLOCKED_BY_ADMIN = 0,
    BLOCKED_BY_PROFESSIONAL = 1,
    OPEN = 2,
}

export enum CellStates {
    BLOCKED_BY_ADMIN = EventualStates.BLOCKED_BY_ADMIN,
    BLOCKED_BY_PROFESSIONAL = EventualStates.BLOCKED_BY_PROFESSIONAL,
    OPEN = EventualStates.OPEN,
    // Os valores a seguir só devem ser usados no front-end
    BLOCKED_BY_HOLIDAY = 3, 
    IDLE = 4, // Representa dias que o profissional não trabalha
}

export enum Frequency {
    TEN_MINUTES = 1,
    FIFTEEN_MINUTES = 2,
    THIRTY_MINUTES = 3,
    ONE_HOUR = 4,
    TWO_HOURS = 5,
    THREE_HOURS = 6,
    FIVE_HOURS = 7
}


export interface CellData {
    date: Date,
    appointments: CellDataAppointments,
    blockState: CellStates | EventualStates,
    schedule: Schedule | null,
}

export interface Appointment {
    appointmentDate: string,
    appointmentType: number,
    id: number,
    patient: Patient,
    professional: Professional,
    room: Room
}

export interface Patient {
    id: number,
    name: string,
    birthday: string | null
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

export interface ConfirmationModalData {
    message: string,
    onConfirm: (close: Function) => any,
  }
  

  