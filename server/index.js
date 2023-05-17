// const express = require("express")
// const bodyParser = require("body-parser")

// const {Server} = require("socket.io")

// const io = new Server(
//     {
//         cors:true
//     }
// )

// const app = express()

// app.use(bodyParser.json())

// const UsersToSocketMap = new Map()
// const socketToUserMap = new Map()

// // Create socket for users
// io.on("connection", (socket) => {

//     // When User Join the room for the first time 
//     socket.on("join-room", (data) => {
//         const {roomID, userName} = data

//         console.log("ROOOM JOINED",roomID,userName)
//         socket.join(roomID)
        
//         socket.emit("joined-room", {roomID})
        
//         UsersToSocketMap.set(userName,socket.id)
//         socketToUserMap.set(socket.id, userName)

//         socket.broadcast.to(roomID).emit("user-joined",{userName})

//     });

//     socket.on("call-user", ({userName, offer}) => {
//         const socketID = UsersToSocketMap.get(userName)
//         const fromUser = socketToUserMap.get(socket.id)
//         console.log(socketID,fromUser)
//         socket.to(socketID).emit("incoming-call",{From:fromUser,offer})
//     })

//     socket.on("call-accepted", ({From, answer}) => {
//         const socketID = UsersToSocketMap.get(From);
//         socket.to(socketID).emit("call-accepted",{answer})
//     })


// })

// app.post("/CheckRoom", (req, res) => {
//     let roomToCheck = req.body.roomID
// })

// app.listen(8000,() => console.log("server is running on 8000") )
// io.listen(8001,() => console.log("io"))


// V2

const app = require("express")();
const server = require("http").createServer(app);
const cors = require("cors");

const io = require("socket.io")(server, {
	cors: {
		origin: "*",
		methods: [ "GET", "POST" ]
	}
});

app.use(cors());

const PORT = process.env.PORT || 8000;

app.get('/', (req, res) => {
	res.send('Running fine');
});

io.on("connection", (socket) => {
	socket.emit("me", socket.id);

	socket.on("disconnect", () => {
		// socket.broadcast.emit("callEnded")
	});

	socket.on("callUser", ({ userToCall, signalData, from, name }) => {
		io.to(userToCall).emit("callUser", { signal: signalData, from, name, userToCall });
	});

	socket.on("answerCall", (data) => {
		io.to(data.to).emit("callAccepted", data.signal)
	});

	socket.on("callEnded", (data) => {
		io.to(data.to).emit("callEnded", data)
	})

});

server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

