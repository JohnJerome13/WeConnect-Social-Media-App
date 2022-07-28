import * as React from 'react';
import Box from '@mui/material/Box';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import CssBaseline from '@mui/material/CssBaseline';
import Drawer from './Drawer';

export default function Layout(props) {
	const router = useRouter();

	const { user } = useSelector((state) => state.auth);

	var isUser = JSON.parse(localStorage.getItem('user'));

	if (!isUser) {
		router.push('/');
	}

	return (
		<Box
			sx={{
				display: 'flex',
				flexDirection: 'column',
			}}
		>
			<CssBaseline />

			{user && <Drawer content={props.children} />}
		</Box>
	);
}
