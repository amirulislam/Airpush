# AIRPUSH
<P> Airpush is a free screen sharing, online meetings & web conferencing web application similar to Google Meet.

### Tech stack
Node.js, MongoDB, Express,js, React/Redux, Coturn server, Socket.IO, Redis

### Screenshot
![airpush](https://raw.githubusercontent.com/icrisu/Airpush/master/screenshoot.png)

### Requirements
Airpush requires a WebRTC compatible browser such as Chrome, Firefox and Opera.

### Documentation
Unfortunately I did not have the time to write any

### Configuration
See ./server/src/config and ./front-src/src/config

### Features
1. Online video conference with up to 6 people simultaneously
2. Unlimited screen share time with 720p video resolution
3. Ease of use, you can set up a chat group and connect with others in matter of seconds

### About
1. Airpush makes use of WebRTC technology that enables Real Time Communications in the browser. Basically you will connect to others directly via peer-to-peer connections. 

2. Online meeting groups are volatile, messages and streams are not saved on the server side, once you leave a room all previous messages are lost.

3. In order to identify other participants within the online video conference, sign in is required with Google / other social network. 
