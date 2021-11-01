const socket = io('/')
const videoGrid = document.getElementById('video-grid')
const myPeer = new Peer(undefined,{
  host:'peerjs-server.herokuapp.com', secure:true, port:443
})
const myVideo=document.createElement('video')
myVideo.muted=true
const peers={}
navigator.mediaDevices.getUserMedia({
  video: true,
  audio: true
}).then(stream=>{
  addVideoStream(myVideo,stream)

  myPeer.on('call',call=>{
    call.answer(stream)
    const video=document.createElement('video')
    call.on('stream',userVideoStream=>{
      addVideoStream(video,userVideoStream)
    })
  })

  socket.on('user-connected',userId=>{
    //connectToNewUser(userId,stream)
    setTimeout(() => {
      // user joined
      connectToNewUser(userId, stream)
    }, 3000)
  })
})

socket.on('user-disconnected',userId=>{
  if(peers[userId])
  peers[userId].close()
})

myPeer.on('open',id=>{
  socket.emit('join-room',ROOM_ID,id)
})


socket.on('user-connected',userId=>{
  console.log('User connected: ' + userId)
})

function connectToNewUser(userId,stream)
{
  console.log('connecting new user..')
  const call=myPeer.call(userId,stream)
  const video=document.createElement('video')
  call.on('stream',userVideoStream=>{
    //console.log('adding peer')
    addVideoStream(video,userVideoStream)
  })
  
  call.on('close',()=>{
    video.remove()
  })
  peers[userId]=call
}

function addVideoStream(video,stream){
  video.srcObject=stream
  video.addEventListener('loadedmetadata',()=>{
    video.play()
  })
  videoGrid.append(video)
}