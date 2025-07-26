import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IEvent } from '../../components/agenda/TemplatesEvent';
import { isTilePast } from '../../helpers/helpers';

const initialEventItem: IEvent = {
    start: undefined,
    end: undefined,
    name: undefined,
    id: undefined,
    user: undefined,
};

interface CalendarState {
    unitType: 'month' | 'week' | 'work_week' | 'day' | 'agenda';
    focusing: 'all' | 'my';
    eventActive: IEvent;
    canvasIsOpen: boolean;
}

const initialState: CalendarState = {
    unitType: 'week',
    focusing: 'all',
    eventActive: initialEventItem,
    canvasIsOpen: false,
};

const calendarSlice = createSlice({
    name: 'calendar',
    initialState,
    reducers: {
        setUnitType(state, action: PayloadAction<any>) {
            state.unitType = action.payload;
        },
        setSwitchEvents(state, action: PayloadAction<'all' | 'my'>) {
            state.focusing = action.payload;
        },
        setEventActiveDefault(state) {
            state.eventActive = initialEventItem;
        },
        setEventActive(state, action: PayloadAction<IEvent>) {
            if (
                !(
                    isTilePast(action.payload.start)
                    && (action.payload.kind == "slot" || action.payload.scale_team == 'locations')
                )
            )
            {
                state.eventActive = action.payload;
                state.canvasIsOpen = true;
            }
        },
        setCanvasIsOpen(state) {
            state.canvasIsOpen = !state.canvasIsOpen;
        }
    },
});

export const { setUnitType,
    setSwitchEvents,
    setEventActive,
    setEventActiveDefault,
    setCanvasIsOpen
} = calendarSlice.actions;

export default calendarSlice.reducer;