import dayjs from "dayjs";
import Button from "../bootstrap/Button";
import Card, { CardBody } from "../bootstrap/Card";
import Markdown from 'react-markdown'
import Badge from "../bootstrap/Badge";
import Icon from "../icon/Icon";
import { isTilePast } from "../../helpers/helpers";
import UsersOfEvent from "./UsersOfEvent";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { TColor } from "../../type/color-type";
import Shapes from "../shapes/Shapes";

const replaceBoldInLink = (link: string) => {
    return link.replace("**_", "").replace("_**", "")
        .replace("_**", "").replace("**_", "")
}

function convertToMdLinks(text: string) {
    const mdLinkPattern = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g; // Détecte les liens Markdown existants
    const urlPattern = /(?<!\])(?:\*\*?_?https?:\/\/[^\s]+)(?=\S*)/; // Détecte les liens bruts sans toucher aux liens MD

    return text.replace(urlPattern, (match: string) => {
        const mdLinkCheck = new RegExp(mdLinkPattern); // Create a new instance for each check
        if (mdLinkCheck.test(text)) return replaceBoldInLink(match); // Si c'est déjà un lien Markdown, on ne touche pas
        const domain = replaceBoldInLink(match.replace(/https?:\/\//, "").split('/')[0]); // Extrait le domaine proprement
        return `[${domain}](${replaceBoldInLink(match)})`;
    });
}

function getStatusColor(subscribedUsers: number, totalUsers: number): TColor | undefined {
    if (totalUsers === 0 || !totalUsers)
        return "dark";
    const percent = (subscribedUsers / totalUsers) * 100;
    if (percent >= 90) return "danger";
    if (percent >= 50) return "brand" as TColor;
    return "success";
}

function hasBDE(eventItem: string) {
    return eventItem.includes("BDE") || eventItem.includes("IPA");
  }

const Event = ({ eventItem }: any) => {
    const events = useSelector((state: RootState) => state.events.events);
    const me = useSelector((state: RootState) => state.user.me);
    const isException = [33210].some(e => eventItem.id === e);
    const isSubscribed = events.some(e => eventItem.id === e.id);
    const unsubscribeHandler = async (event: any) => {
        window.open(`https://profile.intra.42.fr/events/${event.id}`, "_blank");
    };

    return (
        <>
            {eventItem.scale_team != "invisible"
                ? <>
                    <h2>{eventItem.name}</h2>

                    <Card borderColor={"light"} borderSize={2} >
                        {(eventItem.kind == "event" || hasBDE(eventItem.description)) ? <Shapes total={eventItem.nbr_subscribers * 2} /> : null }
                        <CardBody>
                            <div className='row align-items-end event_row'>
                                <div className='col-lg-6'>
                                    <div className='h4 mb-3'>{dayjs(eventItem.start).format('DD MMMM')}</div>
                                    <span className='display-6 fw-bold'>{dayjs(eventItem.start).format('H:mm')}</span>
                                </div>
                                <div className='col-lg-6'>
                                    <div className='h4 mb-3 text-end'>
                                        <Badge color='dark'>
                                            {eventItem.kind}
                                        </Badge>
                                    </div>
                                    <span className='display-6 fw-bold'>{dayjs(eventItem.end).format('H:mm')}</span>
                                </div>
                            </div>
                            {eventItem.location ? <div className='mt-4 align-items-end'>
                                <div className='h4 mb-3'>
                                    <Icon icon="LocationOn" />  {eventItem.location}
                                </div>
                            </div> : null}

                            <div className='row align-items-end event_row'>
                                <div className='col-lg-6'>
                                    <div className='h5'>Subscribers:</div>
                                </div>
                                <div className='col-lg-6'>
                                    <div className='h4 mb-2 mt-4 text-end'>
                                        <Badge color={getStatusColor(eventItem.nbr_subscribers, eventItem.max_people)}>
                                            {eventItem.nbr_subscribers} {eventItem.max_people ? "/" : null} {eventItem.max_people || null}
                                        </Badge>
                                    </div>
                                </div>
                            </div>
                        </CardBody>
                    </Card>

                    {
                        !isException
                            ? <UsersOfEvent id={eventItem.id} size={eventItem.nbr_subscribers} myId={me.id} eventTitle={eventItem.name} />
                            : <Button
                                isDisable
                                color="dark"
                                isLight
                                className="mb-3"
                            >Not availaible for this event
                            </Button>
                    }

                    <div className="col mb-3 d-inline-flex justify-content-between">

                        {
                            (isTilePast(eventItem.start))
                                ?
                                <Button
                                    color="light"
                                    type="submit"
                                    onClick={() => unsubscribeHandler(eventItem)}
                                >View in intra
                                </Button>
                                : (eventItem.max_people != eventItem.nbr_subscribers) ?
                                    <Button
                                        color="storybook"
                                        type="submit"
                                        onClick={() => unsubscribeHandler(eventItem)}
                                    >Open event in Intra
                                    </Button>
                                    : (eventItem.max_people == eventItem.nbr_subscribers) ?
                                        < Button
                                            color="danger"
                                            type="submit"
                                            onClick={() => unsubscribeHandler(eventItem)}
                                        >
                                            Waitlist is available ?
                                        </Button>
                                        :
                                        <Button
                                            color="success"
                                            type="submit"
                                        >
                                            Save to agenda
                                        </Button>
                        }
                    </div >

                    <p className="h5"> <Markdown>{convertToMdLinks(eventItem.description)}</Markdown></p>
                </>
                : <div>You will evaluate someone at {dayjs(eventItem.slots_data[0].begin_at).format('H:mm')}</div>
            }
        </>
    );
};

export default Event;
