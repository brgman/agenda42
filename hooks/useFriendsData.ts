
import { useRef, useCallback, useContext } from "react";
import { useDispatch } from "react-redux";
import ThemeContext from "../context/themeContext";
import { LOADING_STATUS } from "../type/modal-type";

export const useFriendsData = ({ id, token, setLoad }: any) => {
    const dispatch = useDispatch();
    const isFetching = useRef(false); // Prevent concurrent fetches

    const refreshAgenda = useCallback(async () => {
        if (isFetching.current) {
            console.log('Refresh already in progress, skipping...');
            return;
        }

        isFetching.current = true;
        try {
            setLoad(LOADING_STATUS.LOADING);

            const response = await fetch(`/api/friends_data?id=${id | 0}`, {
                headers: { Authorization: `Bearer ${token}` },
                cache: 'no-store', // Prevent stale data if needed
            });

            const res = await response.json();
            if (!response.ok) {
                throw new Error(`Failed to refresh agenda: ${res.message || response.status}`);
            }

            return (res);
        } catch (error) {
            console.error('Refresh Agenda Error:', error);
        } finally {
            setLoad(LOADING_STATUS.ALL_EVENT_OF_USER);
            isFetching.current = false;
        }
    }, [dispatch, id, token, setLoad]); // Stable dependencies

    return refreshAgenda;
};