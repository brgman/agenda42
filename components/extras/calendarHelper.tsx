import React, { FC, useContext } from "react";
import PropTypes from "prop-types";
import { Views } from "react-big-calendar";
import dayjs from "dayjs";
import Button, { ButtonGroup } from "../bootstrap/Button";
import Dropdown, {
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
} from "../bootstrap/Dropdown";
import { useDispatch, useSelector } from "react-redux";
import { setUnitType } from "../../store/slices/calendarSlice";
import ThemeContext from "../../context/themeContext";
import { CardActions } from "../bootstrap/Card";

export const getUnitType = (
  viewMode: "month" | "week" | "work_week" | "day" | "agenda",
) => {
  let unitType = null;
  switch (viewMode) {
    case Views.WEEK:
    case Views.WORK_WEEK:
      unitType = Views.WEEK;
      break;
    case Views.MONTH:
    case Views.AGENDA:
      unitType = Views.MONTH;
      break;
    default:
      unitType = Views.DAY;
  }
  return unitType;
};

export const getLabel = (
  date: dayjs.ConfigType,
  viewMode: "month" | "week" | "work_week" | "day" | "agenda",
) => {
  if (viewMode === Views.MONTH)
    return dayjs(date).format("MMMM YYYY");
  if (viewMode === Views.WEEK)
    return `${dayjs(date).startOf("week").format("D MMMM")} - ${dayjs(date)
      .endOf("week")
      .format("D MMMM")}`;
  if (viewMode === Views.WORK_WEEK)
    return `${dayjs(date).startOf("week").format("D MMM")} - ${dayjs(
      date,
    )
      .endOf("week")
      .add(-1, "day")
      .format("D MMM")}`;
  if (viewMode === Views.AGENDA)
    return `${dayjs(date).format("D MMM")} - ${dayjs(date).add(1, "month").format("D MMM YYYY")}`;
  return dayjs(date).format("dddd, D MMMM");
};

export const getTodayButtonLabel = (
  viewMode: "month" | "week" | "work_week" | "day" | "agenda",
) => {
  if (viewMode === Views.MONTH || viewMode === Views.AGENDA)
    return "Month";
  if (viewMode === Views.WEEK || viewMode === Views.WORK_WEEK)
    return "Week";
  return "❤️";
};

export const getViews = () => {
  // @ts-ignore
  return Object.keys(Views).map((k) => Views[k]);
};

interface ICalendarTodayButtonProps {
  setDate(...args: unknown[]): unknown;
  date: object;
  unitType: string;
  viewMode: "month" | "week" | "work_week" | "day" | "agenda";
  central: boolean;
}
export const CalendarTodayButton: FC<ICalendarTodayButtonProps> = ({
  setDate,
  date,
  unitType,
  viewMode,
  central = true
}) => {
  return (
    <ButtonGroup>
      <Button
        color="primary"
        // @ts-ignore
        onClick={() => setDate(dayjs(date).add(-1, unitType).toDate())}
        icon="ChevronLeft"
        aria-label="Prev"
      />
      {/* @ts-ignore */}
      <Button 
        color="primary" 
        className={dayjs(date).isSame(dayjs(), viewMode == Views.AGENDA ? 'month' : 'day') ? '' : 'btn-light'}
        onClick={() => {
          viewMode == Views.AGENDA
            ? setDate(dayjs().startOf('month').toDate())
            : setDate(dayjs(new Date()).toDate())
        }}
        isDisable={dayjs(date).isSame(dayjs(), viewMode == Views.AGENDA ? 'month' : 'day')}
        icon="Today"
      />
      {/* @ts-ignore */}
      <Button color="primary" onClick={() => setDate(dayjs(date).add(1, unitType).toDate())}
        icon="ChevronRight"
        aria-label="Next"
      />
    </ButtonGroup>
  );
};

CalendarTodayButton.propTypes = {
  setDate: PropTypes.func.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  date: PropTypes.object.isRequired,
  unitType: PropTypes.string.isRequired,
  // @ts-ignore
  viewMode: PropTypes.oneOf(["month", "week", "work_week", "day", "agenda"])
    .isRequired,
};

interface ICalendarViewModeButtonsProps {
  viewMode: "month" | "week" | "work_week" | "day" | "agenda";
}
export const CalendarViewModeButtons: FC<ICalendarViewModeButtonsProps> = ({
  viewMode,
}) => {
  const dispatch = useDispatch();
  const { mobileDesign, setViewModeStatus } = useContext(ThemeContext);
  const setViewMode = (
    viewMode: "month" | "week" | "work_week" | "day" | "agenda",
  ) => {
    dispatch(setUnitType(viewMode));
    setViewModeStatus(viewMode);
  };

  if (mobileDesign) {
    setViewMode(Views.DAY);
    return "";
  }

  return (
    <CardActions>
      <Dropdown direction="down">
        <DropdownToggle>
          <Button
            color="primary"
            icon={
              (viewMode === Views.MONTH && "calendar_view_month") ||
              (viewMode === Views.WEEK && "calendar_view_week") ||
              (viewMode === Views.WORK_WEEK && "view_week") ||
              (viewMode === Views.DAY && "calendar_view_day") ||
              "view_agenda"
            }
          >
            {(viewMode === Views.MONTH && "Month") ||
              (viewMode === Views.WEEK && "Week") ||
              (viewMode === Views.WORK_WEEK && "Alternance") ||
              (viewMode === Views.DAY && "Day") ||
              (viewMode === Views.WORK_WEEK && "Alternance") || "Table"}
          </Button>
        </DropdownToggle>
        <DropdownMenu isAlignmentEnd>
          <DropdownItem>
            <Button
              color="link"
              icon="calendar_view_week"
              isActive={viewMode === Views.WEEK}
              onClick={() => setViewMode(Views.WEEK)}
            >
              Week
            </Button>
          </DropdownItem>
          <DropdownItem>
            <Button
              color='link'
              icon='view_week'
              isActive={viewMode === Views.WORK_WEEK}
              onClick={() => setViewMode(Views.WORK_WEEK)}>
              Alternance
            </Button>
          </DropdownItem>
          <DropdownItem>
            <Button
              color="link"
              icon="calendar_view_month"
              isActive={viewMode === Views.MONTH}
              onClick={() => setViewMode(Views.MONTH)}
            >
              Month
            </Button>
          </DropdownItem>
          <DropdownItem>
            <Button
              color="link"
              icon="view_agenda"
              isActive={viewMode === Views.AGENDA}
              onClick={() => setViewMode(Views.AGENDA)}
            >
              Table
            </Button>
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </CardActions>
  );
};
CalendarViewModeButtons.propTypes = {
  // @ts-ignore
  viewMode: PropTypes.oneOf(["month", "week", "work_week", "day", "agenda"])
    .isRequired,
};
