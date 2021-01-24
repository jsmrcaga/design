import React from 'react';

import { ReactComponent as UserSVG } from '../../iconography/user.svg';

import Style from './sidebar.module.css';

import { useClickAway } from '../../../hooks/useClickAway';

export function SidebarLayout({ Sidebar=null, show=false, children, onClickAway=()=>{}, className='' }) {
	const sidebarRef = React.useRef(null);
	const [ shouldShow, setShow ] = React.useState(show);

	let sidecontent = Sidebar ? (React.isValidElement(Sidebar) ? Sidebar : <Sidebar/>) : Sidebar;

	useClickAway(sidebarRef, () => {
		setShow(false);
		onClickAway();
	});

	return (
		<div className={Style['sidebar-layout']}>
			<div className={`${Style['sidebar-container']} ${shouldShow ? Style['displayed'] : ''} ${className}`} ref={sidebarRef}>
				<UserSVG onClick={() => setShow(!shouldShow)} className={`${Style['menu-icon']} ${Style['sidebar']}`}/>
				{sidecontent}
			</div>
			<div className={Style['sidebar-content']}>				
				<UserSVG onClick={() => setShow(!shouldShow)} className={`${Style['menu-icon']} ${Style['content']}`}/>
				{children}
			</div>
		</div>
	);
}
