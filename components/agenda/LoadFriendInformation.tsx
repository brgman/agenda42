import { useEffect, useState } from "react";
import Button from "../bootstrap/Button";
import { useDispatch } from "react-redux";
import { updateUser } from "../../store/slices/slotsSlice";
import { fetchUserWithRetry } from "../../common/function/getScaleTeams";
import { CardBody } from "../bootstrap/Card";
import { useFriendsData } from "../../hooks/useFriendsData";

export const LoadFriendInformation = ({ setLoad, isPined, token = null, id }: { setLoad: any, isPined: boolean; token: any; id: number }) => {
    const [isFetched, setIsFetched] = useState(false);
    const friendsData = useFriendsData({ id, token, setLoad });

    useEffect(() => {
        if (isFetched) return;
        setIsFetched(true);
        friendsData();
    }, [isFetched]);

    return (
         <CardBody>
            <Button
                icon="Link"
                style={{ marginRight: 15 }}
                color="success"
                onClick={() => window.open(`https://profile.intra.42.fr/users/${id}`, '_blank')}
            >
                Intra
            </Button>
         </CardBody>
    );
};