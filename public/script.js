const socket = io('/')
const videoGrid = document.getElementById('video-grid')
const myPeer = new Peer(undefined,{
  host:'peerjs-server.herokuapp.com', secure:true, port:443
})
var myStream;

const myVideo=document.createElement('video')
myVideo.classList.add("myvideo") 
myVideo.muted=true

const peers={}

navigator.mediaDevices.getUserMedia({
  video: true,
  audio: true
}).then(stream=>{
  addVideoStream(myVideo,stream)
  myStream=stream
  myPeer.on('call',call=>{
    call.answer(stream)
    const video=document.createElement('video')
    video.classList.add("myvideo") 
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
  video.classList.add("myvideo") 

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

var video_button = document.getElementById("video_button");

video_button.onclick = function(){
  if(myStream.getVideoTracks()[0].enabled==true)
  video_button.innerText="Show Video";
  else
  video_button.innerText="Hide Video";
  myStream.getVideoTracks()[0].enabled = !(myStream.getVideoTracks()[0].enabled);
}

var audio_button = document.getElementById("audio_button");
audio_button.onclick = function(){
  if(myStream.getAudioTracks()[0].enabled==true)
  audio_button.innerText="Mute";
  else
  audio_button.innerText="Unmute";
  myStream.getAudioTracks()[0].enabled = !(myStream.getAudioTracks()[0].enabled);
}