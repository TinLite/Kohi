import { IsNotEmpty, IsString } from "class-validator";

export class CreateNotificationDto {
    @IsString()
    content: string
}