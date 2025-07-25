import { FC, useState } from "react";
import OffCanvas, { OffCanvasHeader, OffCanvasTitle, OffCanvasBody } from "../bootstrap/OffCanvas";
import { RootState } from "../../store";
import { useDispatch, useSelector } from "react-redux";
import { setModalWavingHandStatus } from "../../store/slices/settingsReducer";
import { getName } from "../../helpers/helpers";
import Card, { CardHeader, CardLabel, CardTitle } from "../bootstrap/Card";
import Button from "../bootstrap/Button";
import Spinner from "../bootstrap/Spinner";
import Badge from "../bootstrap/Badge";
import useDarkMode from "../../hooks/useDarkMode";
import Icon from "../icon/Icon";
import { changeStatusHandler } from "../../common/function/getUserSettings";

const WavingHand: FC<any> = ({ token }: any) => {
    const friends = useSelector((state: RootState) => state.friends.list);
    const wavingList = useSelector((state: RootState) => state.friends.wavingList);
    const wavingHandIsOpen = useSelector((state: RootState) => state.settings.wavingHandIsOpen);

    const me = useSelector((state: RootState) => state.user.me);
    const { darkModeStatus } = useDarkMode();
    const [successWavingHand, setSuccessWavingHand] = useState<number[]>([]);

    const dispatch = useDispatch();

    const setModal = (status: boolean) => {
        dispatch(setModalWavingHandStatus(status));
    }

    const [update, setUpdate] = useState(false);

    const addWavingHandHandler = async (destinator_id: number, event_title: string, status: string, author_image_url: string, author_name: string, author_login: string, id: number) => {
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
                author_login
            }),
        }).then(async (response) => {
            setUpdate(false);
            if (!response.ok) {
                console.log(`Failed to create settings: ${response.statusText}`);
            } else {
                setSuccessWavingHand((i: number[]) => [...i, id]);
            }
            return { success: true };
        })
    };

    if (!me || !wavingList)
        return;

    return (
        <OffCanvas
            setOpen={(status: boolean) => { setModal(status) }}
            isOpen={wavingHandIsOpen}
            titleId="canvas-title"
        >
            <OffCanvasHeader
                setOpen={(status: boolean) => { setModal(status) }}
                className="p-4"
            >
                <OffCanvasTitle id="canvas-title" className="h2">
                    <span style={{ marginRight: 10 }}>Waving Hands 👋 </span>
                </OffCanvasTitle>
            </OffCanvasHeader>
            <OffCanvasBody tag="form" className="p-4" >
                {
                    (!wavingList.length)
                        ? <Spinner random />
                        : <>
                            {
                                [...wavingList].sort((a: any, b: any) => b.id - a.id).map((waving, key) => {
                                    changeStatusHandler(waving.id);
                                    const isIdInSuccessWavingHand = successWavingHand.includes(waving.id);
                                    const isFriend = friends?.find(i => i.friend_id == waving.author_id);
                                    return (
                                        <Card isCompact 
                                            borderSize={2}
                                            borderColor={isFriend ? "success" : null}
                                            key={key} >
                                            <CardHeader style={{ borderRadius: 20 }} >

                                                <CardLabel>

                                                    <CardTitle>Hey, it's {waving.author_name},</CardTitle>
                                                </CardLabel>

                                                <Icon
                                                    style={{
                                                        position: 'absolute',
                                                        top: '20px',
                                                        right: '20px',
                                                        opacity: .1,
                                                    }}
                                                    icon="WavingHand"
                                                    color={darkModeStatus ? 'light' : 'dark'}
                                                    size="6x"
                                                />
                                                {waving.status != "read" ? <Badge color={'dark'} > not read </Badge> : null}
                                                {/* <Avatar src={waving.author_image_url} size={32} /> */}

                                            </CardHeader>
                                            <div className='card-aside d-flex row align-items-end event_row m-3 mt-0'>
                                                <p className="h6" style={{ marginTop: 10, marginBottom: 10, paddingRight: 30 }}>
                                                    I'm waving at you because I saw you at the
                                                    <span style={{ margin: 3 }}>{waving.event_title}</span>
                                                    event!
                                                </p>
                                                <div className='col-lg-6 p-1'>
                                                    <Button
                                                        className='h4'
                                                        icon={update ? "Refresh" : "WavingHand"}
                                                        color={isIdInSuccessWavingHand ? "success" : "secondary"}
                                                        onClick={() => addWavingHandHandler(waving.author_id, waving.event_title, "send", me.image.versions.medium, getName(me), me.login, waving.id)}
                                                    >Waving back
                                                    </Button>
                                                </div>
                                                <div className='col-lg-6'>
                                                    <div className='h4 text-end'>
                                                        <Badge
                                                            isLight={darkModeStatus ? false : true}
                                                            color={'secondary'}
                                                        >
                                                            {waving.author_login}
                                                        </Badge>
                                                    </div>
                                                </div>
                                            </div>
                                        </Card>
                                    )
                                })
                            }
                        </>
                }
            </OffCanvasBody>
        </OffCanvas>
    )
};

export default WavingHand;