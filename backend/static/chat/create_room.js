document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('roomForm');

    form.addEventListener('submit', function (event) {
        event.preventDefault();
        const roomName = document.getElementById('roomName').value;

        // AJAX call to backend to create or join room
        fetch('/create_room/', {
            method: 'POST',
            body: JSON.stringify({ room_name: roomName })
        }).then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    // Redirect to the room
                }
            });
    });
});
