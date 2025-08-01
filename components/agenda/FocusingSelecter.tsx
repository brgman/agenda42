import Button from "../bootstrap/Button";

import { useEffect, useState } from "react";
import { useRefreshFriends } from "../../hooks/useRefreshFriends";
import { CardActions } from "../bootstrap/Card";
import Dropdown, { DropdownItem, DropdownMenu, DropdownToggle } from "../bootstrap/Dropdown";
import Avatar from "../Avatar";
import { alphabeticSort, getName } from "../../helpers/helpers";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { getRandomProtection } from "../../common/function/getRndomWithHash";

const FocusingSelector = ({ token, setLoad, friends, me }: any) => {
    const [isFirstLoading, setIsFirstLoading] = useState(true);
    const [selected, setSelected] = useState(me.id);
    const [list, setList] = useState<any[]>();
    const refreshFriends = useRefreshFriends(selected, token, setLoad);
    // const pins = useSelector((state: RootState) => state.friends.pins);
    // const pointsForPinned = useSelector((state: RootState) => state.settings.pointsForPinned);

    useEffect(() => {
        if (!(selected == me.id && isFirstLoading) && friends)
        {
            refreshFriends();
            setIsFirstLoading(false);
        }
    }, [refreshFriends, selected, isFirstLoading]);

    // useEffect(() => {
    //     if (pins.length && pointsForPinned <= me.correction_point) {
    //         setList([
    //             ...alphabeticSort(friends, "friend_login")
    //                 // .filter(index => pins.includes(index.friend_id))
    //                 .map(i => ({
    //                     ...i,
    //                     friend_id: i.friend_id | 0
    //                 }))
    //         ])
    //     }
    //     else {
    //         if (friends.length < 15)
    //             setList([]);
    //         else
    //             setList([
    //                 ...alphabeticSort(getRandomProtection(friends), "friend_login").map(i => ({
    //                     ...i,
    //                     friend_id: i.friend_id | 0
    //                 }))
    //             ])
    //     }
    // }, [pins, friends]);

    useEffect(() => {
        setList([
            ...alphabeticSort(friends, "friend_login").map(i => ({
                ...i,
                friend_id: i.friend_id | 0
            }))
        ])
    }, [friends]);

    if (!friends)
        return;

    return (
        <CardActions>
            <Dropdown direction="down">
                <DropdownToggle>
                    <Button color="primary">
                        {list?.find(i => (i.friend_id == selected))?.friend_name ?? getName(me)}
                    </Button>
                </DropdownToggle>
                <DropdownMenu style={{ height: 'auto',maxHeight: '250px',overflowX: 'hidden' }} >
                    <DropdownItem>
                        <Button
                            color="link"
                            icon="Info"
                            isDisable
                        >
                            {
                                friends.length
                                    ? "Your friends"
                                    : "Your 3 random friends"
                            }
                        </Button>
                    </DropdownItem>
                    {list?.length ? list.map(item => (
                        <DropdownItem>
                            <Button
                                color="link"
                                onClick={() => setSelected(item.friend_id)}
                            >
                                <Avatar src={item.friend_image} size={32} />
                                <span style={{ marginLeft: 15 }}>{item.friend_name} ({item.friend_login})</span>
                            </Button>
                        </DropdownItem>
                    )) :
                        <div style={{ marginLeft: 25, marginBottom: 25, marginRight: 25 }}
                            color="warning"
                        >You need 15 or more friends on the list to select a friend to view the agenda.</div>
                    }
                </DropdownMenu>
            </Dropdown>
        </CardActions>
    );
};

export default FocusingSelector;
