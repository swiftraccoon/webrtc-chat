import json
from channels.generic.websocket import AsyncWebsocketConsumer
import asyncio


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope["url_route"]["kwargs"]["room_name"]
        self.room_group_name = f"chat_{self.room_name}"

        # Join room group
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)

        await self.accept()

    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def receive(self, text_data):
        """
        Receive message from WebSocket
        """
        try:
            text_data_json = json.loads(text_data)
            message_type = text_data_json.get("message_type", None)

            if message_type == "WEBRTC_SIGNAL":
                await self.channel_layer.group_send(
                    self.room_group_name,
                    {
                        "type": "webrtc_signal",
                        "message_type": "WEBRTC_SIGNAL",
                        "message": text_data_json["message"],
                    },
                )
            else:
                message = text_data_json["message"]
                await self.channel_layer.group_send(
                    self.room_group_name, {"type": "chat_message", "message": message}
                )
        except Exception as e:
            print(f"An error occurred: {e}")

    # Receive message from room group
    async def chat_message(self, event):
        message = event["message"]

        # Send message to WebSocket
        await self.send(text_data=json.dumps({"message": message}))

    async def webrtc_signal(self, event):
        """
        This method will handle WebRTC signaling messages.
        """
        message_type = event["message_type"]
        message = event["message"]

        await self.send(
            text_data=json.dumps({"message_type": message_type, "message": message})
        )
