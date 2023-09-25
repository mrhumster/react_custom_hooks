import { useState } from 'react';
import { useChatRoom } from '../hooks/useChatRoom';


export default function ChatRoom({ roomId }) {
    const [serverUrl, setServerUrl] = useState('https://localhost:1234');

    useChatRoom({
        roomId: roomId,
        serverUrl: serverUrl,
        onReceiveMessage(msg: string) {
            showNotification('New message: ' + msg);
        }
    });

    return (
        <>
            <label>
                Server URL:
                <input value={serverUrl} onChange={e => setServerUrl(e.target.value)} />
            </label>
            <h1>Welcome to the {roomId} room!</h1>
        </>
    );
}
