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
    const user = useSelector((state: RootState) => state.user.me);

    if (!user)
        return ("");

    return (
        <>
            <div
                className='col d-flex align-items-center cursor-pointer justify-content-end'
                role='presentation'>
                <div className='me-3'>
                    <div className='text-end'>
                        <div className='fw-bold fs-6 mb-0'>
                            {user?.usual_full_name}
                        </div>
                        <div className='text-muted'>
                            <small>I have&nbsp; 
                                <span className="fw-bold">{user?.correction_point}</span>
                                &nbsp;eval. points
                            </small>
                        </div>
                    </div>
                </div>
                <div className='position-relative'>
                    <Link href={`https://profile.intra.42.fr/users/${user?.login}`}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <Avatar className="avatar-abs" src={user?.image.versions.small} size={48} />
                    </Link>
                </div>
            </div>
        </>
    );
};

export default CommonHeaderChat;
