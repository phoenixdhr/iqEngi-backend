import { SetMetadata } from '@nestjs/common';

export const IS_PUBLC_KEY = 'isPublic';
export const IsPublic = () => SetMetadata(IS_PUBLC_KEY, true);
