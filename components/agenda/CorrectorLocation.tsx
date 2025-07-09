import { useEffect, useState } from "react";
import { fetchUserWithRetry } from "../../common/function/getScaleTeams";
import Button from "../bootstrap/Button";
import { useDispatch } from "react-redux";
import { updateUser } from "../../store/slices/slotsSlice";

export const CorrectorLocation = ({ id, token = null, user = null }: { id: any; token: any; user: any }) => {
    const [userData, setUserData] = useState<any>(null);
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchData = async () => {
            const data = await fetchUserWithRetry(id, 3, token, false);
            console.log("fetchData", data)
            setUserData(data);
            dispatch(updateUser({ id: data.id, cursus_users: data?.cursus_users, languages: data?.languages_users }));
        };
        if (!user)
            fetchData();
        else
            setUserData(user);
    }, [id, token]);

    // https://friends.42paris.fr/?cluster=f1&p=f1r12s2
    const getLinkForFriends42 = (i: any) => {
        const claster = i.location.split("r")[0];
        return `https://friends.42paris.fr/?cluster=${claster}&p=${i.location}`;
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
                        isDisable
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