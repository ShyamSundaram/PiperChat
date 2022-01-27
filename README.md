# PiperCHat
This is a simple decentralized video chat app designed with WebRTC.
# How to use?
- Visit https://pipertest.herokuapp.com/438b388a-8bc3-47e3-adbb-4d6c858ad2dd
- Allow access to Webcam and Microphpne
- Share the URL in the address bar to those you wish to call.
- Talk away!

# Setup Instructions
1. npm install
2. npm i -g peer

# Run (on https server) (current version)
**Note:** For this, you will have to create your own SSL certificate and include that in server.js line 8 and 9 (where server is created.) Also make sure to enable 'Allow invalid certificates' in chrome://flags<br>Generating SSL: https://www.youtube.com/watch?v=USrMdBF0zcg<br><br>
 npm run devStart <br>
 The app is running on localhost:3000
# Run (on http server)
 npm run devStart <br>
 Open another terminal and run: peerjs --port 3001<br>
 The app is running on localhost:3000
