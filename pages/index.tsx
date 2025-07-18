'use client';
import React, { useCallback, useEffect, useState } from "react";
import type { NextPage } from "next";
import dayjs from "dayjs";
import classNames from "classnames";
import { useFormik } from "formik";
import Head from "next/head";
import { TColor } from "../type/color-type";
import useDarkMode from "../hooks/useDarkMode";
import Icon from "../components/icon/Icon";
import { getUnitType, getViews } from "../components/extras/calendarHelper";
import PageWrapper from "../layout/PageWrapper/PageWrapper";
import Page from "../layout/Page/Page";
import OffCanvas, {
  OffCanvasBody,
  OffCanvasHeader,
  OffCanvasTitle,
} from "../components/bootstrap/OffCanvas";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store";
import { setCanvasIsOpen, setEventActiveDefault, setUnitType } from "../store/slices/calendarSlice";
import axios from "axios";
import utc from "dayjs/plugin/utc";
import "dayjs/locale/fr";
import showNotification from "../components/extras/showNotification";
import { setDefances, setOriginalSlots, setScaleTeams, setSlots } from "../store/slices/slotsSlice";
import { preparationSlots } from "../common/function/preparationSlots";
import { getScaleTeams } from "../common/function/getScaleTeams";
import { setEvals } from "../store/slices/evalsSlice";
import { setEvents as setEventsRedux, setAllEvents } from '../store/slices/eventsSlice';
import OverlappingModal from "../components/agenda/OverlappangModal";
import Evaluation from "../components/agenda/Evaluation";
import Event from "../components/agenda/Event";
import Slot from "../components/agenda/Slot";
import Defanse from "../components/agenda/Defanse";
import { useRouter } from "next/router";
import Settings from "../components/settings";
import 'react-big-calendar/lib/addons/dragAndDrop/styles.scss'
import { removeCreateSlotHandler } from "../common/function/recre_slot_handler";
import { IEvent } from "../components/agenda/TemplatesEvent";
import { useRefreshAgenda } from "../hooks/useRefreshAgenda";
import useNotification from "../hooks/useNotification";
import useParsingEvents from "../hooks/useParsingEvents";
import useSwitchEvents from "../hooks/useSwichEvents";
import MasterCalendar from "../components/agenda/MasterCalendar";
import SideCalendar from "../components/agenda/SideCalendar";
import { delay } from "../helpers/helpers";
import axiosRetry from "axios-retry";

axiosRetry(axios, {
  retries: 3,
  retryDelay: (retryCount: any) => Math.pow(2, retryCount) * 1000, // exponential backoff
  retryCondition: (error: any) => error.response?.status === 429,
});

dayjs.extend(utc);
dayjs.locale("fr");

const now = new Date();

const Index: NextPage = ({ token, me }: any) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { notify } = router.query;
  const [loadGeneral, setLoad] = useState(true);
  const refreshAgenda = useRefreshAgenda({ me, token, setLoad });
  const { darkModeStatus, themeStatus } = useDarkMode();

  const settings = useSelector((state: RootState) => state.settings.settingsLoaded);
  const eventsIntra = useSelector((state: RootState) => state.events.events);
  const allEvents = useSelector((state: RootState) => state.events.all);
  const slotsIntra = useSelector((state: RootState) => state.slots.slots);
  const originalSlotsIntra = useSelector((state: RootState) => state.slots.original);
  const viewMode = useSelector((state: RootState) => state.calendar.unitType);
  const scaleUsers = useSelector((state: RootState) => state.slots.scaleTeam);
  const defances = useSelector((state: RootState) => state.slots.defances);
  const defancesHistory = useSelector((state: RootState) => state.slots.defancesHistory);
  const eventItem = useSelector((state: RootState) => state.calendar.eventActive);
  const toggleInfoEventCanvas = useSelector((state: RootState) => state.calendar.canvasIsOpen);

  const [date, setDate] = useState(new Date());
  const [eventAdding, setEventAdding] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [events, setEvents] = useState([]);
  const [eventsActive, setEventsActive] = useState([]);

  useEffect(() => {
    refreshAgenda();
    const update = setInterval(() => {
      refreshHandler();
    }, 60000 * 15);
    return () => clearInterval(update);
  }, [refreshAgenda]);

  useParsingEvents(eventsIntra, slotsIntra, defances, defancesHistory, me, setEvents, setEventsActive);
  useSwitchEvents(events, allEvents, setEventsActive);
  useNotification(events, notify, settings);

  // Calendar Unit Type
  const unitType = getUnitType(viewMode);

  // View modes; Month, Week, Work Week, Day and Agenda
  const views = getViews();

  const refreshHandler = async () => {
    const maxRetries = 3; // Maximum number of retry attempts
    let retryCount = 0;

    const attemptRefresh = async () => {
      setRefresh(true);

      try {
        const res = await fetch(
          "/api/refresh_agenda?id=" + me.id,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const response = await res.json();

        if (res.ok) {
          // Success case
          if (response.evaluations) {
            dispatch(setEvals(response.evaluations));
            dispatch(setDefances(response.evaluations));
          }
          if (response.slots) {
            dispatch(setOriginalSlots(response.slots));
            dispatch(setSlots(preparationSlots(response.slots)));
          }
          if (response.events)
            dispatch(setEventsRedux(response.events));

          showNotification(
            <span className='d-flex align-items-center'>
              <Icon
                icon='Info'
                size='lg'
                className='me-1'
              />
              <span>Updated Successfully</span>
            </span>,
            'Agenda update',
            'success'
          );
        } else if (res.status === 429 && retryCount < maxRetries) {
          // Handle 429 error with retry
          retryCount++;
          const retryAfter = res.headers.get('Retry-After')
            ? parseInt(res.headers.get('Retry-After')) * 1000
            : 5000 * retryCount; // Default to 5s, 10s, 15s

          console.log(`Rate limited. Retrying after ${retryAfter / 1000} seconds...`);
          await delay(retryAfter);
          return await attemptRefresh(); // Recursive retry
        } else {
          // Other errors or max retries reached
          location?.reload();
        }
      } catch (error) {
        console.error('Refresh failed:', error);
        location?.reload();
      }
      setRefresh(false);
      await delay(3000);
    };

    await attemptRefresh();
  };

  const handleSelect = async ({ start, end }: { start: any; end: any }) => {
    console.log("handleSelect")
    const startFormated = dayjs(start).add(-2, "h").format();
    const endFormated = dayjs(end).add(-2, "h").format();
    const diffInMinutes = dayjs(endFormated).diff(dayjs(startFormated), 'minute');

    if (diffInMinutes < 60 || diffInMinutes > 480) {
      return null;
    }

    const res = await fetch(
      "/api/make_slot?id=" +
      me.id +
      "&end=" +
      endFormated +
      "&start=" +
      startFormated,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    const slotJson = await res?.json();

    if (res.ok) {
      showNotification(
        <span className='d-flex align-items-center'>
          <Icon
            icon='Info'
            size='lg'
            className='me-1'
          />
          <span>Updated Successfully</span>
        </span>,
        'Slot has been created',
        'success'
      );
      // TODO: Make update agenda page after added slot

      const combined = [...slotJson, ...slotsIntra];
      dispatch(setOriginalSlots(combined));
      dispatch(setSlots(preparationSlots(combined)));
    } else {
      showNotification(
        <span className='d-flex align-items-center'>
          <Icon
            icon='Error'
            size='lg'
            className='me-1'
          />
          <span>Error</span>
        </span>,
        slotJson.message,
        'danger'
      );
    }
  };

  useEffect(() => {
    if (eventAdding) {
      dispatch(setCanvasIsOpen());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventAdding]);

  const eventStyleGetter = (
    event: { color?: TColor },
    start: any,
    end: any,
    // isSelected: boolean,
  ) => {
    const isActiveEvent = start <= now && end >= now;
    const isPastEvent = end < now;
    const color = isActiveEvent ? "success" : event.color;

    return {
      className: classNames({
        [`bg-l${darkModeStatus ? "o25" : "10"}-${color} text-${color}`]: color,
        "border border-success": isActiveEvent,
        [`bg-l${darkModeStatus ? "o25" : "10"}-${darkModeStatus ? "light" : "dark"} text-${darkModeStatus ? "light" : "dark"}`]: isPastEvent,
        "isDraggable": event.isDraggable && !isPastEvent,
        "nonDraggable": !event.isDraggable || isPastEvent,
      }),
    };
  };

  const formik = useFormik({
    initialValues: {
      eventName: "",
      eventStart: "",
      eventEnd: "",
      eventEmployee: "",
      eventAllDay: false,
    },
    onSubmit: (values) => {
      if (eventAdding) {
        setEvents((prevEvents) => [
          ...prevEvents,
          {
            id: values.eventStart,
            ...getServiceDataWithServiceName(values.eventName),
            end: values.eventEnd,
            start: values.eventStart,
            user: { ...getUserDataWithUsername(values.eventEmployee) },
          },
        ]);
      }
      dispatch(setCanvasIsOpen());
      setEventAdding(false);
      dispatch(setEventActiveDefault());
      formik.setValues({
        eventName: "",
        eventStart: "",
        eventEnd: "",
        eventEmployee: "",
        eventAllDay: false,
      });
    },
  });

  // Fetch scaleUsers on mount
  useEffect(() => {
    const fetchScaleUsers = async () => {
      try {
        await delay(1000);
        const users = await getScaleTeams(slotsIntra, token);
        dispatch(setScaleTeams(users));
      } catch (err) {
        console.error("Failed to fetch scale users:", err);
      }
    };

    if (slotsIntra && token) {
      fetchScaleUsers();
    }
  }, [slotsIntra, token, dispatch]);

  useEffect(() => {
    if (eventItem)
      formik.setValues({
        ...formik.values,
        // @ts-ignore
        eventId: eventItem.id || null,
        eventName: eventItem.name || "",
        eventStart: dayjs(eventItem.start).format(),
        eventEnd: dayjs(eventItem.end).format(),
        eventEmployee: eventItem?.user?.username || "",
      });
    return () => { };
    //	eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventItem]);

  const moveEvent = useCallback(
    async ({ event, start, end, isAllDay: droppedOnAllDaySlot = false }: any) => {
      const startFormated = dayjs(start).add(-2, "h").format();
      const endFormated = dayjs(end).add(-2, "h").format();
      const diffInMinutes = dayjs(endFormated).diff(dayjs(startFormated), 'minute');
      const deletedSlotsIds = event.slots_data.map((slot: any) => slot.id);
      if (diffInMinutes < 60)
        return;
      setLoad(true);
      const res = await removeCreateSlotHandler(deletedSlotsIds, token, start, end, me.id);
      console.log("res", res);

      if (res?.length >= 4) {
        const filtredSlots = originalSlotsIntra.filter((slot: any) => !deletedSlotsIds.includes(slot.id));
        const combined = [...res, ...filtredSlots];
        dispatch(setOriginalSlots(combined));
        dispatch(setSlots(preparationSlots(combined)));
      } else {
        showNotification(
          <span className='d-flex align-items-center'>
            <Icon
              icon='Error'
              size='lg'
              className='me-1'
            />
            <span>Error</span>
          </span>,
          "Please, make the new slot for this time",
          'danger'
        );
      }
      setLoad(false);
    },
    [me, originalSlotsIntra, slotsIntra]
  )

  return (
    <PageWrapper>
      <Head>
        <title>Agenda42</title>
        <meta property="og:title" content="Agenda42" />
        <meta property="og:description" content="This is a description of my awesome app.Simplify your life with Agenda42! Manage all your events and evaluations in a single, easy-to-use calendar. Whether it’s scheduling appointments, tracking availability, or organizing tasks, Agenda42 keeps everything in one place for seamless planning and productivity." />
        <meta property="og:url" content="https://agenda42.fr" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <Page container="fluid" className="pb-0">
        <div className="row h-100" style={{
          filter: loadGeneral ? "blur(5px)" : "blur(0px)",
          pointerEvents: loadGeneral ? "none" : "auto",
          transition: "filter .5s ease-in-out",
        }}>
          <div className="col-xl-3 small_agenda d-none d-md-none d-xl-block">
            <SideCalendar
              events={events}
              views={views}
              date={date}
              handleSelect={handleSelect}
              eventStyleGetter={eventStyleGetter}
              setDate={setDate}
              setUnitType={setUnitType}
            />
          </div>
          <div className="col-xl-9">
            <MasterCalendar
              unitType={unitType}
              date={date}
              setDate={setDate}
              viewMode={viewMode}
              refresh={refresh}
              scaleUsers={scaleUsers}
              refreshHandler={refreshHandler}
              eventsActive={eventsActive}
              views={views}
              moveEvent={moveEvent}
              handleSelect={handleSelect}
              eventStyleGetter={eventStyleGetter}
              token={token}
            />
          </div>
        </div>

        <OffCanvas
          setOpen={(status: boolean) => {
            dispatch(setCanvasIsOpen());
            setEventAdding(status);
          }}
          isOpen={toggleInfoEventCanvas}
          titleId="canvas-title"
        >
          <OffCanvasHeader
            setOpen={(status: boolean) => {
              dispatch(setCanvasIsOpen());
              setEventAdding(status);
            }}
            className="p-4"
          >
            <OffCanvasTitle id="canvas-title">
              {eventAdding ? "Add Event" : ""}
            </OffCanvasTitle>
          </OffCanvasHeader>
          <OffCanvasBody
            tag="form"
            onSubmit={formik.handleSubmit}
            className="p-4"
          >
            {!eventAdding ? (
              <div className="row g-4" style={{ backgroundColor: 'transparent' }}>
                {(eventItem?.scale_team?.id && !(eventItem?.type === "defances")) ? (
                  <Evaluation token={token} eventItem={eventItem} scaleUsers={scaleUsers} me={me} />
                ) :
                  (eventItem?.type === "defances")
                    ? <Defanse token={token} eventItem={eventItem} scaleUsers={scaleUsers} me={me} />
                    : (eventItem?.name != "Available")
                      ? <Event eventItem={eventItem} token={token} originalSlotsIntra={originalSlotsIntra} />
                      : <Slot eventItem={eventItem} token={token} originalSlotsIntra={originalSlotsIntra} />
                }
              </div>
            ) : (
              <div className="row g-4">{ }</div>
            )}
          </OffCanvasBody>
        </OffCanvas>
        {settings ? <Settings settingsLoaded={settings} /> : null}
        <OverlappingModal events={events} />
      </Page>
    </PageWrapper>
  );
};

export async function getServerSideProps({ req, locale }: any) {
  const { token, expires_at } = req.cookies || {};

  console.log("Cookies received:", { token, expires_at });

  const authUrl =
    "https://api.intra.42.fr/oauth/authorize?" +
    new URLSearchParams({
      client_id: process.env.CLIENT_ID as string,
      redirect_uri: process.env.API_URI as string,
      response_type: "code",
      scope: "public projects profile",
    }).toString();

  if (!token) {
    console.log("No token, redirecting to:", authUrl);
    return {
      redirect: { destination: authUrl, permanent: false },
    };
  }

  const expiresAtNum = expires_at ? parseInt(expires_at, 10) : 0;
  const isExpired = Date.now() > expiresAtNum;
  console.log("Token expiration check:", {
    expires_at,
    isExpired,
    now: Date.now(),
  });

  if (isExpired) {
    console.log("Token expired, redirecting to:", authUrl);
    return {
      redirect: { destination: authUrl, permanent: false },
    };
  }

  try {
    console.log("Fetching user data with token:", token);
    const response = await axios.get("https://api.intra.42.fr/v2/me", {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("User data fetched:", response.data.login);
    return {
      props: {
        token,
        me: response.data,
      },
    };
  } catch (error: any) {
    console.error("API error:", error.response?.status, error.response?.data);
    return {
      redirect: { destination: authUrl, permanent: false },
    };
  }
}

export default Index;
