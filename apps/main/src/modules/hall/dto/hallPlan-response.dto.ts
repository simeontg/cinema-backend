class Seat {
    id: string;
    seat_type: string;
    price: number;
    reserved: boolean;
}

export class HallPlanResponseDto {
    [key: string]: Seat[]
}