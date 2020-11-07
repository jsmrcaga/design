import React from 'react';

import { ReactComponent as UserSVG } from '../../iconography/user.svg';

import Style from './sidebar.module.css';

export function SidebarLayout({ Sidebar=null, show=false, children }) {
	const [ shouldShow, setShow ] = React.useState(show);
	let sidecontent = Sidebar ? (React.isValidElement(Sidebar) ? Sidebar : <Sidebar/>) : Sidebar;
	return (
		<div className={Style['sidebar-layout']}>
			<div className={`${Style['sidebar-container']} ${shouldShow ? Style['displayed'] : ''}`}>
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
