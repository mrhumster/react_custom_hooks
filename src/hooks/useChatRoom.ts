import { useEffect } from 'react';
import { experimental_useEffectEvent as useEffectEvent } from 'react';
import { createConnection } from '../Services';


interface useChatRoomPropsType {
    serverUrl: string,
    roomId: string,
    onReceiveMessage: Function
}


export function useChatRoom(props: useChatRoomPropsType) {
    const { serverUrl, roomId, onReceiveMessage } = props
    const onMessage = useEffectEvent(onReceiveMessage);

    useEffect(() => {
        const options = {
            serverUrl: serverUrl,
            roomId: roomId
        };
        const connection = createConnection(options);
        connection.connect();
        connection.on('message', (msg) => {
            onMessage(msg);
        });
        return () => connection.disconnect();
    }, [roomId, serverUrl]);
}
