import classNames from "classnames";
import useDarkMode from "../../hooks/useDarkMode";
import Avatar, { AvatarGroup } from "../Avatar";
import Icon from "../icon/Icon";
import dayjs from "dayjs";
import { IEvents } from "../../common/data/events";
import { TColor } from "../../type/color-type";
import Tooltips from "../bootstrap/Tooltips";

export interface IEvent extends IEvents {
    user?: IUserProps;
    users?: IUserProps[];
    color?: TColor;
}

export const MyWeekEvent = (data: { event: IEvent }) => {
    const { darkModeStatus } = useDarkMode();

    const { event } = data;
    return (
        <div className="row g-2">
            <div className="col-12 h6" style={{ fontSize: '0.8rem' }}>
                {event?.icon && <Icon icon={event?.icon} size="lg" className="me-2" />}
                {event?.name}
            </div>
            {event?.user && (
                <div className="col-12">
                    <div className="row g-1 align-items-baseline">
                        <div className="col-auto">
                            {/* eslint-disable-next-line react/jsx-props-no-spreading */}
                            <Avatar {...event?.user} size={18} />
                        </div>
                        <small
                            className={classNames("col-auto text-truncate", {
                                "text-dark": !darkModeStatus,
                                "text-white": darkModeStatus,
                            })}
                        >
                            {event?.user?.name}
                        </small>
                    </div>
                </div>
            )}
            {event?.users && (
                <div className="col-12">
                    <AvatarGroup size={18}>
                        {event.users.map((user) => (
                            // eslint-disable-next-line react/jsx-props-no-spreading
                            <Avatar key={user.src} {...user} />
                        ))}
                    </AvatarGroup>
                </div>
            )}
        </div>
    );
};

export const MyEvent = (data: { event: IEvent }) => {
    const { darkModeStatus } = useDarkMode();

    const { event } = data;
    return (
        <div className="row g-2">
            <div className="col text-truncate">
                {event?.icon && <Icon icon={event?.icon} size="lg" className="me-2" />}
                {event?.name}
            </div>
            {event?.user?.src && (
                <div className="col-auto">
                    <div className="row g-1 align-items-baseline">
                        <div className="col-auto">
                            <Avatar src={event?.user?.src} size={18} />
                        </div>
                        <small
                            className={classNames("col-auto text-truncate", {
                                "text-dark": !darkModeStatus,
                                "text-white": darkModeStatus,
                            })}
                        >
                            {event?.user?.name}
                        </small>
                    </div>
                </div>
            )}
            {event?.users && (
                <div className="col-auto">
                    <AvatarGroup size={18}>
                        {event.users.map((user) => (
                            // eslint-disable-next-line react/jsx-props-no-spreading
                            <Avatar key={user.src} {...user} />
                        ))}
                    </AvatarGroup>
                </div>
            )}
        </div>
    );
};


export const MyEventDay = (data: { event: IEvent }) => {
    const { event } = data;
    return (
        <Tooltips
            title={`${event?.name} / ${dayjs(event.start).format("H:mm")} - ${dayjs(
                event.end,
            ).format("H:mm")}`}
        >
            <div className="row g-2">
                {event?.user?.src && (
                    <div className="col-auto">
                        <Avatar src={event?.user?.src} size={16} />
                    </div>
                )}
                {event?.users && (
                    <div className="col">
                        <AvatarGroup size={16}>
                            {event.users.map((user) => (
                                // eslint-disable-next-line react/jsx-props-no-spreading
                                <Avatar key={user.src} {...user} />
                            ))}
                        </AvatarGroup>
                    </div>
                )}
                <small className="col text-truncate">
                    {event?.icon && (
                        <Icon icon={event?.icon} size="lg" className="me-2" />
                    )}
                    {event?.name}
                </small>
            </div>
        </Tooltips>
    );
};



export const AgendaEvent = (data: { event: IEvent }) => {
    const { event } = data;
    console.log("AgendaEvent", event);
    return (
        <div className="row g-2">
            {event?.user?.src && (
                <div className="col-auto">
                    <Avatar src={event?.user?.src} size={16} />
                </div>
            )}
            {event?.users && (
                <div className="col">
                    <AvatarGroup size={16}>
                        {event.users.map((user) => (
                            // eslint-disable-next-line react/jsx-props-no-spreading
                            <Avatar key={user.src} {...user} />
                        ))}
                    </AvatarGroup>
                </div>
            )}
            <small className="col text-truncate">
               {event?.icon && (
                    <Icon icon={event?.icon} size="lg" className="me-2" />
                )}
                {event?.name}
            </small>
        </div>
    );
};
