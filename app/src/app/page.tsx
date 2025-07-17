'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { Coins, Search, Sparkles, Loader2 } from 'lucide-react';

// Dynamically import components that use wallet functionality
const WalletButton = dynamic(() => import('./components/WalletButton'), {
  ssr: false,
  loading: () => (
    <div className="flex justify-center">
      <button type="button" className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg font-semibold px-6 py-3 text-white flex items-center gap-2">
        <Loader2 className="w-4 h-4 animate-spin" />
        Loading Wallet...
      </button>
    </div>
  ),
});

const CreateTokenForm = dynamic(() => import('./components/CreateTokenForm'), {
  ssr: false,
  loading: () => (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
      </div>
    </div>
  ),
});

const TokenMetadataViewer = dynamic(() => import('./components/TokenMetadataViewer'), {
  ssr: false,
  loading: () => (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    </div>
  ),
});

export default function Home() {
  const [activeTab, setActiveTab] = useState<'create' | 'search'>('create');

  return (
    <div className="min-h-screen">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMyMjIiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djZoNnYtNmgtNnptNiA2djZoLTZ2LTZoNnptLTYtMTJ2NmgtNnYtNmg2em0tNiAwdjZoLTZ2LTZoNnptMTIgMHY2aDZWMzRoLTZ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30 dark:opacity-10"></div>
      
      <div className="relative z-10 p-4 sm:p-8">
        {/* Header */}
        <header className="max-w-6xl mx-auto mb-12 animate-fade-in">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur-lg opacity-30"></div>
                <div className="relative p-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl shadow-lg">
                  <Sparkles className="w-10 h-10 text-white" />
                </div>
              </div>
              <h1 className="text-5xl sm:text-6xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
                Meme Token Creator
              </h1>
            </div>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Create and manage your own meme tokens on Solana blockchain. 
              Connect your wallet and start building the next viral token!
            </p>
          </div>
          
          <WalletButton />
        </header>

        {/* Navigation Tabs */}
        <div className="max-w-4xl mx-auto mb-12 animate-slide-up">
          <div className="flex justify-center">
            <div className="card p-2 shadow-lg backdrop-blur-sm bg-card/80">
              <button
                type="button"
                onClick={() => setActiveTab('create')}
                className={`flex items-center gap-3 px-8 py-4 rounded-lg font-semibold transition-all duration-300 ${
                  activeTab === 'create'
                    ? 'gradient-purple-pink text-white shadow-lg transform scale-105'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
              >
                <Coins className="w-5 h-5" />
                Create Token
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('search')}
                className={`flex items-center gap-3 px-8 py-4 rounded-lg font-semibold transition-all duration-300 ${
                  activeTab === 'search'
                    ? 'gradient-blue-cyan text-white shadow-lg transform scale-105'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
              >
                <Search className="w-5 h-5" />
                Search Tokens
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className="max-w-4xl mx-auto animate-fade-in">
          {activeTab === 'create' ? (
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-foreground mb-3">Create Your Meme Token</h2>
                <p className="text-lg text-muted-foreground">
                  Fill in the details below to create your custom meme token on Solana
                </p>
              </div>
              <CreateTokenForm />
            </div>
          ) : (
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-foreground mb-3">Search Token Metadata</h2>
                <p className="text-lg text-muted-foreground">
                  Enter a token name to view its metadata and information
                </p>
              </div>
              <TokenMetadataViewer />
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="max-w-6xl mx-auto mt-20 pt-8 border-t border-border">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse"></div>
              <p className="text-muted-foreground font-medium">
                Built with ❤️ for the Solana ecosystem
              </p>
              <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full animate-pulse"></div>
            </div>
            <p className="text-sm text-muted-foreground/80">
              Make sure you're connected to Solana Devnet for testing
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
