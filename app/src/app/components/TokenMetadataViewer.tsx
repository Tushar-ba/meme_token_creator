'use client';

import { useState } from 'react';
import { useMemeTokenProgram } from '../hooks/useMemeTokenProgram';
import { TokenMetadata } from '../types';
import { Search, Loader2, Info, Copy, CheckCircle, AlertCircle } from 'lucide-react';

export default function TokenMetadataViewer() {
  const { getTokenMetadata, connected } = useMemeTokenProgram();
  const [tokenName, setTokenName] = useState('');
  const [loading, setLoading] = useState(false);
  const [metadata, setMetadata] = useState<TokenMetadata | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!connected || !tokenName.trim()) return;

    setLoading(true);
    setError(null);
    setMetadata(null);

    try {
      const result = await getTokenMetadata(tokenName.trim());
      if (result) {
        setMetadata(result);
      } else {
        setError('Token not found or not yet created');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch token metadata');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const formatSupply = (supply: number, decimals: number) => {
    return (supply / Math.pow(10, decimals)).toLocaleString();
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="card card-hover p-8 backdrop-blur-sm bg-card/90 animate-slide-up">
        <div className="flex items-center gap-4 mb-8">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl blur-md opacity-30"></div>
            <div className="relative p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl">
              <Info className="w-7 h-7 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-foreground">Token Metadata Viewer</h2>
        </div>

        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex gap-3">
            <input
              type="text"
              value={tokenName}
              onChange={(e) => setTokenName(e.target.value)}
              className="input flex-1 h-12 text-lg focus-ring"
              placeholder="Enter token name to search"
              required
            />
            <button
              type="submit"
              disabled={loading || !connected}
              className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold py-2 px-6 rounded-lg hover:from-blue-600 hover:to-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2 h-12 min-w-[120px] justify-center"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Search className="w-5 h-5" />
                  Search
                </>
              )}
            </button>
          </div>
        </form>

        {error && (
          <div className="mb-6 p-5 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl animate-fade-in">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
              <p className="text-red-800 dark:text-red-200 font-medium">{error}</p>
            </div>
          </div>
        )}

        {metadata && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-gradient-to-r from-blue-50/50 to-cyan-50/50 dark:from-blue-900/20 dark:to-cyan-900/20 p-6 rounded-xl border border-blue-200 dark:border-blue-800">
              <h3 className="text-xl font-bold text-blue-800 dark:text-blue-300 mb-4">Token Information</h3>
              
              <div className="grid gap-3">
                <div className="flex justify-between items-center p-4 bg-card rounded-lg border border-border">
                  <span className="font-medium text-foreground">Name:</span>
                  <div className="flex items-center gap-2">
                    <span className="text-foreground font-mono">{metadata.memeName}</span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(metadata.memeName, 'name')}
                      className="p-1.5 hover:bg-muted rounded-md transition-colors"
                      aria-label="Copy token name"
                    >
                      {copiedField === 'name' ? (
                        <CheckCircle className="w-4 h-4 text-green-500 dark:text-green-400" />
                      ) : (
                        <Copy className="w-4 h-4 text-muted-foreground" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex justify-between items-center p-4 bg-card rounded-lg border border-border">
                  <span className="font-medium text-foreground">Supply:</span>
                  <span className="text-foreground font-mono">
                    {formatSupply(metadata.supply, metadata.decimals)}
                  </span>
                </div>

                <div className="flex justify-between items-center p-4 bg-card rounded-lg border border-border">
                  <span className="font-medium text-foreground">Decimals:</span>
                  <span className="text-foreground font-mono">{metadata.decimals}</span>
                </div>

                <div className="flex justify-between items-center p-4 bg-card rounded-lg border border-border">
                  <span className="font-medium text-foreground">Mint Address:</span>
                  <div className="flex items-center gap-2">
                    <span className="text-foreground font-mono text-sm">
                      {metadata.mint.slice(0, 8)}...{metadata.mint.slice(-8)}
                    </span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(metadata.mint, 'mint')}
                      className="p-1.5 hover:bg-muted rounded-md transition-colors"
                      aria-label="Copy mint address"
                    >
                      {copiedField === 'mint' ? (
                        <CheckCircle className="w-4 h-4 text-green-500 dark:text-green-400" />
                      ) : (
                        <Copy className="w-4 h-4 text-muted-foreground" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex justify-between items-center p-4 bg-card rounded-lg border border-border">
                  <span className="font-medium text-foreground">Authority:</span>
                  <div className="flex items-center gap-2">
                    <span className="text-foreground font-mono text-sm">
                      {metadata.authority.slice(0, 8)}...{metadata.authority.slice(-8)}
                    </span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(metadata.authority, 'authority')}
                      className="p-1.5 hover:bg-muted rounded-md transition-colors"
                      aria-label="Copy authority address"
                    >
                      {copiedField === 'authority' ? (
                        <CheckCircle className="w-4 h-4 text-green-500 dark:text-green-400" />
                      ) : (
                        <Copy className="w-4 h-4 text-muted-foreground" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex justify-between items-center p-4 bg-card rounded-lg border border-border">
                  <span className="font-medium text-foreground">Status:</span>
                  <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                    metadata.isInitialized 
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' 
                      : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
                  }`}>
                    {metadata.isInitialized ? 'Initialized' : 'Not Initialized'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {!connected && (
          <div className="p-5 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
              <p className="text-amber-800 dark:text-amber-200 font-medium">
                Please connect your wallet to search for tokens
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}