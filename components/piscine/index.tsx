import { FC, useEffect, useState } from "react";
import OffCanvas, { OffCanvasHeader, OffCanvasTitle, OffCanvasBody } from "../bootstrap/OffCanvas";
import { RootState } from "../../store";
import { useDispatch, useSelector } from "react-redux";
import { setModalPiscineStatus } from "../../store/slices/settingsReducer";
import { delay, getMaxPage, getName, userInIntraHandler } from "../../helpers/helpers";
import Card, { CardHeader, CardLabel, CardTitle } from "../bootstrap/Card";
import Avatar from "../Avatar";
import Button from "../bootstrap/Button";
import Spinner from "../bootstrap/Spinner";
import Badge from "../bootstrap/Badge";
import useDarkMode from "../../hooks/useDarkMode";

import dayjs from "dayjs";
import PiscineSelect from "../extras/piscineSelect";
import Icon from "../icon/Icon";
import AddFriendButton from "../agenda/AddFriendButton";

const Piscine: FC<any> = ({ token }: any) => {
    const friends = useSelector((state: RootState) => state.friends.list);
    const piscineIsOpen = useSelector((state: RootState) => state.settings.piscineIsOpen);
    const me = useSelector((state: RootState) => state.user.me);
    const [successWavingHand, setSuccessWavingHand] = useState<number[]>([]);
    const { darkModeStatus } = useDarkMode();
    const [page, setPage] = useState(1);
    const [maxPage, setMaxPage] = useState(0);
    let isFetching = false;

    const dispatch = useDispatch();

    const setModal = (status: boolean) => {
        dispatch(setModalPiscineStatus(status));
    }

    const [refresh, setRefresh] = useState(false);
    const [monthSort, setMonth] = useState(me.pool_month);
    const [yearSort, setYear] = useState(me.pool_year);
    const [users, setUsers] = useState<any[]>([]);
    const [success, setSuccess] = useState<number[]>([]);
    const [update, setUpdate] = useState(false);

    const getMyPiscine = async () => {
        if (isFetching) return;
        isFetching = true;

        const maxRetries = 3;
        let retryCount = 0;

        const attemptRefresh = async () => {
            setRefresh(true);
            try {
                const res = await fetch(
                    `/api/piscine?year=${me.pool_year}&page=${page}&month=${me.pool_month}&yearSort=${yearSort}&monthSort=${monthSort}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                const response = await res.json();
                const pageNumbers = getMaxPage(response.links);

                if (maxPage <= 1) setMaxPage(pageNumbers);

                if (res.ok) {
                    setUsers((last) => [...last, ...response.data]);
                    setPage(page + 1);
                } else if (res.status === 429 && retryCount < maxRetries) {
                    retryCount++;
                    const retryAfter = res.headers.get('Retry-After')
                        ? parseInt(res.headers.get('Retry-After')) * 1000
                        : 5000 * retryCount;
                    console.log(`Rate limited. Retrying after ${retryAfter / 1000} seconds...`);
                    await delay(retryAfter);
                    return await attemptRefresh();
                }
            } finally {
                setRefresh(false);
                isFetching = false; // Reset flag
            }
            await delay(3000);
        };

        await attemptRefresh();
    };

    const addWavingHandHandler = async (destinator_id: number, event_title: string, status: string, author_image_url: string, author_name: string, author_login: string) => {
        setUpdate(true);
        await fetch("/api/waving_hand", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                author_id: me.id,
                destinator_id,
                event_title,
                status,
                author_image_url,
                author_name,
                author_login,
                user_id: me.id,
            }),
        }).then(async (response) => {
            setUpdate(false);
            if (!response.ok) {
                console.log(`Failed to create settings: ${response.statusText}`);
            } else {
                setSuccessWavingHand((i: number[]) => [...i, destinator_id]);
            }
            return { success: true };
        })
    };

    const isMyPiscine = () => (me.pool_month == monthSort && me.pool_year == yearSort);

    useEffect(() => {
        getMyPiscine();
    }, [monthSort, yearSort])

    if (!me || !users)
        return;

    return (
        <OffCanvas
            setOpen={(status: boolean) => { setModal(status) }}
            isOpen={piscineIsOpen}
            titleId="canvas-title"
        >
            <OffCanvasHeader
                setOpen={(status: boolean) => { setModal(status) }}
                className="p-4"
            >
                <OffCanvasTitle id="canvas-title" className="h2">
                    <Icon
                        style={{ marginRight: 10 }}
                        icon={'Water'}
                        color={darkModeStatus ? 'info' : 'primary'}
                    />
                    <Badge
                        isLight={darkModeStatus ? false : true}
                        color={isMyPiscine() ? 'piscine' : 'primary'}
                    > {monthSort} {yearSort}
                    </Badge>
                </OffCanvasTitle>
            </OffCanvasHeader>
            <PiscineSelect yearSort={yearSort} monthSort={monthSort} setMonth={setMonth} setYear={setYear} setUsers={setUsers} setPage={setPage} setMaxPage={setMaxPage} />
            <OffCanvasBody tag="form" className="p-4" >
                {
                    (refresh && !users.length)
                        ? (
                            <div className="d-flex justify-content-center mt-5">
                                <Spinner color="primary" random />
                            </div>
                        ) : <>
                            {
                                users.map(user => {
                                    const isIdInSuccess = success && success.includes(user.id);
                                    const isIdInSuccessWavingHand = success && successWavingHand.includes(user.id);
                                    const isFriend = friends?.find(i => i.friend_id == user.id);
                                    return (
                                        <Card isCompact
                                            borderSize={1}
                                            borderColor={isFriend ? "success" : null}
                                        >
                                            <CardHeader style={{ borderRadius: 20 }} >
                                                <CardLabel>
                                                    <CardTitle>
                                                        <span style={{ marginRight: 20 }}>
                                                            {getName(user)}
                                                        </span>
                                                        <Badge
                                                            isLight={darkModeStatus ? false : true}
                                                            color={user.location ? 'success' : 'dark'}
                                                        >
                                                            {
                                                                user.location
                                                                    ? user.location
                                                                    : dayjs(user.updated_at).fromNow()
                                                            }
                                                        </Badge>
                                                    </CardTitle>
                                                    <div style={{ marginTop: 10 }}>
                                                        <span style={{ marginRight: 10 }}>
                                                            <Badge
                                                                isLight={darkModeStatus ? false : true}
                                                                color='success'
                                                            >
                                                                {user.login}
                                                            </Badge>
                                                        </span>
                                                        <span style={{ marginRight: 10 }}>
                                                            <Badge
                                                                isLight={darkModeStatus ? false : true}
                                                                className="mb-2"
                                                                color='brand'
                                                            >
                                                                {user.wallet} ₳
                                                            </Badge>
                                                        </span>
                                                        {!user['active?'] ? <Badge

                                                            color='info'
                                                        >
                                                            freeze / bh
                                                        </Badge> : null}

                                                    </div>
                                                </CardLabel>
                                                <Avatar className="avatar-abs" src={user.image.versions.medium} size={64} />

                                            </CardHeader>

                                            <div className='card-aside d-flex row align-items-end event_row m-3 mt-0'>
                                                <div className='col-lg-6 p-1'>
                                                    <AddFriendButton
                                                        isIdInSuccess={isFriend || isIdInSuccess}
                                                        update={update}
                                                        setUpdate={setUpdate}
                                                        setSuccess={setSuccess}
                                                        user={user}
                                                    />
                                                    <Button
                                                        style={{ marginRight: 15 }}
                                                        className='h4'
                                                        icon="Link"
                                                        color="light"
                                                        onClick={() => userInIntraHandler(user.id)}
                                                    >
                                                    </Button>
                                                    {isFriend ? <Button
                                                        className='h4'
                                                        icon={update ? "Refresh" : "WavingHand"}
                                                        color={isIdInSuccessWavingHand ? "success" : "brand"}
                                                        onClick={() => addWavingHandHandler(user.id, "Pool", "send", me.image.versions.medium, getName(user), me.login)}
                                                    /> : null}
                                                </div>
                                                <div className='col-lg-6'>
                                                    <div className='h4 text-end'>
                                                        <Badge
                                                            isLight={darkModeStatus ? false : true}
                                                            color={isMyPiscine() ? 'piscine' : 'primary'}
                                                        >
                                                            {user.pool_month} {user.pool_year}
                                                        </Badge>
                                                    </div>
                                                </div>
                                            </div>
                                        </Card>
                                    )
                                })
                            }

                            {
                                (maxPage >= page && maxPage > 1)
                                    ? (
                                        <Button
                                            style={{ width: '100%' }}
                                            className='h4'
                                            icon={"Download"}
                                            color={"success"}
                                            isDisable={refresh}
                                            onClick={() => getMyPiscine()}
                                        >Load page {page} from {maxPage}</Button>
                                    ) : null}
                        </>
                }
            </OffCanvasBody>
        </OffCanvas>
    )
};

export default Piscine;