import { SetMetadata } from '@nestjs/common';
export const CheckBan = (type: string) => SetMetadata('banType', type);