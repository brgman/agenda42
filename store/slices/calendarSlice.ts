import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CalendarState {
    unitType: 'month' | 'week' | 'work_week' | 'day' | 'agenda';
    focusing: 'all' | 'my';
}

const initialState: CalendarState = {
    unitType: 'week',
    focusing: 'all',
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
    },
});

export const { setUnitType, setSwitchEvents } = calendarSlice.actions;
export default calendarSlice.reducer;