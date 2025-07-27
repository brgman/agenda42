import { useEffect, useState } from "react";
import Button from "../bootstrap/Button";
import { useDispatch } from "react-redux";
import { updateUser } from "../../store/slices/slotsSlice";
import { fetchUserWithRetry } from "../../common/function/getScaleTeams";

export const CorrectorLocation = ({ id, token = null, user = null }: { id: any; token: any; user: any }) => {
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
                user?.location ? (
                    <Button
                        style={btnStyle}
                        color="storybook"
                        icon="Link"
                        onClick={() => {
                            window.open(getLinkForFriends42(user), '_blank');
                        }}
                    >Friends42</Button>
                ) : (
                    <Button
                        isDisable
                        onClick={() => { }}
                    >
                            {user?.id ? "Unavailable" : "Reload..."}
                    </Button>
                )
            }
        </>
    );
};