import { useEffect } from 'react'; 
import dayjs from "dayjs";

export interface IEventType {
    [key: string]: string;
}
export const ET: IEventType = {
    EVENT: "event",
    SLOT: "slot",
    DEFINCE: "defince",
    CORRECTION: "correction",
}

const useParsingEvents = (
    eventsIntra: any,
    slotsIntra: any,
    defances: any,
    defancesHistory: any,
    me: any,
    setEvents: any,         // TODO: safe setSwitchEvents in the store
    setEventsActive: any,   // TODO: safe setEvents in the store
    locations: any,
) => {
    useEffect(() => {
        if (eventsIntra && slotsIntra && defances && defancesHistory) {
            const eventList = eventsIntra.map((event: any) => ({
                id: event.id,
                name: event.name ?? event.id,
                start: dayjs(event["begin_at"]).toDate(),
                end: dayjs(event["end_at"]).toDate(),
                color: "danger",
                user: null,
                description: event.description,
                kind: event.kind,
                location: event.location,
                max_people: event.max_people,
                nbr_subscribers: event.nbr_subscribers,
                prohibition_of_cancellation: event.prohibition_of_cancellation,
                themes: event.themes,
                scale_team: "event",
                isDraggable: false,
            }));
            const slotsList = slotsIntra.map((slot: any) => {
                return ({
                    id: slot.id,
                    name:
                        slot.scale_team == "invisible"
                            ? `⬆️ Invisible`
                            : slot.scale_team?.correcteds
                                ? `⬆️ ${slot.scale_team?.correcteds[0].login}`
                                : "Available",
                    start: dayjs(slot["begin_at"]).toDate(),
                    end: dayjs(slot["end_at"]).toDate(),
                    color:
                        slot.scale_team == "invisible" || slot.scale_team?.id
                            ? "danger"
                            : "success",
                    user: null,
                    description: null,
                    kind: slot.scale_team == "invisible"
                        ? ET.CORRECTION
                        : slot.scale_team?.correcteds
                            ? ET.CORRECTION
                            : ET.SLOT,
                    location: "event.location",
                    max_people: "event.max_people",
                    nbr_subscribers: "event.nbr_subscribers",
                    prohibition_of_cancellation: "event.prohibition_of_cancellation",
                    themes: "event.themes",
                    scale_team: slot.scale_team,
                    slots_data: slot?.slots_data,
                    isDraggable: dayjs(new Date()).isBefore(slot["end_at"]) && (slot.scale_team != "invisible")
                })
            });

            const defancesList = [...defancesHistory, ...defances]
                .filter((i) => i.team?.project_gitlab_path?.split('/').pop()) // i.comment
                .map((slot: any) => ({
                    id: slot.id,
                    name: `⬇️ ${slot.team?.project_gitlab_path?.split('/').pop()}`,
                    start: dayjs(slot["begin_at"]).toDate(),
                    end: dayjs(slot["begin_at"]).add(slot.scale.duration, 's').toDate(),
                    color:
                        slot.scale_team == "invisible" || slot.scale_team?.id
                            ? "danger"
                            : "dark",
                    user: null,
                    description: null,
                    kind: "kind",
                    location: "event.location",
                    max_people: "event.max_people",
                    nbr_subscribers: "event.nbr_subscribers",
                    prohibition_of_cancellation: "event.prohibition_of_cancellation",
                    themes: "event.themes",
                    scale_team: slot,
                    slots_data: null,
                    type: "defances",
                    isDraggable: false
                }));
            const locationsList = locations.map((event: any) => ({
                id: event.id,
                name: `Host: ${event.host} (${dayjs(event["end_at"]).diff(dayjs(event["begin_at"]), 'minutes', false)} min.)`,
                start: dayjs(event["begin_at"]).toDate(),
                end: dayjs(event["end_at"]).toDate(),
                color: "success",
                scale_team: "locations",
            })) || [];
            setEvents([...eventList, ...slotsList, ...defancesList, ...locationsList]);
            setEventsActive([...eventList, ...slotsList, ...defancesList]);
        }
    }, [eventsIntra, slotsIntra, defances, defancesHistory]);
};

export default useParsingEvents;
