const socket = io('/')
const videoGrid = document.getElementById('vids')
const myPeer = new Peer(undefined,{
  host:'peerjs-server.herokuapp.com', secure:true, port:443
})
var myStream;

const myVideo=document.createElement('video')
myVideo.classList.add("myvideo")
// myVideo.classList.add("col")
// myVideo.classList.add("d-flex")
// myVideo.classList.add("justify-content-center")

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
    // video.classList.add("col")
    // video.classList.add("d-flex")
    // video.classList.add("justify-content-center")
    
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


// socket.on('user-connected',userId=>{
//   console.log('User connected: ' + userId)
// })

function connectToNewUser(userId,stream)
{
  console.log('connecting new user..')
  const call=myPeer.call(userId,stream)
  const video=document.createElement('video')
  video.classList.add("myvideo")
  // video.classList.add("col")
  // video.classList.add("d-flex")
  // video.classList.add("justify-content-center")

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
  const d=document.createElement("div")
  d.classList.add("col")
  d.classList.add("d-flex")
  d.classList.add("justify-content-center")
  d.append(video)
  videoGrid.append(d)
  console.log(peers)
}

var video_button = document.getElementById("video_button");
let end_call_button = document.getElementById("call_end_button");
video_button.onclick = function(){
  if(myStream.getVideoTracks()[0].enabled==true)
  video_button.innerHTML='<span class="material-icons">videocam_off</span>';
  else
  video_button.innerHTML='<span class="material-icons">videocam</span>';
  myStream.getVideoTracks()[0].enabled = !(myStream.getVideoTracks()[0].enabled);
}
end_call_button.onclick = function(){
  // socket.disconnect(true);
  // socket.close();
  socket.emit('end');
}
var audio_button = document.getElementById("audio_button");
audio_button.onclick = function(){
  if(myStream.getAudioTracks()[0].enabled==true)
  audio_button.innerHTML='<span class="material-icons">mic_off</span>';
  else
  audio_button.innerHTML='<span class="material-icons">mic</span>';
  myStream.getAudioTracks()[0].enabled = !(myStream.getAudioTracks()[0].enabled);
}