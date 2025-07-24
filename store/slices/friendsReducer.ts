import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
    list: any;
    wavingList: any;
    pins: any;
}

const initialState: UserState = {
    list: [],
    wavingList: [],
    pins: [],
};

const userSlice = createSlice({
    name: 'settinds',
    initialState,
    reducers: {
        setSavedFriends(state, action: PayloadAction<any>) {
            state.list = action.payload?.data ? [...action.payload?.data] : [];
        },
        setSavedWavingHand(state, action: PayloadAction<any>) {
            state.wavingList = action.payload?.data;
        },
        addFriendToList(state, payload: PayloadAction<any>) {
            state.list = [...state.list, payload.payload]
        },
        removeFriendFromList(state, payload: PayloadAction<any>) {
            state.list = state.list.filter(i => i.friend_id !== payload.payload);
        },
        addFriendToPinList(state, payload: PayloadAction<any>) {
            state.pins = [...state.pins, payload.payload]
        },
        removeFriendFromPinList(state, payload: PayloadAction<any>) {
            state.pins = state.pins.filter(i => i !== payload.payload);
        },
    },
});

export const { setSavedFriends, addFriendToList, removeFriendFromList, setSavedWavingHand,
    addFriendToPinList, removeFriendFromPinList
  } = userSlice.actions;
export default userSlice.reducer;