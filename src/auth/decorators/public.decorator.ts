import { SetMetadata } from '@nestjs/common';

export const IS_PUBLC_KEY = true;
export const Public = () => SetMetadata(IS_PUBLC_KEY, true);
