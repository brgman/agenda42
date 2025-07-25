import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import { getCalcGiveup } from '../../common/function/getCalcGiveup';
import { getCorrectorImageUrl, getCorrectorName } from '../../common/function/getCorrectorImageUrl';
import { fetchUserWithRetry } from '../../common/function/getScaleTeams';
import Avatar from '../Avatar';
import Button from '../bootstrap/Button';
import Card, { CardHeader, CardLabel, CardTitle, CardBody } from '../bootstrap/Card';
import Progress from '../bootstrap/Progress';
import Spinner from '../bootstrap/Spinner';
import { CorrectorLocation } from './CorrectorLocation';
import Icon from '../icon/Icon';

interface Profile {
    id: number;
    login: string;
    usual_full_name?: string;
    image?: {
        versions: {
            small?: string;
        };
    };
    location?: string;
}

interface ScaleTeam {
    corrector: Profile | string;
    correcteds: Profile[];
    begin_at: string;
    updated_at: string;
    comment?: string;
    feedback?: string;
    final_mark?: number;
    flag: { name: string };
    team: { project_id: number };
}

interface EventItem {
    name: string;
    scale_team: ScaleTeam;
}

interface Me {
    id: number;
    image?: {
        versions: {
            small?: string;
        };
    };
}

interface DefenseProps {
    eventItem: EventItem;
    me: Me;
    token: string;
}

const Defense = ({ eventItem, me, token }: DefenseProps) => {
    const [userData, setUserData] = useState<Profile | null>(null);
    const [correctedsData, setCorrectedsData] = useState<Profile[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                // Fetch corrector data
                let correctorData: Profile | null = null;
                if (eventItem?.scale_team?.corrector !== 'invisible') {
                    correctorData = await fetchUserWithRetry(eventItem?.scale_team?.corrector.id, 3, token, false);
                    setUserData(correctorData);
                }

                const correctedsPromises = eventItem?.scale_team?.correcteds?.map((profile: Profile) =>
                    fetchUserWithRetry(profile.id, 3, token, false)
                ) || [];
                const correctedsResults = await Promise.all(correctedsPromises);
                setCorrectedsData(correctedsResults.filter((data): data is Profile => data !== null));
            } catch (err) {
                setError('Failed to fetch data');
            } finally {
                setLoading(false);
            }
        };

        if (eventItem?.scale_team?.corrector) {
            fetchData();
        } else {
            setLoading(false);
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
            <h2>You are evaluated {eventItem.name.substring(2)}</h2>
            <br />
            {eventItem?.scale_team.corrector !== 'invisible' ? (
                <div className="col-12">
                    <Card className="mb-0 bg-l10-success" shadow="sm">
                        {userData && (
                            <CardHeader className="bg-l25-success column_rest">
                                <CardLabel iconColor="dark">
                                    <CardTitle>{userData.usual_full_name || '^^'}</CardTitle>
                                    <p style={{ marginTop: 5 }}>
                                        {dayjs(eventItem?.scale_team.updated_at).format('dddd, D MMMM H:mm')}
                                    </p>
                                    <div className="df">
                                        <Button
                                            icon="Link"
                                            style={{ marginRight: 15 }}
                                            color="success"
                                            onClick={() => window.open(`https://profile.intra.42.fr/users/${userData.id}`, '_blank')}
                                        >
                                            Intra
                                        </Button>
                                        <CorrectorLocation token={null} user={userData} id={userData.id} />
                                    </div>
                                </CardLabel>
                                <Avatar
                                    src={userData.image?.versions.small || 'default-avatar.png'}
                                    size={64}
                                    className="cursor-pointer"
                                    borderColor="success"
                                />
                            </CardHeader>
                        )}
                        {eventItem?.scale_team?.feedback ? (
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
                        ) : null}
                    </Card>
                </div>
            ) : null}
            <br />
            <div className="col-12">
                {eventItem?.scale_team.corrector === 'invisible' ? (
                    <h3>Refresh page at {dayjs(eventItem?.scale_team.begin_at).add(-15, 'minute').format('H:mm')}</h3>
                ) : eventItem?.scale_team?.feedback ? (
                    <Card className="mb-0 bg-l10-info" shadow="sm" style={{ textAlign: 'end' }}>
                        {correctedsData.length > 0 &&
                            eventItem?.scale_team?.correcteds.map((profile: Profile, i: number) => {
                                const user = correctedsData.find((u) => u.id === profile.id);
                                return (
                                    <CardHeader key={profile.id} className="bg-l25-info column_rest">
                                        <Avatar
                                            src={
                                                profile.id === me.id
                                                    ? getCorrectorImageUrl(profile.id, correctedsData, me) || 'default-avatar.png'
                                                    : user?.image?.versions.small || 'https://cdn.intra.42.fr/users/430b2acd1bcfedf5475654d235003086/norminet.jpeg'
                                            }
                                            size={64}
                                            className="cursor-pointer"
                                            borderColor="info"
                                        />
                                        <CardLabel iconColor="dark">
                                            <CardTitle>
                                                {i == 0 ? <Icon style={{ marginRight: 15 }} size="lg" color="dark" icon="Star" /> : null}
                                                {getCorrectorName(profile.id, correctedsData, {}) || profile.login}</CardTitle>
                                            <p style={{ marginTop: 5 }}>
                                                {dayjs(eventItem?.scale_team.begin_at).format('dddd, D MMMM H:mm')}
                                            </p>
                                            <div className="df">
                                                {
                                                    i == 0
                                                        ? <Button
                                                            color="info"
                                                            icon="Link"
                                                            style={{ marginRight: 15 }}
                                                            onClick={() =>
                                                                window.open(
                                                                    `https://projects.intra.42.fr/${eventItem.scale_team.team.project_id}/mine`,
                                                                    '_blank'
                                                                )
                                                            }
                                                        >
                                                            Project
                                                        </Button>
                                                        : <Button
                                                            icon="Link"
                                                            style={{ marginRight: 15 }}
                                                            color="success"
                                                            onClick={() => window.open(`https://profile.intra.42.fr/users/${user.id}`, '_blank')}
                                                        >
                                                            Intra
                                                        </Button>
                                                }
                                                
                                                <CorrectorLocation token={null} user={user} id={user.id} />
                                            </div>
                                        </CardLabel>
                                    </CardHeader>
                                );
                            })}
                        {eventItem?.scale_team?.feedback ? (
                            <CardBody>
                                <p>{eventItem?.scale_team?.feedback}</p>
                            </CardBody>
                        ) : (
                            <p>Wait feedback</p>
                        )}
                    </Card>
                ) : (
                    'You will be evaluated'
                )}
            </div>
            <br />
        </div>
    );
};

export default Defense;