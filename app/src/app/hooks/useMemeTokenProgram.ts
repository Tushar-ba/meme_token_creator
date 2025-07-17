'use client';

import { useMemo } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Program, AnchorProvider, Idl, BN } from '@coral-xyz/anchor';
import { PublicKey, Keypair, SystemProgram } from '@solana/web3.js';
import { getAssociatedTokenAddress, TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID } from '@solana/spl-token';
import idl from '../idl/meme_tokens.json';
import { PROGRAM_ID } from '../utils/constants';

export function useMemeTokenProgram() {
  const { connection } = useConnection();
  const wallet = useWallet();

  const provider = useMemo(() => {
    if (!wallet.publicKey || !wallet.signTransaction) return null;
    
    return new AnchorProvider(
      connection,
      wallet as any,
      { commitment: 'confirmed' }
    );
  }, [connection, wallet]);

  const program = useMemo(() => {
    if (!provider) return null;
    return new Program(idl as Idl, provider);
  }, [provider]);

  const createToken = async (memeName: string, supply: number, decimals: number) => {
    console.log('Creating token with params:', { memeName, supply, decimals });
    console.log('Wallet connected:', wallet.connected);
    console.log('Wallet public key:', wallet.publicKey?.toString());
    console.log('Program initialized:', !!program);
    
    if (!program || !wallet.publicKey) {
      throw new Error('Wallet not connected or program not initialized');
    }

    const mintKeypair = Keypair.generate();
    
    const [tokenMetadataPda] = PublicKey.findProgramAddressSync(
      [Buffer.from('token_metadata'), Buffer.from(memeName)],
      PROGRAM_ID
    );

    const associatedTokenAccount = await getAssociatedTokenAddress(
      mintKeypair.publicKey,
      wallet.publicKey
    );

    // Anchor methods are camelCase in JavaScript/TypeScript
    try {
      console.log('Preparing transaction with accounts:', {
        payer: wallet.publicKey.toString(),
        mint: mintKeypair.publicKey.toString(),
        token_account: associatedTokenAccount.toString(),
        token_metadata: tokenMetadataPda.toString(),
      });
      
      const tx = await program.methods
        .createToken(memeName, new BN(supply), decimals)
        .accounts({
          payer: wallet.publicKey,
          mint: mintKeypair.publicKey,
          token_account: associatedTokenAccount,
          token_metadata: tokenMetadataPda,
          token_program: TOKEN_PROGRAM_ID,
          associated_token_program: ASSOCIATED_TOKEN_PROGRAM_ID,
          system_program: SystemProgram.programId,
        })
        .signers([mintKeypair])
        .rpc();
      
      console.log('Transaction successful:', tx);
      return {
        signature: tx,
        mint: mintKeypair.publicKey.toString(),
        tokenAccount: associatedTokenAccount.toString(),
        metadata: tokenMetadataPda.toString(),
      };
    } catch (error) {
      console.error('Error creating token:', error);
      throw error;
    }
  };

  const getTokenMetadata = async (memeName: string) => {
    if (!program || !connection) return null;

    const [tokenMetadataPda] = PublicKey.findProgramAddressSync(
      [Buffer.from('token_metadata'), Buffer.from(memeName)],
      PROGRAM_ID
    );

    try {
      const accountInfo = await connection.getAccountInfo(tokenMetadataPda);
      if (!accountInfo) {
        return null;
      }

      // Use program.coder to decode the account data
      const metadata = program.coder.accounts.decode('tokenMetadata', accountInfo.data);
      
      return {
        mint: metadata.mint.toString(),
        authority: metadata.authority.toString(),
        supply: metadata.supply.toNumber(),
        decimals: metadata.decimals,
        isInitialized: metadata.isInitialized,
        bump: metadata.bump,
        mintAuthority: metadata.mintAuthority.toString(),
        memeName: metadata.memeName,
      };
    } catch (error) {
      console.error('Error fetching token metadata:', error);
      return null;
    }
  };

  return {
    program,
    createToken,
    getTokenMetadata,
    connected: !!wallet.connected,
    publicKey: wallet.publicKey,
  };
}