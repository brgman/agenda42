import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import { getCalcGiveup } from '../../common/function/getCalcGiveup';
import { getCorrectorImageUrl, getCorrectorName, getRentre } from '../../common/function/getCorrectorImageUrl';
import { fetchUserWithRetry } from '../../common/function/getScaleTeams';
import Avatar from '../Avatar';
import Button from '../bootstrap/Button';
import Card, { CardHeader, CardLabel, CardTitle, CardBody } from '../bootstrap/Card';
import Progress from '../bootstrap/Progress';
import Badge from '../bootstrap/Badge';
import { CorrectorLocation } from './CorrectorLocation';
import { CorrectorLanguages, CorrectorGrades } from './CorrectorLanguages';
import Spinner from '../bootstrap/Spinner';
import Icon from '../icon/Icon';

// Define TypeScript interfaces (optional, if using TypeScript)
interface Profile {
    id: number;
    login: string;
}

interface ScaleTeam {
    corrector: Profile;
    correcteds: Profile[];
    begin_at: string;
    updated_at: string;
    comment?: string;
    feedback?: string;
    final_mark?: number;
    flag: { name: string };
}

interface EventItem {
    scale_team: ScaleTeam;
}

interface EvaluationProps {
    eventItem: EventItem;
    me: any; // Replace with proper type
    token: string;
}

const Evaluation = ({ eventItem, me, token }: EvaluationProps) => {
    const [userData, setUserData] = useState<any>(null); // Replace `any` with proper type
    const [correctedsData, setCorrectedsData] = useState<any[]>([]); // Replace `any` with proper type
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                // Fetch reviewer data
                const reviewerData = await fetchUserWithRetry(eventItem?.scale_team?.corrector?.id, 3, token, false);
                setUserData(reviewerData);

                // Fetch correcteds data
                const correctedsPromises = eventItem?.scale_team?.correcteds?.map((profile: Profile) =>
                    fetchUserWithRetry(profile.id, 3, token, false)
                ) || [];
                const correctedsResults = await Promise.all(correctedsPromises);
                setCorrectedsData(correctedsResults);
            } catch (err) {
                setError('Failed to fetch data');
            } finally {
                setLoading(false);
            }
        };

        if (eventItem?.scale_team?.corrector?.id) {
            fetchData();
        }
    }, [eventItem, token]);

    if (loading) {
        return (
            <div className="d-flex justify-content-center mt-5">
                <Spinner color="primary" random />
            </div>
        );
    }

    if (error) {
        return <Card>Error: {error}</Card>;
    }

    return (
        <div>
            <h2>You are reviewing</h2>
            <br />
            <div className="col-12">
                {eventItem?.scale_team?.feedback ? (
                    <Card className="mb-0 bg-l10-info" shadow="sm" style={{ textAlign: 'end' }}>
                        <CardHeader className="bg-l25-info column_rest">
                            <Avatar
                                src={getCorrectorImageUrl(eventItem?.scale_team?.corrector.id, [userData], me)}
                                size={64}
                                className="cursor-pointer"
                                borderColor="info"
                            />
                            <CardLabel iconColor="dark">
                                <CardTitle>
                                    {getCorrectorName(eventItem?.scale_team?.corrector.id, [userData], me) ||
                                        eventItem?.scale_team?.corrector.login}
                                </CardTitle>
                                <p style={{ marginTop: 5 }}>
                                    {dayjs(eventItem?.scale_team.begin_at).format('dddd, D MMMM H:mm')}
                                </p>
                            </CardLabel>
                        </CardHeader>
                        <CardBody>
                            <p style={{ textAlign: 'left' }}>
                                <b>Evaluation of the project:</b>
                                <Progress
                                    isStriped
                                    max={100}
                                    min={0}
                                    className="mt-3"
                                    value={eventItem?.scale_team?.final_mark || 0}
                                />
                            </p>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <p className="fw-bold fs-3">{eventItem?.scale_team?.flag.name}</p>
                                {!getCalcGiveup(eventItem?.scale_team) ? (
                                    <b className="fw-bold fs-3 mb-0">{eventItem?.scale_team?.final_mark}%</b>
                                ) : (
                                    <p className="fw-bold fs-3">Give up</p>
                                )}
                            </div>
                            <br />
                            <p>{eventItem?.scale_team?.comment}</p>
                        </CardBody>
                    </Card>
                ) : (
                    <h4>You will evaluate</h4>
                )}
            </div>
            <br />
            <div className="col-12">
                <Card className="mb-0 bg-l10-success" shadow="sm">
                    {eventItem?.scale_team?.correcteds.map((profile: Profile, i: number) => (
                        <CardHeader key={profile.id} className="bg-l25-success column_rest">
                            <CardLabel iconColor="dark">
                                <CardTitle>
                                    <CorrectorLanguages id={profile.id} users={correctedsData} />
                                    {getCorrectorName(profile.id, correctedsData, me) || profile.login}
                                </CardTitle>
                                <p>
                                    <Badge style={{ marginRight: 10 }} color="success">
                                        {getRentre(profile.id, correctedsData)}
                                    </Badge>
                                    <CorrectorGrades id={profile.id} users={correctedsData} />
                                </p>
                                <p style={{ marginTop: 5 }}>
                                    {i === 0 ? dayjs(eventItem?.scale_team.updated_at).format('dddd, D MMMM H:mm') : null}
                                </p>
                                <div className="df">
                                    <Button
                                        style={{ marginRight: 15 }}
                                        color="success"
                                        onClick={() => window.open(`https://profile.intra.42.fr/users/${profile.id}`, '_blank')}
                                    >
                                        Intra
                                    </Button>
                                    <CorrectorLocation user={correctedsData[0]} />
                                </div>
                            </CardLabel>
                            <Avatar
                                src={getCorrectorImageUrl(profile.id, correctedsData, me)}
                                size={64}
                                className="cursor-pointer"
                                borderColor="success"
                            />
                        </CardHeader>
                    ))}
                    {eventItem?.scale_team?.feedback ? (
                        <CardBody>
                            <p>{eventItem?.scale_team?.feedback}</p>
                        </CardBody>
                    ) : (
                        <h3 className="mt-3" style={{ textAlign: 'center' }}>Waiting feedback...</h3>
                    )}
                </Card>
            </div>
        </div>
    );
};

export default Evaluation;