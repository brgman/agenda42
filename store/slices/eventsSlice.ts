import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface EventsState {
    events: any | null; // Replace `any` with a proper type for your user data if available
    all: any | null;
    locations: any | null;
    loading: boolean;
    error: string | null;
}

const initialState: EventsState = {
    events: null,
    all: null,
    locations: null,
    loading: false,
    error: null,
};

const eventsSlice = createSlice({
    name: 'events',
    initialState,
    reducers: {
        setEvents(state, action: PayloadAction<any>) {
            state.events = action.payload;
            state.loading = false;
            state.error = null;
        },
        setAllEvents(state, action: PayloadAction<any>) {
            state.events = state.events;
            state.all = action.payload;
            state.loading = false;
            state.error = null;
        },
        setLocations(state, action: PayloadAction<any>) {
            state.locations = action.payload;
        },
        setLoading(state) {
            state.loading = true;
            state.error = null;
        },
        setError(state, action: PayloadAction<string>) {
            state.loading = false;
            state.error = action.payload;
        },
    },
});

export const { setEvents, setAllEvents, setLoading, setError, setLocations } = eventsSlice.actions;
export default eventsSlice.reducer;