import React, { cloneElement, FC, HTMLAttributes, ReactElement, ReactNode, useCallback, useRef, useState } from 'react';
import { usePopper } from 'react-popper';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Portal from '../../layout/Portal/Portal';
import useEventOutside from '../../hooks/useEventOutside';

type Direction =
	| 'auto'
	| 'auto-start'
	| 'auto-end'
	| 'top'
	| 'top-start'
	| 'top-end'
	| 'bottom'
	| 'bottom-start'
	| 'bottom-end'
	| 'right'
	| 'right-start'
	| 'right-end'
	| 'left'
	| 'left-start'
	| 'left-end';

interface IPopoversProps extends HTMLAttributes<HTMLDivElement> {
	children: ReactElement | string;
	className?: string;
	bodyClassName?: string | null;
	title?: string;
	desc?: ReactNode;
	placement?: Direction;
	flip?: Direction[];
	trigger?: 'click' | 'hover';
	delay?: number;
	isDisplayInline?: boolean;
	modifiers?: object;
}
const Popovers: FC<IPopoversProps> = ({
	children,
	className,
	bodyClassName,
	title,
	desc,
	placement,
	flip,
	trigger,
	delay,
	isDisplayInline,
	modifiers,
	...props
}) => {
	const [referenceElement, setReferenceElement] = useState<HTMLSpanElement | null>(null);
	const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(null);
	const [arrowElement, setArrowElement] = useState<HTMLDivElement | null>(null);
	const { styles, attributes } = usePopper(referenceElement, popperElement, {
		placement,
		modifiers: [
			{
				name: 'offset',
				options: {
					offset: [0, 6.5],
				},
			},
			{
				name: 'flip',
				enabled: true,
				options: {
					fallbackPlacements: flip,
				},
			},
			{
				name: 'arrow',
				options: {
					element: arrowElement,
				},
			},
			{ ...modifiers },
		],
	});

	const [popoverOpen, setPopoverOpen] = useState(false);
	const dropdownRef = useRef(null);

	const closeMenu = useCallback((e) => {
		if (typeof children !== 'string' && !children.props?.color && children?.props?.onClick && children?.ref) {
			children.props.onClick();
		}
		setPopoverOpen(false);
		e?.stopImmediatePropagation();
		e?.stopPropagation();
	}, []);

	useEventOutside(dropdownRef, "click", e => closeMenu(e));

	const ON_CLICK = () => {
		if (trigger === 'click') setPopoverOpen(!popoverOpen);
		if (typeof children !== 'string' && children?.props?.onClick) children.props.onClick();
	};

	const ON_MOUSE_OVER = () => {
		if (trigger === 'hover') setPopoverOpen(true);
		if (typeof children !== 'string' && children?.props?.onMouseOver)
			children.props.onMouseOver();
	};

	const ON_MOUSE_LEAVE = () => {
		if (trigger === 'hover') setTimeout(() => setPopoverOpen(false), delay);
		if (typeof children !== 'string' && children?.props?.onMouseLeave)
			children.props.onMouseLeave();
	};

	const PROPS = {
		className: classNames(
			{ 'd-inline-block': isDisplayInline, 'popover-string': typeof children === 'string' },
			typeof children !== 'string' && children?.props?.className,
		),
		onClick: ON_CLICK,
		onMouseOver: ON_MOUSE_OVER,
		onMouseLeave: ON_MOUSE_LEAVE,
	};

	return (
		<div>
			{cloneElement(
				typeof children === 'string' ? (
					// eslint-disable-next-line react/jsx-props-no-spreading
					<span ref={setReferenceElement} {...PROPS}>
						{children}
					</span>
				) : (
					children
				),
				{
					ref: setReferenceElement,
					...PROPS,
				},
			)}
			{popoverOpen && (
				<Portal>
					<div
						ref={setPopperElement}
						role='tooltip'
						className={classNames('popover', 'bs-popover-auto', className)}
						style={styles.popper}
						// eslint-disable-next-line react/jsx-props-no-spreading
						{...props}
						// eslint-disable-next-line react/jsx-props-no-spreading
						{...attributes.popper}>
						<div ref={setArrowElement} className='popover-arrow' style={styles.arrow} />
						{title && <h3 className='popover-header'>{title}</h3>}
						{desc && (
							<div className={classNames('popover-body', bodyClassName)}>{desc}</div>
						)}
					</div>
				</Portal>
			)}
		</div>
	);
};
Popovers.propTypes = {
	/**
	 * String, HTML or React Component (`<Component {...props} />`)
	 */
	// @ts-ignore
	children: PropTypes.node.isRequired,
	title: PropTypes.string,
	/**
	 * String, HTML or React Component
	 */
	desc: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
	/**
	 * Position of popovers
	 */
	placement: PropTypes.oneOf([
		'auto',
		'auto-start',
		'auto-end',
		'top',
		'top-start',
		'top-end',
		'bottom',
		'bottom-start',
		'bottom-end',
		'right',
		'right-start',
		'right-end',
		'left',
		'left-start',
		'left-end',
	]),
	/**
	 * For situations where there is not enough space to place
	 */
	// @ts-ignore
	flip: PropTypes.arrayOf(
		PropTypes.oneOf([
			'auto',
			'auto-start',
			'auto-end',
			'top',
			'top-start',
			'top-end',
			'bottom',
			'bottom-start',
			'bottom-end',
			'right',
			'right-start',
			'right-end',
			'left',
			'left-start',
			'left-end',
		]),
	),
	trigger: PropTypes.oneOf(['click', 'hover']),
	/**
	 * The value entered is in milliseconds
	 */
	delay: PropTypes.number,
	/**
	 * Adds style: `display: inline-block;`
	 */
	isDisplayInline: PropTypes.bool,
	className: PropTypes.string,
	bodyClassName: PropTypes.string,
	/**
	 * More information, [Popper.js](https://popper.js.org/docs/v2/modifiers/)
	 */
	// eslint-disable-next-line react/forbid-prop-types
	modifiers: PropTypes.object,
};
Popovers.defaultProps = {
	title: undefined,
	desc: null,
	placement: 'top',
	flip: ['top', 'bottom'],
	trigger: 'click',
	delay: 0,
	isDisplayInline: false,
	className: undefined,
	bodyClassName: null,
	modifiers: {
		name: 'example',
		enabled: false,
		phase: 'read',
		fn: () => { },
	},
};

export default Popovers;
function useCollback(arg0: () => void) {
	throw new Error('Function not implemented.');
}

