import { SEQUILIZE_REFRESH_TOKEN_REPO } from '@app/common';
import { RefreshTokenSequilizeRepositoy } from '../repositories/refresh-token.repository';

export const refreshTokenProviders = [
  {
    provide: SEQUILIZE_REFRESH_TOKEN_REPO,
    useClass: RefreshTokenSequilizeRepositoy,
  },
];
