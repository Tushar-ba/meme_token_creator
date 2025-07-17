import { IdlAccounts, IdlTypes } from '@coral-xyz/anchor';
import { MemeTokens } from './meme_tokens';

export type TokenMetadataAccount = IdlAccounts<MemeTokens>['tokenMetadata'];
export type TokenMetadataType = IdlTypes<MemeTokens>['TokenMetadata'];