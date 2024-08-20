interface Item {
    id: string
}

export interface HallPlan {
    [key: string]: Item[];
}