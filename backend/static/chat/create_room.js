document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('roomForm');

    form.addEventListener('submit', function(event) {
        event.preventDefault();
        const roomName = document.getElementById('roomName').value;

        // AJAX call to backend to create or join room
    });
});