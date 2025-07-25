import React, { createContext, FC, ReactNode, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import useDeviceScreen from '../hooks/useDeviceScreen';

export interface IThemeContextProps {
	asideStatus: boolean;
	darkModeStatus: boolean;
	viewModeStatus: "month" | "week" | "work_week" | "day" | "agenda";
	fullScreenStatus: boolean;
	leftMenuStatus: boolean;
	mobileDesign: boolean;
	rightMenuStatus: boolean;
	rightPanel: boolean;
	setAsideStatus: (value: ((prevState: boolean) => boolean) | boolean) => void;
	setDarkModeStatus: (value: ((prevState: boolean) => boolean) | boolean) => void;
	setViewModeStatus: (value: "month" | "week" | "work_week" | "day" | "agenda" | ((prevState: "month" | "work_week" | "week" | "day" | "agenda") => "month" | "week" | "work_week" | "day" | "agenda")) => void;
	setFullScreenStatus: (value: ((prevState: boolean) => boolean) | boolean) => void;
	setLeftMenuStatus: (value: ((prevState: boolean) => boolean) | boolean) => void;
	setRightMenuStatus: (value: ((prevState: boolean) => boolean) | boolean) => void;
	setRightPanel: (value: ((prevState: boolean) => boolean) | boolean) => void;
}
const ThemeContext = createContext<IThemeContextProps>({} as IThemeContextProps);

interface IThemeContextProviderProps {
	children: ReactNode;
}
export const ThemeContextProvider: FC<IThemeContextProviderProps> = ({ children }) => {
	const deviceScreen = useDeviceScreen();
	// @ts-ignore
	const mobileDesign = deviceScreen?.width <= 786;

	const [darkModeStatus, setDarkModeStatus] = useState(
		typeof window !== 'undefined' && localStorage.getItem('fact_darkModeStatus')
			? localStorage.getItem('fact_darkModeStatus') === 'true'
			: process.env.NEXT_PUBLIC_DARK_MODE === 'true',
	);

	useEffect(() => {
		localStorage.setItem('fact_darkModeStatus', darkModeStatus.toString());
	}, [darkModeStatus]);

	const [viewModeStatus, setViewModeStatus] = useState(() => {
		if (typeof window !== 'undefined') {
			const storedValue = localStorage.getItem('fact_viewMode');
			return storedValue ? storedValue : 'week';
		}
		return 'week';
	});

	useEffect(() => {
		if (viewModeStatus != "day")
			localStorage.setItem('fact_viewMode', viewModeStatus.toString());
	}, [viewModeStatus]);

	const [fullScreenStatus, setFullScreenStatus] = useState(false);

	const [leftMenuStatus, setLeftMenuStatus] = useState(false);
	const [rightMenuStatus, setRightMenuStatus] = useState(false);

	const [asideStatus, setAsideStatus] = useState(
		typeof window !== 'undefined' && localStorage.getItem('fact_asideStatus')
			? localStorage.getItem('fact_asideStatus') === 'true'
			: // @ts-ignore
			deviceScreen?.width >=
			Number(process.env.NEXT_PUBLIC_ASIDE_MINIMIZE_BREAKPOINT_SIZE),
	);
	useEffect(() => {
		localStorage.setItem('fact_asideStatus', asideStatus?.toString());
	}, [asideStatus]);

	const [rightPanel, setRightPanel] = useState(false);

	useEffect(() => {
		// @ts-ignore
		if (deviceScreen?.width >= process.env.NEXT_PUBLIC_ASIDE_MINIMIZE_BREAKPOINT_SIZE) {
			if (localStorage.getItem('fact_asideStatus') === 'true') setAsideStatus(true);
			setLeftMenuStatus(false);
			setRightMenuStatus(false);
		}
		return () => {
			setAsideStatus(false);
		};
	}, [deviceScreen?.width]);

	const values: IThemeContextProps = useMemo(
		() => ({
			mobileDesign,
			darkModeStatus,
			setDarkModeStatus,
			fullScreenStatus,
			setFullScreenStatus,
			asideStatus,
			setAsideStatus,
			leftMenuStatus,
			setLeftMenuStatus,
			rightMenuStatus,
			setRightMenuStatus,
			rightPanel,
			setRightPanel,
			viewModeStatus,
			setViewModeStatus,
		}),
		[
			asideStatus,
			darkModeStatus,
			fullScreenStatus,
			leftMenuStatus,
			mobileDesign,
			rightMenuStatus,
			rightPanel,
			viewModeStatus,
		],
	);

	return <ThemeContext.Provider value={values}>{children}</ThemeContext.Provider>;
};
ThemeContextProvider.propTypes = {
	children: PropTypes.node.isRequired,
};

export default ThemeContext;
