import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
    pointsForPinned: string;
    slotRemoveMod: boolean;
    settingsIsOpen: boolean;
    piscineIsOpen: boolean;
    friendsIsOpen: boolean;
    wavingHandIsOpen: boolean;
    settingsLoaded: any;
    gender: string;
    waving_not_read: number;
}

const initialState: UserState = {
    pointsForPinned: process.env.POINTS_FOR_PINNED as string || "0", // DEBUG
    slotRemoveMod: false,
    settingsIsOpen: false,
    friendsIsOpen: false,
    piscineIsOpen: false,
    wavingHandIsOpen: false,
    settingsLoaded: null,
    gender: "null",
    waving_not_read: 0,
};

const userSlice = createSlice({
    name: 'settinds',
    initialState,
    reducers: {
        setSlotsMod(state, action: PayloadAction<any>) {
            state.slotRemoveMod = action.payload;
        },
        setModalSettingsStatus(state, action: PayloadAction<any>) {
            state.settingsIsOpen = action.payload;
        },
        setModalPiscineStatus(state, action: PayloadAction<any>) {
            state.piscineIsOpen = action.payload;
        },
        setModalFriendsStatus(state, action: PayloadAction<any>) {
            state.friendsIsOpen = action.payload;
        },
        setModalWavingHandStatus(state, action: PayloadAction<any>) {
            state.wavingHandIsOpen = action.payload;
        },
        setSavedSettings(state, action: PayloadAction<any>) {
            state.settingsLoaded = action.payload;
        },
        setGender(state, action: PayloadAction<any>) {
            state.gender = action.payload.data;
        },
        setNotReadedWaving(state, action: PayloadAction<any>) {
            state.waving_not_read = action.payload;
        },
    },
});

export const { setNotReadedWaving, setSlotsMod, setModalPiscineStatus, setModalSettingsStatus, setModalFriendsStatus, setModalWavingHandStatus, setSavedSettings, setGender } = userSlice.actions;
export default userSlice.reducer;