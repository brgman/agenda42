import dayjs from "dayjs";
import Button from "../bootstrap/Button";
import { useDispatch, useSelector } from "react-redux";
import { setOriginalSlots, setSlots } from "../../store/slices/slotsSlice";
import { preparationSlots } from "../../common/function/preparationSlots";
import showNotification from "../extras/showNotification";
import Icon from "../icon/Icon";
import { RootState } from "../../store";

const Slot = ({ eventItem, token, originalSlotsIntra }: any) => {
    const dispatch = useDispatch();
    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
    const slotRemoveMod = useSelector((state: RootState) => state.settings.slotRemoveMod);

    const unsubscribeHandler = async (event: any) => {
        const res = await fetch("/api/proxy?id=" + event.id, {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
            const filtredSlots = originalSlotsIntra.filter((i: any) => i.id != event.id);
            dispatch(setOriginalSlots(filtredSlots));
            dispatch(setSlots(preparationSlots(filtredSlots)));
            showNotification(
                <span className='d-flex align-items-center'>
                    <Icon
                        icon='Info'
                        size='lg'
                        className='me-1'
                    />
                    <span>Successfully</span>
                </span>,
                'Slot has been deleted',
                'success'
            );
        } else {
            showNotification(
                <span className='d-flex align-items-center'>
                    <Icon
                        icon='Error'
                        size='lg'
                        className='me-1'
                    />
                    <span>Error</span>
                </span>,
                "Slot not removed",
                'danger'
            );
        }
    };

    const removeSlotHandler = async (events: any) => {
        let deletedCount = 0;
        const maxRetries = 5;
        const retryDelay = 3000;
        const deletedEventIds = [];

        for (const event of events) {
            if (event.scale_team === 'event') {
                continue;
            }

            let retries = 0;
            let success = false;

            while (retries < maxRetries && !success) {
                try {
                    const res = await fetch("/api/proxy?id=" + event.id, {
                        headers: { Authorization: `Bearer ${token}` },
                    });

                    if (res.ok) {
                        deletedEventIds.push(event.id);
                        deletedCount++;
                        success = true;
                        await delay(500);
                    } else if (res.status === 429) {
                        retries++;
                        if (retries < maxRetries) {
                            showNotification(
                                <span className="d-flex align-items-center">
                                    <Icon icon="Warning" size="lg" className="me-1" />
                                    <span>Rate Limit</span>
                                </span>,
                                `Too many requests, retrying (${retries}/${maxRetries}) after ${retryDelay / 1000}s`,
                                "warning"
                            );
                            await delay(retryDelay);
                        } else {
                            showNotification(
                                <span className="d-flex align-items-center">
                                    <Icon icon="Error" size="lg" className="me-1" />
                                    <span>Failed</span>
                                </span>,
                                "Max retries reached for slot deletion",
                                "danger"
                            );
                            break;
                        }
                    } else {
                        showNotification(
                            <span className="d-flex align-items-center">
                                <Icon icon="Error" size="lg" className="me-1" />
                                <span>Error</span>
                            </span>,
                            `Slot not removed: ${res.statusText}`,
                            "danger"
                        );
                        break;
                    }
                } catch (error) {
                    showNotification(
                        <span className="d-flex align-items-center">
                            <Icon icon="Error" size="lg" className="me-1" />
                            <span>Network Error</span>
                        </span>,
                        `Failed to delete slot: ${error.message}`,
                        "danger"
                    );
                    break;
                }
            }
        }

        // After the loop, filter and dispatch once if any events were deleted
        if (deletedEventIds.length > 0) {
            showNotification(
                <span className="d-flex align-items-center">
                    <Icon icon="Info" size="lg" className="me-1" />
                    <span>Successfully</span>
                </span>,
                "Slot has been deleted",
                "success"
            );
            const filtredSlots = originalSlotsIntra.filter((slot) => !deletedEventIds.includes(slot.id));
            dispatch(setOriginalSlots(filtredSlots));
            dispatch(setSlots(preparationSlots(filtredSlots)));
        }

        return deletedCount; // Return number of successful deletions
    };

    const justForFuture = (date: any) => {
        const nowMinusOneHour = dayjs().subtract(-30, 'minutes');
        return !dayjs(date).isAfter(nowMinusOneHour);
    }


    return (
        <>
            <h2>Remove the slot</h2>
            <div>

                <div className="col mb-5 mt-2" >
                    <Button
                        style={{ marginTop: 10, width: "100%" }}
                        color="danger"
                        type="submit"
                        disabled={justForFuture(eventItem.slots_data[0].begin_at)}
                        onClick={() => removeSlotHandler(eventItem.slots_data)}
                    >
                        {dayjs(eventItem.slots_data[0].begin_at).format('H:mm')} - {dayjs(eventItem.slots_data[eventItem.slots_data.length - 1].end_at).format('H:mm')}
                    </Button>
                </div>


                {slotRemoveMod ? <>
                    <h4>Remove a part of the slot</h4>
                    {
                        eventItem.slots_data.map((item: any) => {
                            return (
                                <div className="col" id={item.id}  >
                                    <Button
                                        style={{ marginTop: 10, width: "100%" }}
                                        color="secondary"
                                        type="submit"
                                        disabled={justForFuture(eventItem.slots_data[0].begin_at)}
                                        onClick={() => unsubscribeHandler(item)}
                                    >
                                        {dayjs(item.begin_at).format('H:mm')} - {dayjs(item.end_at).format('H:mm')}
                                    </Button>
                                </div>
                            );
                        })
                    }
                </> : null}
            </div>
        </>
    );
};

export default Slot;
