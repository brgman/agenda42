import dayjs from "dayjs";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store";

const useSwitchEvents = (events: any, allEvents: any, setEventsActive: any) => {
  const switchEvents = useSelector((state: RootState) => state.calendar.focusing);
  
  useEffect(() => {
    if (switchEvents == 'all' && allEvents) {
      const eventList = allEvents.map((event: any) => ({
        id: event.id,
        name: event.name ?? event.id,
        start: dayjs(event["begin_at"]).toDate(),
        end: dayjs(event["end_at"]).toDate(),
        color: events.some(e => event.id === e.id) ? "danger" : "primary",
        user: null,
        description: event.description,
        kind: event.kind,
        location: event.location,
        max_people: event.max_people,
        nbr_subscribers: event.nbr_subscribers,
        prohibition_of_cancellation: event.prohibition_of_cancellation,
        themes: event.themes,
        scale_team: "event",
      })) || [];
      setEventsActive([
        ...eventList,
        ...events,
      ].filter((item, index, self) =>
        index === self.findIndex(t => t.id === item.id)
      ));
    }
    else {
      setEventsActive([
        ...events
      ]);
    }
  }, [events, allEvents, switchEvents]);
};

export default useSwitchEvents;