import Card, {
    CardActions,
    CardBody,
    CardHeader,
} from "../../components/bootstrap/Card";
import {
    Calendar,
    dayjsLocalizer,
    Views,
} from "react-big-calendar";
import fr from "date-fns/locale/fr";
import { Calendar as DatePicker } from "react-date-range";
import {
    CalendarTodayButton,
    CalendarViewModeButtons,
    getLabel,
} from "../../components/extras/calendarHelper";
import Popovers from "../../components/bootstrap/Popovers";
import Button from "../../components/bootstrap/Button";
import Spinner from "../../components/bootstrap/Spinner";
import { customFormats, customStyles } from "../../common/function/customStyles";
import { MyEvent, MyWeekEvent } from "../../components/agenda/TemplatesEvent";
import dayjs from "dayjs";
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'
import ThemeContext from "../../context/themeContext";
import { useCallback, useContext, useEffect } from "react";
import { RootState } from "../../store";
import { useDispatch, useSelector } from "react-redux";
import { setEventActive, setSwitchEvents } from "../../store/slices/calendarSlice";
import FocusingSelector from "./FocusingSelecter";
import showNotification from "../extras/showNotification";
import Icon from "../icon/Icon";
import { useRefreshFriends } from "../../hooks/useRefreshFriends";

const MasterCalendar = ({
    unitType,
    date,
    setDate,
    viewMode,
    refresh,
    scaleUsers,
    refreshHandler,
    eventsActive,
    views,
    moveEvent,
    handleSelect,
    eventStyleGetter,
    token,
    setLoad,
}: any) => {
    const dispatch = useDispatch();
    const { mobileDesign, darkModeStatus } = useContext(ThemeContext);
    const switchEvents = useSelector((state: RootState) => state.calendar.focusing);
    const friends = useSelector((state: RootState) => state.friends.list);
    const wavingList = useSelector((state: RootState) => state.friends.wavingList);
    const me = useSelector((state: RootState) => state.user.me);
    const setMyEvents = useRefreshFriends(me?.id, token, setLoad);

    const todayAt8AM = dayjs().set('hour', 8).set('minute', 0).set('second', 0).set('millisecond', 0).toISOString();
    const todayAt0AM = dayjs().set('hour', 0).set('minute', 0).set('second', 0).set('millisecond', 0).toISOString();
    const todayAt20PM = dayjs().set('hour', 20).set('minute', 0).set('second', 0).set('millisecond', 0).toISOString();
    const todayFinOfDay = dayjs().set('hour', 23).set('minute', 59).set('second', 59).set('millisecond', 0).toISOString();

    const localizer = dayjsLocalizer(dayjs);
    const DnDCalendar = withDragAndDrop(Calendar);

    const calendarDateLabel = getLabel(date, viewMode);

    const slotPropGetter = useCallback((date: string) => {
        if (dayjs(date).isBefore(dayjs().add(30, 'm'), 'm')) {
            return {
                style: {
                    backgroundColor: darkModeStatus ? '#fff' : '#999',
                    opacity: 0.1,
                }
            };
        }
        return {};
    }, []);

    useEffect(() => {
        wavingList?.map(waving => {
            if (waving.status == "send") {
                return showNotification(
                    <span className='d-flex align-items-center'>
                        <Icon
                            icon='WavingHand'
                            size='lg'
                            className='me-1'
                        />
                        <span>Hey, it's {waving.author_name},</span>
                    </span>,
                    <p>
                        I'm waving at you because I saw you at the
                        <span style={{ margin: 3 }}>{waving.event_title}</span>
                        event!
                        <br />
                        <p>Open all hands if you read this message.</p>
                    </p>,
                    'default'
                );
            }
        })
    }, [wavingList])

    return (
        <Card stretch className="no-mobile-grid" >
            <CardHeader style={
                mobileDesign // TODO: test with other phones and make the classname
                    ? {
                        padding: 20,
                        position: 'fixed',
                        background: 'rgba(255, 255, 255, 0.5)',
                        backdropFilter: 'blur(0.2rem)',
                        willChange: 'backdrop-filter',
                        zIndex: 100
                    }
                    : {}
            }>
                <CardActions style={{ marginRight: 20 }}>
                    <CalendarTodayButton
                        unitType={unitType}
                        date={date}
                        setDate={setDate}
                        viewMode={viewMode}
                        central
                    />
                </CardActions>
                <Popovers
                    desc={
                        <DatePicker
                            locale={fr}
                            onChange={(item) => setDate(item)}
                            date={date}
                            color="#6c5dd3"
                        />
                    }
                    placement="bottom-end"
                    className="mw-100"
                    trigger="click"
                >
                    <Button color="light">{calendarDateLabel}</Button>
                </Popovers>

                <div style={{ margin: '0 20' }}>
                    {
                        (refresh || !scaleUsers)
                            ?
                            <div className="spinner"> <Spinner random inButton /></div>
                            :
                            <Button icon='Refresh' color='storybook' onClick={refreshHandler} />
                    }
                </div>
                <div className="switch_events">
                    <Button
                        style={{ minWidth: 50 }}
                        icon="CalendarToday"
                        isDisable={refresh || !scaleUsers}
                        color={switchEvents == "all" ? 'primary' : 'light'}
                        onClick={() => {
                            dispatch(setSwitchEvents("all"))
                            setMyEvents();
                        }}
                    />
                    {
                        (switchEvents == "my")
                            ? <FocusingSelector me={me} token={token} setLoad={setLoad} friends={friends} />
                            : <Button
                                style={{ minWidth: 50 }}
                                icon="FilterAlt"
                                isDisable={refresh || !scaleUsers}
                                color={switchEvents == "my" ? 'primary' : 'light'}
                                onClick={() => dispatch(setSwitchEvents("my"))}
                            />
                    }

                    {/* <Button
                                      disabled={refresh || !scaleUsers}
                                      color={switchEvents == "meeting" ? 'primary' : 'light'}
                                      onClick={() => setSwitchEvents("meeting")}
                                    >
                                      Meeting rooms
                                    </Button> */}
                </div>


                <CalendarViewModeButtons viewMode={viewMode} />

            </CardHeader>
            <CardBody isScrollable style={mobileDesign ? { marginTop: 112, } : {}}>
                <DnDCalendar
                    style={mobileDesign ? { maxHeight: '60vh' } : {}}
                    formats={customFormats}
                    selectable
                    toolbar={false}
                    localizer={localizer}
                    events={eventsActive}
                    onView={() => Views.WEEK}
                    views={views}
                    view={mobileDesign ? Views.DAY : viewMode}
                    date={date}
                    step={15}
                    min={viewMode == Views.WORK_WEEK ? todayAt8AM : todayAt0AM}
                    max={viewMode == Views.WORK_WEEK ? todayAt20PM : todayFinOfDay}
                    onNavigate={(_date) => setDate(_date)}
                    scrollToTime={dayjs().add(-1, 'h').toISOString()}
                    defaultDate={new Date()}
                    onEventDrop={moveEvent}
                    onEventResize={moveEvent}
                    draggableAccessor="isDraggable"
                    onSelectEvent={(event) => {
                        dispatch(setEventActive(event));
                    }}
                    onSelectSlot={handleSelect}
                    components={{
                        event: MyEvent,
                        week: {
                            event: MyWeekEvent,
                        },
                        work_week: {
                            event: MyWeekEvent,
                        },
                    }}
                    eventPropGetter={eventStyleGetter}
                    slotPropGetter={slotPropGetter}
                />
                <style>{customStyles}</style>
            </CardBody>
        </Card>
    )
};

export default MasterCalendar;
