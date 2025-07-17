export interface TokenMetadata {
  mint: string;
  authority: string;
  supply: number;
  decimals: number;
  isInitialized: boolean;
  bump: number;
  mintAuthority: string;
  memeName: string;
}

export interface CreateTokenForm {
  memeName: string;
  supply: string;
  decimals: number;
}