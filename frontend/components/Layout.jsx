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

	useEffect(() => {
		if (!user) {
			router.push('/');
		}
	}, [user]);

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
