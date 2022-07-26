import Layout from '../components/Layout';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

Messages.title = 'WeConnect - Messages';

export default function Messages() {
	return (
		<Layout>
			<Box
				sx={{
					width: '100%',
					margin: 'auto',
					mt: 20,
					p: 2,
				}}
			>
				<Typography variant='h4' textAlign='center' gutterBottom>
					Select a message
				</Typography>
				<Typography
					variant='body2'
					textAlign='center'
					sx={{ color: '#808080' }}
				>
					Choose from your existing conversations or add new friends to start a
					new one.
				</Typography>
			</Box>
		</Layout>
	);
}
