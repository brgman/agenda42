
import { useRef, useCallback, useContext } from "react";
import { useDispatch } from "react-redux";
import ThemeContext from "../context/themeContext";

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
            setLoad(true);

            const response = await fetch(`/api/friends_data?id=${id | 0}`, {
                headers: { Authorization: `Bearer ${token}` },
                cache: 'no-store', // Prevent stale data if needed
            });

            const res = await response.json();
            if (!response.ok) {
                throw new Error(`Failed to refresh agenda: ${res.message || response.status}`);
            }

            console.log("refreshAgenda: ", res);
        } catch (error) {
            console.error('Refresh Agenda Error:', error);
        } finally {
            setLoad(false);
            isFetching.current = false;
        }
    }, [dispatch, id, token, setLoad]); // Stable dependencies

    return refreshAgenda;
};