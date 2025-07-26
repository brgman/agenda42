interface Event {
    start: Date;
    end: Date;
    scale_team: string;
}

function isOverlappingAndFutureOrToday(event1: Event, event2: Event): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const isFutureOrToday = event1.start >= today || event2.start >= today;

    return (
        event1.start < event2.end &&
        event2.start < event1.end &&
        isFutureOrToday &&
        (event1.scale_team !== 'location' || event2.scale_team !== 'location')
    );
}

function doEventsOverlap(event1: any, event2: any): boolean {
    return isOverlappingAndFutureOrToday(event1, event2);
}

export function findOverlappingEvents(events: any): any[][] {
    const overlaps: any[][] = [];

    for (let i = 0; i < events.length; i++) {
        for (let j = i + 1; j < events.length; j++) {
            if (doEventsOverlap(events[i], events[j])) {
                overlaps.push([events[i], events[j]]);
            }
        }
    }

    return overlaps;
}