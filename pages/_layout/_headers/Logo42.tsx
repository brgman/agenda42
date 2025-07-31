import React from 'react';
import useDarkMode from "../../../hooks/useDarkMode";
import Link from 'next/link';
import classNames from 'classnames';

const Logo42 = () => {
    const { darkModeStatus } = useDarkMode();

    return (
        <Link href='/' className='col'
            style={{
                flexDirection: 'row',
                display: 'flex',
                alignItems: 'center',
                color: 'initial',
                width: 'max-content',
                textDecoration: 'none',
            }}
        >
            <img
                style={{
                    marginRight: 10,
                    width: 42,
                    filter: !darkModeStatus ? "brightness(1) invert(1)" : "none"
                }}
                src="https://42.fr/wp-content/uploads/2021/05/42-Final-sigle-seul.svg"></img>
            <h5 className={
                classNames(
                    'mt-2',
                    {
                        'text-light': darkModeStatus,
                        'text-black': !darkModeStatus
                    }
                )
            }
            >Agenda</h5>
        </Link>
    );
}

export default Logo42;