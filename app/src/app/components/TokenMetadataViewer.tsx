'use client';

import { useState } from 'react';
import { useMemeTokenProgram } from '../hooks/useMemeTokenProgram';
import { TokenMetadata } from '../types';
import { Search, Loader2, Info, Copy, CheckCircle } from 'lucide-react';

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
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg">
          <Info className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Token Metadata Viewer</h2>
      </div>

      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={tokenName}
            onChange={(e) => setTokenName(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            placeholder="Enter token name to search"
            required
          />
          <button
            type="submit"
            disabled={loading || !connected}
            className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold py-2 px-6 rounded-lg hover:from-blue-600 hover:to-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Search className="w-4 h-4" />
            )}
            Search
          </button>
        </div>
      </form>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {metadata && (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-lg border border-blue-200">
            <h3 className="text-lg font-semibold text-blue-800 mb-3">Token Information</h3>
            
            <div className="grid gap-3">
              <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                <span className="font-medium text-gray-700">Name:</span>
                <div className="flex items-center gap-2">
                  <span className="text-gray-900 font-mono">{metadata.memeName}</span>
                  <button
                    onClick={() => copyToClipboard(metadata.memeName, 'name')}
                    className="p-1 hover:bg-gray-100 rounded transition-colors"
                  >
                    {copiedField === 'name' ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                <span className="font-medium text-gray-700">Supply:</span>
                <span className="text-gray-900 font-mono">
                  {formatSupply(metadata.supply, metadata.decimals)}
                </span>
              </div>

              <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                <span className="font-medium text-gray-700">Decimals:</span>
                <span className="text-gray-900 font-mono">{metadata.decimals}</span>
              </div>

              <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                <span className="font-medium text-gray-700">Mint Address:</span>
                <div className="flex items-center gap-2">
                  <span className="text-gray-900 font-mono text-sm">
                    {metadata.mint.slice(0, 8)}...{metadata.mint.slice(-8)}
                  </span>
                  <button
                    onClick={() => copyToClipboard(metadata.mint, 'mint')}
                    className="p-1 hover:bg-gray-100 rounded transition-colors"
                  >
                    {copiedField === 'mint' ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                <span className="font-medium text-gray-700">Authority:</span>
                <div className="flex items-center gap-2">
                  <span className="text-gray-900 font-mono text-sm">
                    {metadata.authority.slice(0, 8)}...{metadata.authority.slice(-8)}
                  </span>
                  <button
                    onClick={() => copyToClipboard(metadata.authority, 'authority')}
                    className="p-1 hover:bg-gray-100 rounded transition-colors"
                  >
                    {copiedField === 'authority' ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                <span className="font-medium text-gray-700">Status:</span>
                <span className={`px-2 py-1 rounded-full text-sm font-medium ${
                  metadata.isInitialized 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {metadata.isInitialized ? 'Initialized' : 'Not Initialized'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {!connected && (
        <div className="text-center p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-yellow-800">Please connect your wallet to search for tokens</p>
        </div>
      )}
    </div>
  );
}