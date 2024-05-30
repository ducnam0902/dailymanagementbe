import { GenerateTokenInterface } from './GenerateToken.interface';

export type LoginType = Omit<GenerateTokenInterface, 'refreshToken'>;
