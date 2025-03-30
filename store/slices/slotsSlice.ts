import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
    slots: any | null; // Replace `any` with a proper type for your user data if available
    original: any | null;
    defances: any | null;
    defancesHistory: any | null;
    scaleTeam: any | null;
    loading: boolean;
    error: string | null;
}

const initialState: UserState = {
    slots: null,
    defances: null,
    defancesHistory: null,
    original: null,
    scaleTeam: [],
    loading: false,
    error: null,
};

const slotsSlice = createSlice({
    name: 'slots',
    initialState,
    reducers: {
        setSlots(state, action: PayloadAction<any>) {
            state.slots = action.payload;
            state.loading = false;
            state.error = null;
        },
        setOriginalSlots(state, action: PayloadAction<any>) {
            state.slots = state.slots;
            state.original = action.payload;
            state.loading = false;
            state.error = null;
        },
        setScaleTeams(state, action: PayloadAction<any>) {
            state.scaleTeam = action.payload;
        },
        setDefances(state, action: PayloadAction<any>) {
            state.defances = action.payload;
        },
        setDefancesHistory(state, action: PayloadAction<any>) {
            state.defancesHistory = action.payload;
        },
        updateUser(state, action) {
            console.log("action", action)
            const cursusUser = action.payload.cursus_users?.find((i) => i.cursus_id === 21);

            if (!cursusUser) return;

            const { grade, level } = cursusUser;
            const user = state.scaleTeam.find((u) => u.id === action.payload.id);

            user.languages = action.payload.languages;
            if (user) {
                user.grade = grade;
                user.level = level;
            }
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

export const { setSlots, setOriginalSlots, setScaleTeams, setDefances, updateUser, setDefancesHistory, setLoading, setError } = slotsSlice.actions;
export default slotsSlice.reducer;