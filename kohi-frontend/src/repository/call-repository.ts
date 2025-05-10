export default class CallRepository {
    static async joinChannel(channelId: string, { sdp }: RTCSessionDescription, tranceivers: RTCRtpTransceiver[]) {
        const data = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/${import.meta.env.VITE_API_PREFIX}/chat/channels/${channelId}/calls/join`, {
            credentials: 'include',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                sessionDescription: {
                    sdp,
                    type: 'offer',
                },
                tracks: tranceivers.map(({ mid, sender }) => ({
                    location: 'local',
                    mid,
                    trackName: sender.track?.id,
                })),
            }),
        });
        if (!data.ok) {
            throw new Error("Failed to fetch chat channel");
        }
        return await data.json();
    }
}
