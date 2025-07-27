import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import Button from "../bootstrap/Button";
import { addFriendToList } from "../../store/slices/friendsReducer";
import { getName } from "../../helpers/helpers";

const AddFriendButton = ({ 
    isIdInSuccess, update, setUpdate, setSuccess, user
 }: any) => {
    const dispatch = useDispatch();
    const me = useSelector((state: RootState) => state.user.me);
    const friends = useSelector((state: RootState) => state.friends.list);
    const isFriend = friends?.find(i => i.friend_id == user.id);


        const addFriendHandler = async (id: number, login: string, name: string, image: string, month: string, year: string) => {
            setUpdate(true);
            await fetch("/api/friends", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    user_id: me.id,
                    friend_id: id,
                    friend_login: login,
                    friend_name: name,
                    friend_image: image,
                    pool_month: month,
                    pool_year: year,
                }),
            }).then(async (response) => {
                setUpdate(false);
                if (!response.ok) {
                    console.log(`Failed to create settings: ${response.statusText}`);
                } else {
                    setSuccess((i: number[]) => [...i, id]);
                    dispatch(addFriendToList(
                        {
                            user_id: me.id,
                            friend_id: id,
                            friend_login: login,
                            friend_name: name,
                            friend_image: image,
                            pool_month: month,
                            pool_year: year,
                        }
                    ));
                }
                return { success: true };
            })
        };

    return (
        <Button
            style={{ marginRight: 15 }}
            icon={update ? "Refresh" : "Group"}
            color={(isIdInSuccess || isFriend) ? "success" : "light"}
            isDisable={update || isIdInSuccess || isFriend}
            onClick={() => addFriendHandler(user.id, user.login, getName(user), user.image.versions.medium, user.pool_month, user.pool_year)}
        />
    );
};

export default AddFriendButton;
