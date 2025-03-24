import dayjs from "dayjs";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const removeSlotsHandler = async (events: any, token: any) => {
    let deletedCount = 0;
    const maxRetries = 5;
    const retryDelay = 3000;
    const deletedEventIds = [];

    for (const event of events) {
        let retries = 0;
        let success = false;

        while (retries < maxRetries && !success) {
            try {
                const res = await fetch("/api/proxy?id=" + event, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (res.ok) {
                    deletedEventIds.push(event);
                    deletedCount++;
                    success = true;
                    console.log("Slot has been deleted");
                    await delay(500);
                } else if (res.status === 429) {
                    retries++;
                    if (retries < maxRetries) {
                        console.log("")
                        await delay(retryDelay);
                    } else {
                        console.log("Max retries reached for slot deletion");
                        break;
                    }
                } else {
                    console.log("Slot not removed");
                    break;
                }
            } catch (error) {
                console.log("Failed to delete slot");
                break;
            }
        }
    }

    return deletedCount;
};

const createSlot = async (token: any, end: any, start: any, meId: any) => {
    const res = await fetch(
        "/api/make_slot?id=" +
        meId +
        "&end=" +
        end +
        "&start=" +
        start,
        {
            headers: { Authorization: `Bearer ${token}` },
        },
    );

    const slotJson = await res?.json();

    if (res.ok) {
        return (slotJson);
    }
}

export const removeCreateSlotHandler = async (events: any, token: any, start: any, end: any, meId: any) => {
    const startFormated = dayjs(start).add(-1, "h").format();
    const endFormated = dayjs(end).add(-1, "h").format();
    const removeRes = await removeSlotsHandler(events, token);
    if (removeRes === events.length) {
        console.log("removeRes", removeRes, events.length)
        const resCreate = await createSlot(token, endFormated, startFormated, meId);
        return (resCreate);
    }
}
