import dayjs from "dayjs";
import {
    Calendar,
    dayjsLocalizer,
    Views,
} from "react-big-calendar";
import Card, {
    CardActions,
    CardBody,
    CardHeader,
    CardLabel,
    CardSubTitle,
    CardTitle,
} from "../../components/bootstrap/Card";
import { customFormats } from "../../common/function/customStyles";
import { useDispatch } from "react-redux";
import { MyEventDay } from "../../components/agenda/TemplatesEvent";
import { CalendarTodayButton } from "../extras/calendarHelper";
import { setEventActive } from "../../store/slices/calendarSlice";

const SideCalendar = ({
    events,
    views,
    date,
    handleSelect,
    eventStyleGetter,
    setDate,
    setUnitType,
}: any) => {
    const dispatch = useDispatch();
    const localizer = dayjsLocalizer(dayjs);
    // Change view mode
    const handleViewMode = (e: dayjs.ConfigType) => {
        setDate(dayjs(e).toDate());
        dispatch(setUnitType(Views.DAY));
    };

    return (
        <Card stretch style={{ minHeight: 600 }}>
            <CardHeader>
                <CardLabel icon="Today" iconColor="primary">
                    <CardTitle>
                        {dayjs(date).format("dddd, D MMMM")}
                    </CardTitle>
                    <CardSubTitle>{dayjs(date).fromNow()}</CardSubTitle>
                </CardLabel>
                <CardActions>
                    <CalendarTodayButton
                        unitType={Views.DAY}
                        date={date}
                        setDate={setDate}
                        viewMode={Views.DAY}
                        central={false}
                    />
                </CardActions>
            </CardHeader>
            <CardBody isScrollable>
                <Calendar
                    formats={customFormats}
                    selectable
                    toolbar={false}
                    localizer={localizer}
                    events={events}
                    defaultView={Views.WEEK}
                    views={views}
                    view={Views.DAY}
                    step={15}
                    scrollToTime={dayjs(date).add(-1, 'h').toISOString()}
                    defaultDate={new Date()}
                    onSelectEvent={(event) => { 
                        dispatch(setEventActive(event));
                    }}
                    onSelectSlot={handleSelect}
                    onView={handleViewMode}
                    onDrillDown={handleViewMode}
                    components={{
                        event: MyEventDay, // used by each view (Month, Day, Week)
                    }}
                    eventPropGetter={eventStyleGetter}
                />
            </CardBody>
        </Card>
    );
};

export default SideCalendar;