import { FC, useEffect, useState } from "react";
import OffCanvas, { OffCanvasHeader, OffCanvasTitle, OffCanvasBody } from "../bootstrap/OffCanvas";
import { RootState } from "../../store";
import { useDispatch, useSelector } from "react-redux";
import { setModalFriendsStatus } from "../../store/slices/settingsReducer";
import { alphabeticSort, delay, pinSort, userInIntraHandler } from "../../helpers/helpers";
import Card, { CardBody, CardHeader, CardLabel, CardTitle } from "../bootstrap/Card";
import Avatar from "../Avatar";
import Button from "../bootstrap/Button";
import Badge from "../bootstrap/Badge";
import useDarkMode from "../../hooks/useDarkMode";
import { addFriendToPinList, removeFriendFromList, removeFriendFromPinList } from "../../store/slices/friendsReducer";
import Icon from "../icon/Icon";
import { LoadFriendInformation } from "../agenda/LoadFriendInformation";

const Friends: FC<any> = ({ token }: any) => {
    const friendsIsOpen = useSelector((state: RootState) => state.settings.friendsIsOpen);
    const me = useSelector((state: RootState) => state.user.me);
    const users = useSelector((state: RootState) => state.friends.list);
    const pins = useSelector((state: RootState) => state.friends.pins);
    const pointsForPinned = useSelector((state: RootState) => state.settings.pointsForPinned);

    const { darkModeStatus } = useDarkMode();

    const [success, setSuccess] = useState<number[]>([]);
    const [update, setUpdate] = useState(false);

    const dispatch = useDispatch();

    const setModal = (status: boolean) => {
        dispatch(setModalFriendsStatus(status));
    }

    const pinFriendHandler = (id: string) => {
        const isPined = pins.includes(id);
        if (!isPined)
            dispatch(addFriendToPinList(id))
        else {
            dispatch(removeFriendFromPinList(id))
        }
    }

    const removeFriendHandler = async (id: number) => {
        setUpdate(true);
        await fetch("/api/friends", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                user_id: me.id,
                friend_id: id | 0
            }),
        }).then(async (response) => {
            setUpdate(false);
            if (!response.ok) {
                console.log(`Failed to create settings: ${response.statusText}`);
            } else {
                setSuccess((i: number[]) => [...i, id]);
                dispatch(removeFriendFromList(id))
                if (users.length == 1)
                    setModal(false);
            }
            return { success: true };
        })
    };

    if (!me)
        return;

    return (
        <OffCanvas
            setOpen={(status: boolean) => { setModal(status) }}
            isOpen={friendsIsOpen}
            titleId="canvas-title"
        >
            <OffCanvasHeader
                setOpen={(status: boolean) => { setModal(status) }}
                className="p-4"
            >
                <OffCanvasTitle id="canvas-title" className="h2">
                                        <Icon
                                            style={{ marginRight: 10 }}
                                            icon={'Group'}
                                            color={darkModeStatus ? 'light' : 'dark'}
                                        />
                    Friends
                </OffCanvasTitle>
            </OffCanvasHeader>
            <OffCanvasBody tag="form" className="p-4" >
                {/* <Button
                    style={{ marginBottom: 30, textAlign: 'left' }}
                    icon="Star"
                    color={me.correction_point >= pointsForPinned ? "warning" : "light"}
                    isDisable
                >
                    You can add friends to your favorites if you have {pointsForPinned} or more correction points. 
                    Right now, you have {me.correction_point} correction points. 
                    (Points reset every Sunday)
                </Button> */}
                {
                    pinSort(alphabeticSort(users, "friend_login"), pins).map((user, key) => {
                        const isIdInSuccess = success && success.includes(user.id);
                        const isPined = pins.includes(user.friend_id);
                        return (
                            <Card borderSize={1} isCompact key={user.id} >
                                <CardHeader style={{ borderRadius: 15 }} >
                                    <CardLabel>
                                        <CardTitle style={{ marginBottom: 10 }}>
                                        {user.friend_name}
                                        </CardTitle>
                                        <Badge
                                            style={{ marginRight: 10 }}
                                            isLight={darkModeStatus ? false : true}
                                            color='success'
                                        >
                                            {user.friend_login}
                                        </Badge>
                                        <Badge
                                            style={{ marginRight: 10 }}
                                            isLight={darkModeStatus ? false : true}
                                            color='success'
                                        >
                                            {user?.pool_month} {user?.pool_year}
                                        </Badge>
                                    </CardLabel>

                                    {user?.friend_image && <Avatar className="avatar-abs" src={user?.friend_image} size={64} />}
                                </CardHeader>

                                <CardBody>
                                    <Button
                                        style={{ margin: '0 15px 20px 0' }}
                                        className='h4'
                                        icon={update ? "Refresh" : isIdInSuccess ? "Done" : "Close"}
                                        color={isIdInSuccess ? "success" : "light"}
                                        isDisable={update}
                                        onClick={() => removeFriendHandler(user.friend_id)}
                                    />
                                    <Button
                                        icon="Link"
                                        style={{ margin: '0 15px 20px 0' }}
                                        color="success"
                                        onClick={() => window.open(`https://profile.intra.42.fr/users/${user.friend_id | 0}`, '_blank')}
                                    ></Button>
                                    <Button
                                        icon="Link"
                                        style={{ margin: '0 15px 20px 0', backgroundColor: '#dab2ff', color: 'white' }}
                                        onClick={() => {
                                            window.open(`https://portal.pfischof.com/?login=${user.friend_login}`, '_blank');
                                        }}
                                    >ft_portal</Button>
                                </CardBody>
                        
                                {/* <Button
                                    style={{ position: 'absolute', top: 5, right: 5 }}
                                    className='h4'
                                    icon="Star"
                                    color={isPined ? "warning" : "light"}
                                    isDisable={me.correction_point < pointsForPinned}
                                    onClick={() => pinFriendHandler(user.friend_id)}
                                /> */}
                                
                            </Card>
                        )
                    })
                }
            </OffCanvasBody>
        </OffCanvas>
    )
};

export default Friends;
