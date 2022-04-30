import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import { red } from '@mui/material/colors';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import CardActions from '@mui/material/CardActions';
import Divider from '@mui/material/Divider';
import ButtonGroup from '@mui/material/ButtonGroup';

import { useState, useEffect } from 'react';
import { createPost } from '../src/features/posts/postSlice';
import Spinner from './Spinner';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';

export default function Post() {
	const dispatch = useDispatch();

	const [postFormData, setPostFormData] = useState({
		text: '',
	});

	const { text } = postFormData;

	const handleInputChange = (e) => {
		const { name, value } = e.currentTarget;
		setPostFormData((prevData) => ({
			...prevData,
			[name]: value,
		}));
	};

	const onSubmit = async (e) => {
		e.preventDefault();

		dispatch(createPost({ text }));

		setPostFormData({
			text: '',
		});
	};

	return (
		<Grid item xs={12} sm={6} md={12}>
			<Card
				sx={{
					display: 'flex',
					flexDirection: 'column',
					maxWidth: 700,
					margin: 'auto',
				}}
				component='form'
				onSubmit={onSubmit}
				noValidate
			>
				<CardHeader
					title={
						<Typography variant='h5' component='div'>
							Create Post
						</Typography>
					}
				/>
				<Divider variant='middle' />
				<CardHeader
					avatar={
						<Avatar
							sx={{ bgcolor: red[500], width: 56, height: 56 }}
							aria-label='recipe'
						>
							R
						</Avatar>
					}
					title={
						<TextField
							id='text'
							name='text'
							label='Write something here...'
							multiline
							variant='standard'
							onChange={handleInputChange}
							value={text}
							fullWidth
						/>
					}
				/>
				<CardActions
					sx={{
						display: 'flex',
						justifyContent: 'flex-end',
						p: 1,
						m: 1,
						bgcolor: 'background.paper',
						borderRadius: 1,
					}}
					disableSpacing
				>
					<ButtonGroup variant='outlined' aria-label='outlined button group'>
						<Button startIcon={<ImageOutlinedIcon />}>Photo</Button>
						<Button type='submit'>Post</Button>
					</ButtonGroup>
				</CardActions>
			</Card>
		</Grid>
	);
}
