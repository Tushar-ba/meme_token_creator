# Meme Token Creator Frontend

A sleek and modern frontend for creating and managing meme tokens on the Solana blockchain.

## Features

- 🚀 **Create Meme Tokens**: Easy-to-use form for creating custom meme tokens
- 🔍 **Token Search**: Search and view metadata for existing tokens
- 💰 **Wallet Integration**: Seamless connection with Solana wallets (Phantom, Solflare)
- 🎨 **Modern UI**: Beautiful gradient design with responsive layout
- ⚡ **Real-time Updates**: Live transaction status and confirmations
- 📱 **Mobile Friendly**: Fully responsive design for all devices

## Tech Stack

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Solana Web3.js** - Solana blockchain interaction
- **Anchor Framework** - Solana program framework
- **Wallet Adapter** - Solana wallet integration
- **Lucide React** - Beautiful icons

## Prerequisites

- Node.js 18+ installed
- A Solana wallet (Phantom, Solflare, etc.)
- SOL tokens on Devnet for testing

## Installation

1. Navigate to the app directory:
```bash
cd app
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

### Creating a Token

1. **Connect Wallet**: Click the wallet button to connect your Solana wallet
2. **Fill Form**: Enter your token details:
   - **Token Name**: Unique name for your meme token (max 32 characters)
   - **Initial Supply**: Number of tokens to mint initially
   - **Decimals**: Token precision (0-9, default is 9)
3. **Create Token**: Click "Create Token" and approve the transaction
4. **Success**: Your token will be created and you'll receive the transaction details

### Searching Tokens

1. **Switch Tab**: Click on "Search Tokens" tab
2. **Enter Name**: Type the exact token name you want to search
3. **View Details**: See comprehensive token metadata including:
   - Mint address
   - Authority
   - Supply and decimals
   - Initialization status

## Network Configuration

The app is configured to use **Solana Devnet** by default. Make sure your wallet is also set to Devnet.

To get Devnet SOL for testing:
1. Visit [Solana Faucet](https://faucet.solana.com/)
2. Enter your wallet address
3. Request SOL tokens

## Project Structure

```
app/
├── src/app/
│   ├── components/          # React components
│   │   ├── WalletButton.tsx
│   │   ├── CreateTokenForm.tsx
│   │   └── TokenMetadataViewer.tsx
│   ├── contexts/           # React contexts
│   │   └── WalletContextProvider.tsx
│   ├── hooks/              # Custom hooks
│   │   └── useMemeTokenProgram.ts
│   ├── idl/                # Program IDL
│   │   └── meme_tokens.json
│   ├── types/              # TypeScript types
│   │   └── index.ts
│   ├── utils/              # Utility functions
│   │   ├── constants.ts
│   │   └── helpers.ts
│   ├── globals.css         # Global styles
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Main page
└── package.json
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Troubleshooting

### Common Issues

1. **Wallet Connection Issues**
   - Make sure your wallet extension is installed and unlocked
   - Switch to Devnet in your wallet settings

2. **Transaction Failures**
   - Ensure you have enough SOL for transaction fees
   - Check that you're on the correct network (Devnet)

3. **Token Not Found**
   - Verify the exact token name spelling
   - Make sure the token was created successfully

### Error Messages

- **"Wallet not connected"**: Connect your wallet first
- **"Token not found"**: The token name doesn't exist or wasn't created yet
- **"Insufficient funds"**: Add more SOL to your wallet

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the MIT License.