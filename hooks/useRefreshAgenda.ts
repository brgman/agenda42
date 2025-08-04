
import { useRef, useCallback, useContext } from "react";
import { useDispatch } from "react-redux";
import { setEvals } from "../store/slices/evalsSlice";
import { setGender, setNotReadedWaving, setSavedSettings } from "../store/slices/settingsReducer";
import { setSavedFriends, setSavedWavingHand } from "../store/slices/friendsReducer";
import { setOriginalSlots, setSlots, setDefances, setDefancesHistory } from "../store/slices/slotsSlice";
import { getNextEvaluation } from "../common/function/getNextEvaluation";
import { getGenderOfUser, getUserFriends, getUserSettings, getUserWavingHand } from "../common/function/getUserSettings";
import { preparationSlots } from "../common/function/preparationSlots";
import { setUser } from "../store/slices/userSlice";
import { setAllEvents, setEvents, setExams, setLocations } from "../store/slices/eventsSlice";
import { setUnitType } from "../store/slices/calendarSlice";
import ThemeContext from "../context/themeContext";
import { redirect } from "next/navigation";
import router from "next/router";

export const useRefreshAgenda = ({ me, token, setLoad }: any) => {
    const { viewModeStatus } = useContext(ThemeContext);
    const dispatch = useDispatch();
    const isFetching = useRef(false); // Prevent concurrent fetches

    const refreshAgenda = useCallback(async () => {
        if (isFetching.current) {
            console.log('Refresh already in progress, skipping...');
            return; // Skip if already fetching
        }

        isFetching.current = true;
        try {
            setLoad(true);
            dispatch(setUser(me));
            const genderData = await getGenderOfUser(me.id);
            console.log("genderData", genderData)
            dispatch(setGender(genderData));
            if (genderData.status == "NOT_FOUND")
                return;
            else if (genderData.status == "Forbidden")
                router.push("/auth");
            const {cursus_id} = me.cursus_users.filter(i => i.end_at == null)[0];
            const { id } = me.campus.filter(i => i.active)[0];
            const response = await fetch(`/api/refresh_agenda?id=${me.id}&campusId=${id}&cursusId=${cursus_id}`, {
                headers: { Authorization: `Bearer ${token}` },
                cache: 'no-store', // Prevent stale data if needed
            });

            const res = await response.json();
            if (!response.ok) {
                throw new Error(`Failed to refresh agenda: ${res.message || response.status}`);
            }

            const settingsData = await getUserSettings(me.id);
            dispatch(setSavedSettings(settingsData));
            const friendsData = await getUserFriends(me.id, token);
            dispatch(setSavedFriends(friendsData));
            const wavingHandData = await getUserWavingHand(me.id);
            const wavingNotRead = wavingHandData?.data.filter(i => i.status === "send").length || 0;
            dispatch(setNotReadedWaving(wavingNotRead));
            dispatch(setSavedWavingHand(wavingHandData));

            if (res.slots) {
                const preparedSlots = preparationSlots(res.slots);
                getNextEvaluation(preparedSlots, settingsData?.data?.chat_id, res.events);
                dispatch(setOriginalSlots(res.slots));
                dispatch(setSlots(preparedSlots));
            }
            if (res.evaluations) {
                dispatch(setEvals(res.evaluations)); // TODO : defancesHistory ?
                dispatch(setDefances(res.evaluations));
            }
            // Batch additional updates
            res.defancesHistory && dispatch(setDefancesHistory(res.defancesHistory));
            res.events && dispatch(setEvents(res.events));
            res.campusEvents && dispatch(setAllEvents(res.campusEvents));
            res.locations && dispatch(setLocations(res.locations));
            // res.exams && dispatch(setExams(res.exams));

            dispatch(setUnitType(viewModeStatus));
        } catch (error) {
            console.error('Refresh Agenda Error:', error);
            // Optionally rethrow or handle error for UI feedback
        } finally {
            setLoad(false);
            isFetching.current = false;
        }
    }, [dispatch, me?.id, token, setLoad]); // Stable dependencies

    return refreshAgenda;
};