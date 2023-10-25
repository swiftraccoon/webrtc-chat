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