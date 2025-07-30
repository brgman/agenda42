import React, { FC, ReactNode, useContext, useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useTour } from '@reactour/tour';
import { useRouter } from 'next/router';
import Button, { IButtonProps } from '../../../components/bootstrap/Button';
import { HeaderRight } from '../../../layout/Header/Header';
import OffCanvas, {
    OffCanvasBody,
    OffCanvasHeader,
    OffCanvasTitle,
} from '../../../components/bootstrap/OffCanvas';
import Alert from '../../../components/bootstrap/Alert';
import Dropdown, {
    DropdownItem,
    DropdownMenu,
    DropdownToggle,
} from '../../../components/bootstrap/Dropdown';
import Icon from '../../../components/icon/Icon';
import ThemeContext from '../../../context/themeContext';
import LANG, { getLangWithKey, ILang } from '../../../lang';
import showNotification from '../../../components/extras/showNotification';
import useDarkMode from '../../../hooks/useDarkMode';
import Popovers from '../../../components/bootstrap/Popovers';
import Spinner from '../../../components/bootstrap/Spinner';
import useMounted from '../../../hooks/useMounted';
import { setModalFriendsStatus, setModalPiscineStatus, setModalSettingsStatus, setModalWavingHandStatus } from '../../../store/slices/settingsReducer';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store';

interface ICommonHeaderRightProps {
    beforeChildren?: ReactNode;
    afterChildren?: ReactNode;
}
const CommonHeaderRight: FC<ICommonHeaderRightProps> = ({ beforeChildren, afterChildren }) => {
    const settingsIsOpen = useSelector((state: RootState) => state.settings.settingsIsOpen);
	const piscineIsOpen = useSelector((state: RootState) => state.settings.piscineIsOpen);
	const friendsIsOpen = useSelector((state: RootState) => state.settings.friendsIsOpen);
	const wavingHandIsOpen = useSelector((state: RootState) => state.settings.wavingHandIsOpen);
	const friends = useSelector((state: RootState) => state.friends.list);
	const wavingNotRead = useSelector((state: RootState) => state.settings.waving_not_read);
	const me = useSelector((state: RootState) => state.user.me);

    const dispatch = useDispatch();
    const router = useRouter();
    const { darkModeStatus, setDarkModeStatus } = useDarkMode();

    const { fullScreenStatus, setFullScreenStatus } = useContext(ThemeContext);
    const styledBtn: IButtonProps = {
        color: darkModeStatus ? 'dark' : 'light',
        hoverShadow: 'default',
        isLight: !darkModeStatus,
        size: 'lg',
    };

    const [offcanvasStatus, setOffcanvasStatus] = useState(false);

    const { mounted } = useMounted();

    const { setIsOpen } = useTour();

    const setSettings = (status: boolean) => {
        dispatch(setModalSettingsStatus(status));
    }

	const setFriends = (status: boolean) => {
		dispatch(setModalFriendsStatus(status));
	}

	const setPiscine = (status: boolean) => {
		dispatch(setModalPiscineStatus(status));
	}

	const setWavingHand = (status: boolean) => {
		dispatch(setModalWavingHandStatus(status));
	}

    return (
        <HeaderRight>
            <div className='row g-3'>
                {beforeChildren}

				

				<div className='col-auto'>
					<Popovers trigger='hover' desc='Submit suggestions and bug reports in the issues.'>
						<Button
							icon="BugReport"
							isLight={!darkModeStatus}
							color= {darkModeStatus ? 'dark' : 'light'}
							hoverShadow={'default'}
							size={'lg'}
							isDisable={!me?.length}
							onClick={() => {
								window.open('https://github.com/brgman/agenda42/issues/new?template=bug_report.md', '_blank')
							}}
							data-tour='new-issue'>
							<span style={{fontSize: '1rem'}}>Bug report</span>
						</Button>
					</Popovers>
				</div>
			
				{/* Dark Mode */}
				<div className='col-auto'>
					<Popovers trigger='hover' desc='Dark / Light mode'>
						<Button
							// eslint-disable-next-line react/jsx-props-no-spreading
							{...styledBtn}
							onClick={() => setDarkModeStatus(!darkModeStatus)}
							className='btn-only-icon'
							isDisable={!me?.length}
							data-tour='dark-mode'>
							<Icon
								icon={darkModeStatus ? 'DarkMode' : 'LightMode'}
								color={darkModeStatus ? 'info' : 'warning'}
								className='btn-icon'
							/>
						</Button>
					</Popovers>
				</div>
				<div className='col-auto'>
					<Popovers trigger='hover' desc='Piscine'>
						<Button
							// eslint-disable-next-line react/jsx-props-no-spreading
							{...styledBtn}
							onClick={() => setPiscine(!piscineIsOpen)}
							className='btn-only-icon'
							isDisable={!me?.length}
						>
							<Icon
								icon={darkModeStatus ? 'Water' : 'Water'}
								color={darkModeStatus ? 'light' : 'primary'}
								className='btn-icon'
							/>
						</Button>
					</Popovers>
				</div>
				<div className='col-auto'>
					
					<Popovers trigger='hover' desc='Waving Hands'>
						<Button
							// eslint-disable-next-line react/jsx-props-no-spreading
							{...styledBtn}
							onClick={() => setWavingHand(!wavingHandIsOpen)}
							className='btn-only-icon'
							isDisable={!me?.length}
						>
							<Icon
								icon="WavingHand"
								color={darkModeStatus ? 'light' : 'secondary'}
								className='btn-icon'
							/>
							{wavingNotRead  != 0 && <span className='position-absolute top-15 start-85 translate-middle badge rounded-pill bg-danger'>
								{wavingNotRead} <span className='visually-hidden'>unread messages</span>
							</span>}
						</Button>
					</Popovers>
				</div>
				<div className='col-auto'>
					<Popovers trigger='hover' desc='Friends'>
						<Button
							// eslint-disable-next-line react/jsx-props-no-spreading
							{...styledBtn}
							onClick={() => setFriends(!friendsIsOpen)}
							isDisable={!friends?.length}
							className='btn-only-icon'>
							<Icon
								icon={darkModeStatus ? 'Group' : 'Group'}
								color={darkModeStatus ? 'light' : 'info'}
								className='btn-icon'
							/>
						</Button>
					</Popovers>
				</div>
				
                {afterChildren}
            </div>
        </HeaderRight>
    );
};
CommonHeaderRight.propTypes = {
    beforeChildren: PropTypes.node,
    afterChildren: PropTypes.node,
};
CommonHeaderRight.defaultProps = {
    beforeChildren: null,
    afterChildren: null,
};

export default CommonHeaderRight;
