import { useEffect } from "react";
import { useDispatch } from "react-redux";

const useFetchAllEvents = (allEvents: any, token: any, me: any, setAllEvents: any) => {
  const dispatch = useDispatch();
  let isMounted = true; // To prevent state updates after unmount
  useEffect(() => {
    let response;

    const fetchData = async () => {
      try {
        const res = await fetch(`/api/all_events?id=${me?.campus[0].id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        response = await res.json();

        if (res.ok) {
          dispatch(setAllEvents(response));
          // Example: setState(response);
        } else {
          throw new Error(response?.message || "Request failed");
        }
      } catch (error) {
        if (isMounted) {
          console.error("Fetch error:", error);
          // Handle error (e.g., setError(error.message))
        }
      }
    };
    if (!allEvents)
      fetchData();

    return () => {
      isMounted = false; // Prevent updates if component unmounts
    };
  }, [allEvents]);
}

export default useFetchAllEvents;
