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
    <div className="min-h-screen p-4 sm:p-8">
      {/* Header */}
      <header className="max-w-6xl mx-auto mb-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Meme Token Creator
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Create and manage your own meme tokens on Solana blockchain. 
            Connect your wallet and start building the next viral token!
          </p>
        </div>
        
        <WalletButton />
      </header>

      {/* Navigation Tabs */}
      <div className="max-w-4xl mx-auto mb-8">
        <div className="flex justify-center">
          <div className="bg-white rounded-lg p-1 shadow-lg border border-gray-200">
            <button
              type="button"
              onClick={() => setActiveTab('create')}
              className={`flex items-center gap-2 px-6 py-3 rounded-md font-medium transition-all duration-200 ${
                activeTab === 'create'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              <Coins className="w-4 h-4" />
              Create Token
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('search')}
              className={`flex items-center gap-2 px-6 py-3 rounded-md font-medium transition-all duration-200 ${
                activeTab === 'search'
                  ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              <Search className="w-4 h-4" />
              Search Tokens
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto">
        {activeTab === 'create' ? (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Create Your Meme Token</h2>
              <p className="text-gray-600">
                Fill in the details below to create your custom meme token on Solana
              </p>
            </div>
            <CreateTokenForm />
          </div>
        ) : (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Search Token Metadata</h2>
              <p className="text-gray-600">
                Enter a token name to view its metadata and information
              </p>
            </div>
            <TokenMetadataViewer />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="max-w-6xl mx-auto mt-16 pt-8 border-t border-gray-200">
        <div className="text-center text-gray-500">
          <p className="mb-2">Built with ❤️ for the Solana ecosystem</p>
          <p className="text-sm">
            Make sure you're connected to Solana Devnet for testing
          </p>
        </div>
      </footer>
    </div>
  );
}
