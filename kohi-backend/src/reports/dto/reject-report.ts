import { IsString } from "class-validator";

export class RejectReportDto {
  @IsString()
  handleReason?: string;
}
