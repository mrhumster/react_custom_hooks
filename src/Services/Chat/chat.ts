interface createConnectionPropsType {
    serverUrl: string,
    roomId: string
}

export function createConnection(props: createConnectionPropsType) {
    const { serverUrl, roomId } = props
    let intervalId: NodeJS.Timer;
    let messageCallback: Function | null;
    return {
        connect() {
            console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
            clearInterval(intervalId);
            intervalId = setInterval(() => {
                if (messageCallback) {
                    if (Math.random() > 0.5) {
                        messageCallback('hey')
                    } else {
                        messageCallback('lol');
                    }
                }
            }, 3000);
        },
        disconnect() {
            clearInterval(intervalId);
            messageCallback = null;
            console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl + '');
        },
        on(event: string, callback: Function) {
            if (messageCallback) {
                throw Error('Cannot add the handler twice.');
            }
            if (event !== 'message') {
                throw Error('Only "message" event is supported.');
            }
            messageCallback = callback;
        },
    };
}
