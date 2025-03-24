import dayjs from "dayjs";
import { getCalcGiveup } from "../../common/function/getCalcGiveup";
import Avatar from "../Avatar";
import Button from "../bootstrap/Button";
import Card, { CardHeader, CardLabel, CardTitle, CardBody } from "../bootstrap/Card";
import Progress from "../bootstrap/Progress";
import { getCorrectorImageUrl, getCorrectorName } from "../../common/function/getCorrectorImageUrl";
import { CorrectorLocation } from "./CorrectorLocation";
import { useState, useEffect } from "react";
import { fetchUserWithRetry } from "../../common/function/getScaleTeams";

const Defanse = ({ eventItem, scaleUsers, me, token }: any) => {
    const [userData, setUserData] = useState<any>(null);

    useEffect(() => {
        const fetchData = async () => {
            const data = await fetchUserWithRetry(eventItem?.scale_team?.corrector.id, 3, token, false);
            setUserData(data);
        };
        fetchData();
    }, [eventItem, token]);

    const getLinkForFriends42 = (i: any) => {
        const claster = i.location.split("-")[0];
        const etage = i.location.split("-")[1].slice(0, 2);
        return `https://friends.42paris.fr/?cluster=${claster}-${etage}&p=${i.location}`;
    };
    console.log(">", eventItem);
    return (
        <div>
            <h2>Evaluation {eventItem.name}</h2>
            <br />
            {eventItem?.scale_team.corrector !== 'invisible' ? <div className="col-12">
                <Card className="mb-0 bg-l10-success" shadow="sm">

                    {
                        userData && <CardHeader className="bg-l25-success colomn_rest">
                            <CardLabel iconColor="dark">
                                <CardTitle>
                                    {userData.usual_full_name || "^^"}
                                </CardTitle>
                                <p style={{ marginTop: 5 }}>
                                    {dayjs(eventItem?.scale_team.updated_at).format(
                                        "dddd, D MMMM H:mm",
                                    )}
                                </p>
                                <div className="df">
                                    <Button
                                        style={{ marginRight: 15 }}
                                        color="success"
                                        type="submit"
                                        onClick={async () => {
                                            window.open(`https://profile.intra.42.fr/users/${userData.id}`, '_blank')
                                        }
                                        }
                                    >
                                        Intra
                                    </Button>
                                    <CorrectorLocation token={null} user={userData} id={userData.id} />
                                </div>
                            </CardLabel>
                            <Avatar
                                src={userData.image.versions.small}
                                size={64}
                                className="cursor-pointer"
                                borderColor={"success"}
                            />
                        </CardHeader>
                    }

                    {
                        eventItem?.scale_team.comment && eventItem?.scale_team.feedback
                            ?
                            <CardBody>
                                <p style={{ textAlign: 'left' }}>
                                    <b >Evaluation of the project : </b>
                                    <Progress
                                        isStriped
                                        max={100}
                                        min={0}
                                        className="mt-3"
                                        value={eventItem?.scale_team?.final_mark}
                                    />
                                </p>
                                <div style={{ display: "flex", justifyContent: "space-between" }} >
                                    <p className="fw-bold fs-3">{`${eventItem?.scale_team?.flag.name}`} </p>
                                    {
                                        // !getCalcGiveup(eventItem?.scale_team) ? <>
                                        <b className="fw-bold fs-3 mb-0"> {eventItem?.scale_team?.final_mark}%</b>
                                        // </>
                                        // : <p className="fw-bold fs-3 "> Give up</p>
                                    }
                                </div>
                                <br />
                                <p>{eventItem?.scale_team?.comment}</p>
                            </CardBody>
                            : null
                    }
                </Card>
            </div> : null}
            <br />
            <div className="col-12">
                {
                    eventItem?.scale_team.corrector === 'invisible'
                        ? <h3>Refresh page at {dayjs(eventItem?.scale_team.begin_at).add(-15, 'm').format("H:mm")}</h3>
                        : eventItem?.scale_team.comment && eventItem?.scale_team.feedback && userData
                            ? <Card
                                className="mb-0 bg-l10-info"
                                shadow="sm"
                                style={{ textAlign: "end" }}
                            >
                                {userData && eventItem?.scale_team?.correcteds.map((profile, i) => (
                                    <CardHeader className="bg-l25-info colomn_rest">
                                        <Avatar
                                            src={profile.id == me.id ? getCorrectorImageUrl(profile.id, scaleUsers, me) : "https://cdn.intra.42.fr/users/430b2acd1bcfedf5475654d235003086/norminet.jpeg"}
                                            size={64}
                                            className="cursor-pointer"
                                            borderColor={"info"}
                                        />

                                        <CardLabel iconColor="dark">
                                            <CardTitle>
                                                {getCorrectorName(profile.id, scaleUsers, {}) || profile.login}
                                            </CardTitle>
                                            <p style={{ marginTop: 5 }}>
                                                {dayjs(eventItem?.scale_team.begin_at).format(
                                                    "dddd, D MMMM H:mm",
                                                )}
                                            </p>
                                            <Button
                                                color="info"
                                                type="submit"
                                                onClick={async () => {
                                                    window.open(`https://projects.intra.42.fr/${eventItem.scale_team.team.project_id}/mine`, '_blank')
                                                }
                                                }
                                            >
                                                Open project in intra
                                            </Button>
                                        </CardLabel>
                                    </CardHeader>
                                ))
                                }
                                <div>
                                </div>

                                {
                                    (eventItem?.scale_team.comment && eventItem?.scale_team.feedback)
                                        ? <CardBody>
                                            <p>{eventItem?.scale_team?.feedback}</p>
                                        </CardBody>
                                        : <p>Wait feedback</p>
                                }
                            </Card>
                            : "You will be evaluated"
                }
            </div>
            <br />


        </div>
    );
};

export default Defanse;