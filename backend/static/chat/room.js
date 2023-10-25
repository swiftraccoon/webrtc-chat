// WebRTC Configuration
const configuration = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };
const peerConnection = new RTCPeerConnection(configuration);

// Capture local media
navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
    const localVideo = document.getElementById('localVideo');
    localVideo.srcObject = stream;

    stream.getTracks().forEach(track => peerConnection.addTrack(track, stream));
});

// Handle remote streams
peerConnection.ontrack = function(event) {
    const remoteVideo = document.getElementById('remoteVideo');
    remoteVideo.srcObject = event.streams[0];
};

var roomName = JSON.parse(document.getElementById('room-name').textContent);

var chatSocket = new WebSocket(
    'ws://' + window.location.host +
    '/ws/chat/' + roomName + '/');

// Error handling
peerConnection.oniceconnectionstatechange = function(event) {
    if (peerConnection.iceConnectionState === 'failed') {
        console.error('ICE connection failed.');
    }
};

// Fetch list of users in the room from the backend
function fetchUserList() {
    // AJAX call to backend to fetch user list
    fetch('/get_chat_history/', {
        method: 'POST',
        body: JSON.stringify({ room_name: roomName })
    }).then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            // Update the 'userListItems' element with the fetched list
        }
    });
}

// Call fetchUserList at regular intervals
setInterval(fetchUserList, 5000);

// UI Enhancements
document.getElementById('muteAudio').onclick = function() {
    // Toggle audio mute
    const audioTracks = localStream.getAudioTracks();
    audioTracks[0].enabled = !audioTracks[0].enabled;
};

document.getElementById('pauseVideo').onclick = function() {
    // Toggle video pause
    const videoTracks = localStream.getVideoTracks();
    videoTracks[0].enabled = !videoTracks[0].enabled;
};

document.getElementById('endCall').onclick = function() {
    // End the call
    peerConnection.close();
};

// Handle WebRTC signaling
chatSocket.onmessage = function(e) {
    const data = JSON.parse(e.data);

    if (data.message_type === 'WEBRTC_SIGNAL') {
        const signal = JSON.parse(data.message);
        if (signal.offer) {
            peerConnection.setRemoteDescription(new RTCSessionDescription(signal.offer)).then(() => {
                return peerConnection.createAnswer();
            }).then(answer => {
                return peerConnection.setLocalDescription(answer);
            }).then(() => {
                chatSocket.send(JSON.stringify({
                    'message_type': 'WEBRTC_SIGNAL',
                    'message': JSON.stringify({ 'answer': peerConnection.localDescription })
                }));
            });
        } else if (signal.answer) {
            peerConnection.setRemoteDescription(new RTCSessionDescription(signal.answer));
        } else if (signal.iceCandidate) {
            peerConnection.addIceCandidate(new RTCIceCandidate(signal.iceCandidate));
        }
    } else {
        document.querySelector('#chat-log').value += (data.message + '\n');
    }
};

chatSocket.onclose = function(e) {
    console.error('Chat socket closed unexpectedly');
};

document.querySelector('#chat-message-input').focus();
document.querySelector('#chat-message-input').onkeyup = function(e) {
    if (e.keyCode === 13) {  // Enter key
        document.querySelector('#chat-message-submit').click();
    }
};

document.querySelector('#chat-message-submit').onclick = function(e) {
    var messageInputDom = document.querySelector('#chat-message-input');
    var message = messageInputDom.value;
    chatSocket.send(JSON.stringify({
        'message': message
    }));
    messageInputDom.value = '';
};