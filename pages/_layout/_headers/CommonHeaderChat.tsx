import React, { useEffect, useState } from 'react';
import OffCanvas, { OffCanvasBody, OffCanvasHeader } from '../../../components/bootstrap/OffCanvas';
import InputGroup from '../../../components/bootstrap/forms/InputGroup';
import Textarea from '../../../components/bootstrap/forms/Textarea';
import Button from '../../../components/bootstrap/Button';
import Avatar from '../../../components/Avatar';
import showNotification from '../../../components/extras/showNotification';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import Link from 'next/link';

const CommonHeaderChat = () => {
    const [state, setState] = useState<boolean>(false);
    const [msgCount, setMsgCount] = useState<number>(0);
    const user = useSelector((state: RootState) => state.user.me);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setMsgCount(1);
            // showNotification(
            // 	<span className='d-flex align-items-center'>
            // 		<Avatar
            // 			src={USERS.CHLOE.src}
            // 			size={36}
            // 			color={USERS.CHLOE.color}
            // 			className='me-3'
            // 		/>
            // 		<span>{USERS.CHLOE.name} sent a message.</span>
            // 	</span>,
            // 	<div onClick={() => setState(!state)} role='presentation'>
            // 		<p>I think it's really starting to shine.</p>
            // 	</div>,
            // );
        }, 30000);
        return () => {
            clearTimeout(timeout);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        setMsgCount(0);
    }, [state]);

    if (!user)
        return ("");

    return (
        <>
            <div
                className='col d-flex align-items-center cursor-pointer justify-content-end'
                // onClick={() => setState(!state)}
                role='presentation'>
                <div className='me-3'>
                    <div className='text-end'>
                        <div className='fw-bold fs-6 mb-0'>
                            {`${user?.displayname} ( ${user?.location ? user?.location : 'unavailable'} )`}
                        </div>
                        <div className='text-muted'>
                            <small>I have&nbsp; 
                                <span className="fw-bold">{user?.correction_point}</span>
                                &nbsp;evaluation points
                            </small>
                        </div>
                    </div>
                </div>
                <div className='position-relative'>
                    <Link href={`https://profile.intra.42.fr/users/${user?.login}`}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <Avatar src={user?.image.versions.small} size={48} />
                    </Link>
                    {/* {!!msgCount && (
						<span className='position-absolute top-15 start-85 translate-middle badge rounded-pill bg-danger'>
							{msgCount} <span className='visually-hidden'>unread messages</span>
						</span>
					)} */}
                    {/* <span className='position-absolute top-85 start-85 translate-middle badge border border-2 border-light rounded-circle bg-success p-2'>
						<span className='visually-hidden'>Online user</span>
					</span> */}
                </div>
            </div>
            <OffCanvas
                id='chat'
                isOpen={state}
                setOpen={setState}
                placement='end'
                isModalStyle
                isBackdrop={false}
                isBodyScroll>
                <div className='chat-send-message p-3'>
                    <InputGroup>
                        <Textarea />
                        <Button color='info' icon='Send'>
                            SEND
                        </Button>
                    </InputGroup>
                </div>
            </OffCanvas>
        </>
    );
};

export default CommonHeaderChat;
