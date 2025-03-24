import dayjs from "dayjs";
import { getCalcGiveup } from "../../common/function/getCalcGiveup";
import Avatar from "../Avatar";
import Button from "../bootstrap/Button";
import Card, { CardHeader, CardLabel, CardTitle, CardBody } from "../bootstrap/Card";
import Progress from "../bootstrap/Progress";
import { getCorrectorImageUrl, getCorrectorName, getLevel, getRentre } from "../../common/function/getCorrectorImageUrl";
import { CorrectorLocation } from "./CorrectorLocation";
import Badge from "../bootstrap/Badge";

const Evaluation = ({ eventItem, scaleUsers, me, token }: any) => {
    return (
        <div>
            <h2>Evaluation of the project</h2>
            <br />
            <div className="col-12">
                {
                    eventItem?.scale_team.comment && eventItem?.scale_team.feedback
                        ? <Card
                            className="mb-0 bg-l10-info"
                            shadow="sm"
                            style={{ textAlign: "end" }}
                        >
                            <CardHeader className="bg-l25-info colomn_rest">
                                <Avatar
                                    src={getCorrectorImageUrl(eventItem?.scale_team?.corrector.id, scaleUsers, me)}
                                    size={64}
                                    className="cursor-pointer"
                                    borderColor={"info"}
                                />
                                <CardLabel iconColor="dark">
                                    <CardTitle>

                                        {getCorrectorName(eventItem?.scale_team?.corrector.id, scaleUsers, me) || eventItem?.scale_team?.corrector.login}
                                    </CardTitle>
                                    <p style={{ marginTop: 5 }}>
                                        {dayjs(eventItem?.scale_team.begin_at).format(
                                            "dddd, D MMMM H:mm",
                                        )}
                                    </p>
                                </CardLabel>
                            </CardHeader>
                            <div>
                            </div>

                            {
                                (eventItem?.scale_team.comment && eventItem?.scale_team.feedback)
                                    ? <CardBody>
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
                                                !getCalcGiveup(eventItem?.scale_team) ? <>
                                                    <b className="fw-bold fs-3 mb-0"> {eventItem?.scale_team?.final_mark}%</b>
                                                </>
                                                    : <p className="fw-bold fs-3 "> Give up</p>
                                            }
                                        </div>
                                        <br />
                                        <p>{eventItem?.scale_team?.comment}</p>
                                    </CardBody>
                                    : <p>Wait feedback</p>
                            }
                        </Card>
                        : <h4>You will evaluate</h4>
                }
            </div>
            <br />
            <div className="col-12">
                <Card className="mb-0 bg-l10-success" shadow="sm">

                    {
                        eventItem?.scale_team?.correcteds.map((profile, i) => (
                            <CardHeader className="bg-l25-success colomn_rest">
                                <CardLabel iconColor="dark">
                                    <CardTitle>
                                        {getCorrectorName(profile.id, scaleUsers, me) || profile.login}
                                    </CardTitle>
                                    <p>
                                        <Badge style={{ marginRight: 10 }} color='primary'>
                                            {getRentre(profile.id, scaleUsers)}
                                        </Badge>
                                        <Badge color='info'>
                                            {getLevel(profile.id, scaleUsers)}
                                        </Badge>
                                    </p>
                                    <p style={{ marginTop: 5 }}>
                                        {i == 0 ? dayjs(eventItem?.scale_team.updated_at).format(
                                            "dddd, D MMMM H:mm",
                                        ) : null}
                                    </p>
                                    <div className="df">
                                        <Button
                                            style={{ marginRight: 15 }}
                                            color="success"
                                            type="submit"
                                            onClick={async () => {
                                                window.open(`https://profile.intra.42.fr/users/${profile.id}`, '_blank')
                                            }
                                            }
                                        >
                                            Intra
                                        </Button>
                                        <CorrectorLocation id={profile.id} token={token} user={null} />
                                    </div>
                                </CardLabel>
                                <Avatar
                                    src={getCorrectorImageUrl(profile.id, scaleUsers, me)}
                                    size={64}
                                    className="cursor-pointer"
                                    borderColor={"success"}
                                />
                            </CardHeader>
                        ))
                    }
                    {
                        eventItem?.scale_team.comment && eventItem?.scale_team.feedback
                            ?
                            <CardBody>
                                <p>{eventItem?.scale_team?.feedback}</p>
                            </CardBody>
                            : <h3 className="mt-3" style={{ textAlign: 'center'}}>Waiting feedback...</h3>
                    }
                </Card>
            </div>

        </div>
    );
};

export default Evaluation;