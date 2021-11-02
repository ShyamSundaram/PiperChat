const express = require('express')
const { join } = require('path')
const app = express()
const fs=require('fs')
const path=require('path')
const server = require('http').Server(app)
const io = require('socket.io')(server)
const { ExpressPeerServer } = require('peer');
const peerServer = ExpressPeerServer(server, {
  debug: true
});
// const server = require('https').createServer({ 
//     key:fs.readFileSync(path.join(__dirname,'cert','key.pem')), //mention your path to key
//     cert:fs.readFileSync(path.join(__dirname,'cert','cert.pem'))},app)//.Server(app) //mention your path to cert

const io = require('socket.io')(server)
const { v4: uuidV4 } = require('uuid')

app.set('view engine', 'ejs')
app.use(express.static('public'))

app.get('/', (req, res) => {
  res.redirect(`/${uuidV4()}`)
})

app.get('/:room', (req, res) => {
  res.render('room', { roomId: req.params.room })
})

io.on('connection', socket => {
  socket.on('join-room', (roomId, userId) => {
    socket.join(roomId)
    socket.broadcast.to(roomId).emit('user-connected',userId)

    socket.on('disconnect',()=>{
      socket.broadcast.to(roomId).emit('user-disconnected',userId)
    })
  })
})

server.listen(3000)