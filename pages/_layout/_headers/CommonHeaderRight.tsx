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
import { setModalFriendsStatus, setModalPiscineStatus, setModalSettingsStatus } from '../../../store/slices/settingsReducer';
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
	const friends = useSelector((state: RootState) => state.friends.list);

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

    return (
        <HeaderRight>
            <div className='row g-3'>
                {beforeChildren}

                {/* Dark Mode */}
                <div className='col-auto'>
                    <Popovers trigger='hover' desc='Dark / Light mode'>
                        <Button
                            // eslint-disable-next-line react/jsx-props-no-spreading
                            {...styledBtn}
                            onClick={() => setDarkModeStatus(!darkModeStatus)}
                            className='btn-only-icon'
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
						>
							<Icon
								icon={darkModeStatus ? 'Water' : 'Water'}
								color={darkModeStatus ? 'light' : 'info'}
								className='btn-icon'
							/>
						</Button>
					</Popovers>
				</div>
				{friends?.length ? <div className='col-auto'>
					<Popovers trigger='hover' desc='Friends'>
						<Button
							// eslint-disable-next-line react/jsx-props-no-spreading
							{...styledBtn}
							onClick={() => setFriends(!friendsIsOpen)}
							className='btn-only-icon'>
							<Icon
								icon={darkModeStatus ? 'Group' : 'Group'}
								color={darkModeStatus ? 'light' : 'secondary'}
								className='btn-icon'
							/>
						</Button>
					</Popovers>
				</div>: null}
                <div className='col-auto'>
                    <Popovers trigger='hover' desc='Settings'>
                        <Button
                            // eslint-disable-next-line react/jsx-props-no-spreading
                            {...styledBtn}
                            onClick={() => setSettings(!settingsIsOpen)}
                            className='btn-only-icon'
                            data-tour='dark-mode'>
                            <Icon
                                icon={darkModeStatus ? 'Settings' : 'Settings'}
                                color={darkModeStatus ? 'light' : 'dark'}
                                className='btn-icon'
                            />
                        </Button>
                    </Popovers>
                </div>

                {/* <div className='col-auto'>
					<Popovers trigger='hover' desc='Evaluations'>
						<Button
							// eslint-disable-next-line react/jsx-props-no-spreading
							{...styledBtn}
							onClick={() => setDarkModeStatus(!darkModeStatus)}
							className='btn-only-icon'
							data-tour='dark-mode'>
							<Icon
								icon={darkModeStatus ? 'FormatListBulleted' : 'FormatListBulleted'}
								color={darkModeStatus ? 'light' : 'dark'}
								className='btn-icon'
							/>
						</Button>
					</Popovers>
				</div> */}



                {/*	Full Screen */}
                {/* <div className='col-auto'>
					<Popovers trigger='hover' desc='Fullscreen'>
						<Button
							// eslint-disable-next-line react/jsx-props-no-spreading
							{...styledBtn}
							icon={fullScreenStatus ? 'FullscreenExit' : 'Fullscreen'}
							onClick={() => setFullScreenStatus(!fullScreenStatus)}
							aria-label='Toggle dark mode'
						/>
					</Popovers>
				</div> */}

                {/* Lang Selector */}
                {/* <div className='col-auto'>
					<Dropdown>
						<DropdownToggle hasIcon={false}>
							{typeof getLangWithKey(router.locale as ILang['key']['lng'])?.icon ===
							'undefined' ? (
								<Button
									// eslint-disable-next-line react/jsx-props-no-spreading
									{...styledBtn}
									className='btn-only-icon'
									aria-label='Change language'
									data-tour='lang-selector'>
									<Spinner isSmall inButton='onlyIcon' isGrow />
								</Button>
							) : (
								<Button
									// eslint-disable-next-line react/jsx-props-no-spreading
									{...styledBtn}
									icon={
										getLangWithKey(router.locale as ILang['key']['lng'])?.icon
									}
									aria-label='Change language'
									data-tour='lang-selector'
								/>
							)}
						</DropdownToggle>
						<DropdownMenu isAlignmentEnd data-tour='lang-selector-menu'>
							{Object.keys(LANG).map((i) => (
								<DropdownItem key={LANG[i].lng}>
									<Button
										icon={LANG[i].icon}
										onClick={() => changeLanguage(LANG[i].lng)}>
										{LANG[i].text}
									</Button>
								</DropdownItem>
							))}
						</DropdownMenu>
					</Dropdown>
				</div> */}

                {/* Quick Panel */}
                {/* <div className='col-auto'>
					<Dropdown>
						<DropdownToggle hasIcon={false}>
							{/* eslint-disable-next-line react/jsx-props-no-spreading */}
                {/* <Button {...styledBtn} icon='Tune' aria-label='Quick menu' />
						</DropdownToggle>
						<DropdownMenu isAlignmentEnd size='lg' className='py-0 overflow-hidden'>
							<div className='row g-0'>
								<div
									className={classNames(
										'col-12',
										'p-4',
										'd-flex justify-content-center',
										'fw-bold fs-5',
										'text-info',
										'border-bottom border-info',
										{
											'bg-l25-info': !darkModeStatus,
											'bg-lo25-info': darkModeStatus,
										},
									)}>
									Quick Panel
								</div>
								<div
									className={classNames(
										'col-6 p-4 transition-base cursor-pointer bg-light-hover',
										'border-end border-bottom',
										{ 'border-dark': darkModeStatus },
									)}>
									<div className='d-flex flex-column align-items-center justify-content-center'>
										<Icon icon='Public' size='3x' color='info' />
										<span>Dealers</span>
										<small className='text-muted'>Options</small>
									</div>
								</div>
								<div
									className={classNames(
										'col-6 p-4 transition-base cursor-pointer bg-light-hover',
										'border-bottom',
										{ 'border-dark': darkModeStatus },
									)}>
									<div className='d-flex flex-column align-items-center justify-content-center'>
										<Icon icon='Upcoming' size='3x' color='success' />
										<span>Inbox</span>
										<small className='text-muted'>Configuration</small>
									</div>
								</div>
								<div
									className={classNames(
										'col-6 p-4 transition-base cursor-pointer bg-light-hover',
										'border-end',
										{ 'border-dark': darkModeStatus },
									)}>
									<div className='d-flex flex-column align-items-center justify-content-center'>
										<Icon icon='Print' size='3x' color='danger' />
										<span>Print</span>
										<small className='text-muted'>Settings</small>
									</div>
								</div>
								<div className='col-6 p-4 transition-base cursor-pointer bg-light-hover'>
									<div className='d-flex flex-column align-items-center justify-content-center'>
										<Icon icon='ElectricalServices' size='3x' color='warning' />
										<span>Power</span>
										<small className='text-muted'>Mode</small>
									</div>
								</div>
							</div>
						</DropdownMenu>
					</Dropdown>
				</div> */}

                {/*	Notifications */}
                {/* <div className='col-auto'>
					<Button
						// eslint-disable-next-line react/jsx-props-no-spreading
						{...styledBtn}
						icon='Notifications'
						onClick={() => setOffcanvasStatus(true)}
						aria-label='Notifications'
					/>
				</div> */}
                {afterChildren}
            </div>

            <OffCanvas
                id='notificationCanvas'
                titleId='offcanvasExampleLabel'
                placement='end'
                isOpen={offcanvasStatus}
                setOpen={setOffcanvasStatus}>
                <OffCanvasHeader setOpen={setOffcanvasStatus}>
                    <OffCanvasTitle id='offcanvasExampleLabel'>Notifications</OffCanvasTitle>
                </OffCanvasHeader>
                <OffCanvasBody>
                    <Alert icon='ViewInAr' isLight color='info' className='flex-nowrap'>
                        4 new components added.
                    </Alert>
                    <Alert icon='ThumbUp' isLight color='warning' className='flex-nowrap'>
                        New products added to stock.
                    </Alert>
                    <Alert icon='Inventory2' isLight color='danger' className='flex-nowrap'>
                        There are products that need to be packaged.
                    </Alert>
                    <Alert icon='BakeryDining' isLight color='success' className='flex-nowrap'>
                        Your food order is waiting for you at the consultation.
                    </Alert>
                    <Alert icon='Escalator' isLight color='primary' className='flex-nowrap'>
                        Escalator will turn off at 6:00 pm.
                    </Alert>
                </OffCanvasBody>
            </OffCanvas>
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
