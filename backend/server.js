const path = require('path');
const express = require('express');
const colors = require('colors');
const dotenv = require('dotenv').config();
const { errorHandler } = require('./middleware/errorMiddleware');
const connectDB = require('./config/db');
const cors = require('cors');
const port = process.env.PORT || 5000;
// const socket = require('socket.io');

connectDB();

const app = express();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/posts', require('./routes/postRoutes'));
app.use('/api/comments', require('./routes/commentRoutes'));
app.use('/api/friends', require('./routes/friendRoutes'));
app.use('/api/messages', require('./routes/messageRoutes'));
console.log(process.env.DATABASE_URL);

// Serve frontend
if (process.env.NODE_ENV === 'production') {
	app.use(express.static(path.join(__dirname, '../frontend/out')));

	app.get('*', (req, res) =>
		res.sendFile(path.join(__dirname, '../frontend/out/index.html'))
	);
} else {
	app.get('/', (req, res) => res.send('Please set to production'));
}

app.use(errorHandler);

const server = app.listen(port, () =>
	console.log(`Server started on port ${port}`)
);

// const io = socket(server, {
// 	cors: {
// 		origin: 'https://we-connect-social-media.herokuapp.com',
// 		credentials: true,
// 	},
// });

global.onlineUsers = new Map();
// io.on('connection', (socket) => {
// 	global.chatSocket = socket;
// 	socket.on('add-user', (userId) => {
// 		onlineUsers.set(userId, socket.id);
// 	});

// 	socket.on('send-msg', (data) => {
// 		const sendUserSocket = onlineUsers.get(data.to);
// 		if (sendUserSocket) {
// 			socket.to(sendUserSocket).emit('msg-recieve', data);
// 		}
// 	});
// });
