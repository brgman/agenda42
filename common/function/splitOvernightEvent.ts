type Event = {
    id: number;
    begin_at: string;
    end_at: string;
    [key: string]: any;
};

export function splitOvernightEvent(event: Event): Event[] {
    const begin = new Date(event.begin_at);
    const end = new Date(event.end_at);

    const nextMidnight = new Date(begin);
    nextMidnight.setHours(0, 0, 0, 0);
    nextMidnight.setDate(nextMidnight.getDate() + 1);

    if (end <= nextMidnight) {
        return [event];
    }

    const endOfBeginDay = new Date(begin);
    endOfBeginDay.setHours(23, 59, 59, 999);

    const startOfEndDay = new Date(end);
    startOfEndDay.setHours(0, 0, 0, 0);

    return [
        {
            ...event,
            id: Number(`${event.id}1`),
            begin_at: begin.toISOString(),
            end_at: endOfBeginDay.toISOString(),
        },
        {
            ...event,
            id: Number(`${event.id}2`),
            begin_at: startOfEndDay.toISOString(),
            end_at: end.toISOString(),
        },
    ];
}
