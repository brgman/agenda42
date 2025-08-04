import { useEffect, useState } from "react";
import Button from "../bootstrap/Button";
import { CardBody } from "../bootstrap/Card";
import { useFriendsData } from "../../hooks/useFriendsData";
import Collapse from "../bootstrap/Collapse";
import Spinner from "../bootstrap/Spinner";
import { CorrectorGrades, CorrectorLanguages } from "./CorrectorLanguages";
import Badge from "../bootstrap/Badge";
// import HeatMapBasic from "./HeatMap"

export const LoadFriendInformation = ({ removeFriendHandler, isIdInSuccess, update, me, setLoad, isPined, token = null, id }: { setLoad: any, isPined: boolean; token: any; id: number }) => {
    const [isFetched, setIsFetched] = useState(false);
    const [data, setData] = useState();
    const friendsData = useFriendsData({ id, token, setLoad });
    const [isOpen, setIsOpen] = useState(false);
    const { cursus_id } = me.cursus_users.filter(i => i.end_at == null)[0];

    useEffect(() => {
        if (isFetched || !isOpen) return;
        setIsFetched(true);
        friendsData()
            .then(data => {
                setIsFetched(false);
                setData(data);
            })
    }, [isFetched, isOpen]);

    return (
        <CardBody>
            {data?.coalitions && <img style={{
                position: 'absolute',
                top: 'calc(50% - 100px / 2)',
                left: 'calc(50% - 100px / 2)',
                width: 100,
                height: 100,
                opacity: .1
            }} src={data?.coalitions[data.coalitions.length - 1]?.image_url} />}
            <Button
                style={{ margin: '15px 15px 10px 0' }}
                className='h4'
                icon={update ? "Refresh" : isIdInSuccess ? "Done" : "Close"}
                color={isIdInSuccess ? "success" : "light"}
                isDisable={update}
                onClick={() => removeFriendHandler(id)}
            />
            <Button
                icon="Link"
                style={{ margin: '15px 15px 10px 0' }}
                color="success"
                onClick={() => window.open(`https://profile.intra.42.fr/users/${id | 0}`, '_blank')}
            ></Button>
            <Button
                icon="Link"
                style={{ margin: '15px 15px 10px 0', backgroundColor: '#dab2ff', color: 'white' }}
                onClick={() => {
                    window.open(`https://portal.pfischof.com/?login=${user.friend_login}`, '_blank');
                }}
            >ft_portal</Button>
        </CardBody>
    );
};
