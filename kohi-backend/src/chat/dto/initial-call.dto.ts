import { IsObject } from "class-validator";

export class InitialCallDto {
    @IsObject()
    sessionDescription: {
        sdp: string;
        type: string;
    }

    @IsObject()
    tracks: {
        audio: {
            codec: string;
            mid: string;
            streamId: string;
        }[],
        video: {
            codec: string;
            mid: string;
            streamId: string;
        }[]
    }
}