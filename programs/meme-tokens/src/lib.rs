use anchor_lang::prelude::*;
use anchor_spl::{
    token::{mint_to, MintTo, Token, Mint, TokenAccount},
    associated_token::AssociatedToken,
};

declare_id!("838to942ATb6jwyL9fbPxpHk33wfeckvkBhhK9iejhMp");

#[program]
pub mod meme_tokens {
    use super::*;

    pub fn create_token(ctx: Context<CreateToken>, meme_name: String, supply: u64, decimals: u8) -> Result<()> {
        msg!("Creating token: {}", meme_name);
        
        // Initialize token metadata
        let token_metadata = &mut ctx.accounts.token_metadata;
        token_metadata.mint = ctx.accounts.mint.key();
        token_metadata.authority = ctx.accounts.payer.key();
        token_metadata.supply = supply;
        token_metadata.decimals = decimals;
        token_metadata.is_initialized = true;
        token_metadata.bump = ctx.bumps.token_metadata;
        token_metadata.meme_name = meme_name;
        token_metadata.mint_authority = ctx.accounts.payer.key();

        // Call internal mint function to mint initial supply
        if supply > 0 {
            mint_tokens(
                &ctx.accounts.mint.to_account_info(),
                &ctx.accounts.token_account.to_account_info(),
                &ctx.accounts.payer.to_account_info(),
                &ctx.accounts.token_program.to_account_info(),
                supply,
            )?;
        }

        Ok(())
    }
}

fn mint_tokens<'info>(
    mint: &AccountInfo<'info>,
    token_account: &AccountInfo<'info>,
    authority: &AccountInfo<'info>,
    token_program: &AccountInfo<'info>,
    amount: u64,
) -> Result<()> {
    msg!("Minting {} tokens", amount);
    
    // Create CPI context for mint_to instruction
    let cpi_accounts = MintTo {
        mint: mint.clone(),
        to: token_account.clone(),
        authority: authority.clone(),
    };
    
    let cpi_ctx = CpiContext::new(token_program.clone(), cpi_accounts);
    
    // Call the token program's mint_to instruction
    mint_to(cpi_ctx, amount)?;
    
    Ok(())
}

#[derive(Accounts)]
#[instruction(meme_name: String, supply: u64, decimals: u8)]
pub struct CreateToken<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,
    
    // Use Account<'info, Mint> for proper type checking
    #[account(
        init,
        payer = payer,
        mint::decimals = decimals,
        mint::authority = payer.key(),
        mint::freeze_authority = payer.key(),
    )]
    pub mint: Account<'info, Mint>,
    
    // Use Account<'info, TokenAccount> for proper type checking
    #[account(
        init,
        payer = payer,
        associated_token::mint = mint,
        associated_token::authority = payer,
    )]
    pub token_account: Account<'info, TokenAccount>,
    
    #[account(
        init,
        payer = payer, 
        space = 8 + TokenMetadata::INIT_SPACE,
        seeds = [b"token_metadata", meme_name.as_bytes()],
        bump,
    )]
    pub token_metadata: Account<'info, TokenMetadata>,
    
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
}

#[account]
#[derive(InitSpace)]
pub struct TokenMetadata {
    pub mint: Pubkey,
    pub authority: Pubkey,
    pub supply: u64,
    pub decimals: u8,
    pub is_initialized: bool,
    pub bump: u8,
    pub mint_authority: Pubkey,
    #[max_len(32)]
    pub meme_name: String,
}