import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { MemeTokens } from "../target/types/meme_tokens";
import { PublicKey } from "@solana/web3.js";  // Fixed import
import { ASSOCIATED_TOKEN_PROGRAM_ID, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { Keypair, SystemProgram } from "@solana/web3.js";  // Added SystemProgram import

describe("meme-tokens", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  let meme_name = "tushar";
  let supply = new anchor.BN(1000000000);
  let decimals = 9;

  const program = anchor.workspace.memeTokens as Program<MemeTokens>;
  const provider = anchor.getProvider();

  it("should create a token with 1000000000 supply and 9 decimals", async () => {

    const mint = Keypair.generate();
    
    // Fixed syntax - missing comma and proper method call
    const [token_account] = PublicKey.findProgramAddressSync([
      provider.wallet.publicKey.toBuffer(),
      TOKEN_PROGRAM_ID.toBuffer(),
      mint.publicKey.toBuffer(),
    ], ASSOCIATED_TOKEN_PROGRAM_ID);  // Added comma and semicolon
    
    const [metadata_account] = PublicKey.findProgramAddressSync(
      [Buffer.from("token_metadata"), Buffer.from(meme_name)], 
      program.programId
    );
    
    const tx = await program.methods.createToken(meme_name, supply, decimals).accounts({
      payer: provider.wallet.publicKey,
      mint: mint.publicKey,
      tokenAccount: token_account,  // Fixed: should be camelCase
      tokenMetadata: metadata_account,  // Fixed: should be camelCase
      tokenProgram: TOKEN_PROGRAM_ID,  // Fixed: should be camelCase
      associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,  // Fixed: should be camelCase
      systemProgram: SystemProgram.programId,  // Fixed: should be camelCase
    }).signers([mint]).rpc();

    console.log(tx);
    
    const data = await program.account.tokenMetadata.fetch(metadata_account);
    console.log(data);

    console.log("Your transaction signature", tx);
  });
});