// Os dados que estão aqui podem ter sua estrutura mudada.
// Eu adicionei aqui as 00:40h da madruga

interface CalendarCellComponent {
    date: Date; // Data que a célula guarda.
    free: boolean; // Indica se o dia está livre ou nao.
    schedules: { [key: string]: Schedule[] }; // Lista com horários do dia.
    state: CellState // Representa um dos estados do dia, usado principalmente pra mudar sua aparência
}

interface Schedule {
    time: string; // Representa o horário da atividade. No momento é uma string, mas talvez possa ser um Date
    activity: Activity | null; // Atividade daquele horário ou nulo, caso ele esteja livre
}

interface Activity {
    name: string;
    hour: string;
    roomName: string;
    patient: string; 
}

export enum CellState {
    FREE = 0,
    FULL = 1,
    BLOCKED_FOR_PROFESSIONAL = 2,
    BLOCKED_FOR_ALL = 3,
}