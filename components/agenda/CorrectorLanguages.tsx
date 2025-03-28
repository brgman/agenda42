import { useEffect, useState } from "react";
import { fetchUserWithRetry } from "../../common/function/getScaleTeams";
import Button from "../bootstrap/Button";
import { useDispatch, useSelector } from "react-redux";
import { updateUser } from "../../store/slices/slotsSlice";
import { RootState } from "../../store";

export const CorrectorLanguages = ({ id, token = null, user = null }: { id: any; token: any; user: any }) => {
    const dispatch = useDispatch();
const [userData, setUserData] = useState<any>(null);
    const users = useSelector((state: RootState) => state);

    console.log("users", users);

    useEffect(() => {
        const fetchData = async () => {
            const data = await fetchUserWithRetry(id, 3, token, false);
            console.log(data)
            setUserData(data);
            dispatch(updateUser({ id: data.id, ...data }));
        };
        if (!user)
            fetchData();
        else
            setUserData(user);
    }, [id, token]);

    const getLinkForFriends42 = (i: any) => {
        const claster = i.location.split("-")[0];
        const etage = i.location.split("-")[1].slice(0, claster == 'made' ? 3 : 2);
        return `https://friends.42paris.fr/?cluster=${claster}-${etage}&p=${i.location}`;
    };

    const btnStyle = {
        transition: 'filter 0.3s ease',
        filter: 'none',
        ':hover': {
            filter: 'drop-shadow(0 5px 1.5rem #e33d94)',
        },
    };

    return (
        <>
            {
                userData?.location ? (
                    <Button
                        style={btnStyle}
                        color="storybook"
                        type="submit"
                        onClick={() => {
                            window.open(getLinkForFriends42(userData), '_blank');
                        }}
                    >
                        Show on Friends42
                    </Button>
                ) : (
                    <Button
                        disabled
                        type="submit"
                        onClick={() => { }}
                    >
                        {userData?.id ? "Unavailable" : "Reload..."}
                    </Button>
                )
            }
        </>
    );
};