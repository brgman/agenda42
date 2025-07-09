import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
    slotRemoveMod: boolean;
    settingsIsOpen: boolean;
    settingsLoaded: any;
}

const initialState: UserState = {
    slotRemoveMod: false,
    settingsIsOpen: false,
    settingsLoaded: null,
};

const userSlice = createSlice({
    name: 'settinds',
    initialState,
    reducers: {
        setSlotsMod(state, action: PayloadAction<any>) {
            state.slotRemoveMod = action.payload;
        },
        setModalStatus(state, action: PayloadAction<any>) {
            state.settingsIsOpen = action.payload;
        },
        setSavedSettings(state, action: PayloadAction<any>) {
            state.settingsLoaded = action.payload;
        },
    },
});

export const { setSlotsMod, setModalStatus, setSavedSettings } = userSlice.actions;
export default userSlice.reducer;