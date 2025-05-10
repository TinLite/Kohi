import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import CallRepository from "@/repository/call-repository";
import { Mic, MicOff, MonitorUp, PhoneMissed, Video, VideoOff } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";

function CallPeer() {
    return (
        <div className="bg-muted/30 aspect-[3/2] rounded-xl border border-muted-foreground/30"></div>
    )
}

export function PageCall() {
    const {callId} = useParams();
    const userVideoRef = useRef<HTMLVideoElement>(null);
    const [userMediaStatus, setUserMediaStatus] = useState({
        video: false,
        audio: false
    });

    const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);

    const rtcConnection = useMemo(() => new RTCPeerConnection({
        iceServers: [
            { urls: "stun:stun.cloudflare.com:3478" }, // Cloudflare STUN server
            { urls: "stun:stun.l.google.com:19302" }, // Google STUN server
        ],
        bundlePolicy: "max-bundle",
    }), []);

    useEffect(() => {
        if (!callId) {
            console.error("CL11: Call ID is not defined.");
            return;
        }
        navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true
        }).then((stream) => {
            if (userVideoRef.current) {
                userVideoRef.current.srcObject = stream;
                userVideoRef.current.play().catch((err) => {
                    console.error("CL18: Error playing video stream.", err);
                });
                userVideoRef.current.volume = 0;
                setUserMediaStatus({
                    video: true,
                    audio: true
                });
                stream.getTracks().map((track) => {
                    rtcConnection.addTransceiver(track, {
                        direction: "sendonly",
                    })
                });
            }
        }).catch((err) => {
            console.error("CL51: Error accessing media devices.", err);
        })
        .then(() => rtcConnection.createOffer())
        .then((v) => rtcConnection.setLocalDescription(v))
        .then(() => console.debug("CL53: RTC connection created and local description set."))
        .then(() => {
            console.debug("CL54: Joining channel with ID:", callId);
            CallRepository.joinChannel(callId, rtcConnection.localDescription!, rtcConnection.getTransceivers())
        });
    }, []);

    function onUserVideoMute() {
        if (userVideoRef.current) {
            const stream = userVideoRef.current.srcObject as MediaStream;
            const tracks = stream.getVideoTracks();
            if (tracks.length > 0) {
                tracks[0].enabled = !tracks[0].enabled;
            }
            setUserMediaStatus((prev) => ({ ...prev, video: tracks[0].enabled }));
        }
    }

    function onUserAudioMute() {
        if (userVideoRef.current) {
            const stream = userVideoRef.current.srcObject as MediaStream;
            const tracks = stream.getAudioTracks();
            if (tracks.length > 0) {
                tracks[0].enabled = !tracks[0].enabled;
            }
            setUserMediaStatus((prev) => ({ ...prev, audio: tracks[0].enabled }));
        }
    }


    return (
        <div className="w-dvw h-[100dvh] md:h-dvh flex flex-col">
            <div className="h-12 sticky top-0">CallID: {callId}</div>
            <div className="grid items-center h-[calc(100dvh - 6rem)] flex-grow">
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 px-4 py-2 max-h-full">
                    <div className="relative bg-muted/30 aspect-[3/2] rounded-xl border border-muted-foreground/30">
                        <video ref={userVideoRef} className="aspect-[3/2] rounded-xl object-cover h-fit w-fit"></video>
                        <div className="absolute bottom-0 right-0 rounded-br-xl bg-accent/50 text-xs text-muted-foreground rounded-tl-xl p-1 px-2">You</div>
                    </div>
                    <div className="bg-muted/30 aspect-[3/2] rounded-xl border border-muted-foreground/30"></div>
                    <div className="bg-muted/30 aspect-[3/2] rounded-xl border border-muted-foreground/30"></div>
                    <div className="bg-muted/30 aspect-[3/2] rounded-xl border border-muted-foreground/30"></div>
                    <div className="bg-muted/30 aspect-[3/2] rounded-xl border border-muted-foreground/30"></div>
                    <div className="bg-muted/30 aspect-[3/2] rounded-xl border border-muted-foreground/30"></div>
                    <div className="bg-muted/30 aspect-[3/2] rounded-xl border border-muted-foreground/30"></div>
                    <div className="bg-muted/30 aspect-[3/2] rounded-xl border border-muted-foreground/30"></div>
                    <div className="bg-muted/30 aspect-[3/2] rounded-xl border border-muted-foreground/30"></div>
                </div>
            </div>
            <div className="bottom-0 sticky bg-background">
                <Separator />
                <div className="flex justify-center gap-2 py-4">
                    <Button variant={userMediaStatus.video ? "ghost" : "secondary"} onClick={onUserVideoMute}>
                        {userMediaStatus.video ? <Video /> : <VideoOff />}
                    </Button>
                    <Button variant={userMediaStatus.audio ? "ghost" : "secondary"} onClick={onUserAudioMute}>
                        {userMediaStatus.audio ? <Mic /> : <MicOff />}
                    </Button>
                    <Button variant="ghost">
                        <MonitorUp />
                    </Button>
                    <Button variant="destructive">
                        <PhoneMissed />
                    </Button>
                </div>
            </div>
        </div>
    )
}