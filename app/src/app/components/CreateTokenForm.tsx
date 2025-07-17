'use client';

import { useState } from 'react';
import { useMemeTokenProgram } from '../hooks/useMemeTokenProgram';
import { CreateTokenForm as FormData } from '../types';
import { Coins, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

export default function CreateTokenForm() {
  const { createToken, connected, publicKey } = useMemeTokenProgram();
  
  // Debug wallet connection status
  console.log('Wallet connected:', connected);
  console.log('Wallet public key:', publicKey?.toString());
  const [formData, setFormData] = useState<FormData>({
    memeName: '',
    supply: '',
    decimals: 9,
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    type: 'success' | 'error';
    message: string;
    data?: any;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!connected) {
      setResult({
        type: 'error',
        message: 'Please connect your wallet first',
      });
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const supply = parseInt(formData.supply) * Math.pow(10, formData.decimals);
      const txResult = await createToken(formData.memeName, supply, formData.decimals);
      
      setResult({
        type: 'success',
        message: 'Token created successfully!',
        data: txResult,
      });
      
      // Reset form
      setFormData({
        memeName: '',
        supply: '',
        decimals: 9,
      });
    } catch (error: any) {
      setResult({
        type: 'error',
        message: error.message || 'Failed to create token',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto">
      <div className="card card-hover p-8 backdrop-blur-sm bg-card/90 animate-slide-up">
        <div className="flex items-center gap-4 mb-8">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl blur-md opacity-30"></div>
            <div className="relative p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl">
              <Coins className="w-7 h-7 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-foreground">Create Meme Token</h2>
        </div>

        {!connected && (
          <div className="mb-6 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
              <p className="text-amber-800 dark:text-amber-200 font-medium">
                Please connect your wallet to create a token
              </p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-foreground">
              Token Name
            </label>
            <input
              type="text"
              value={formData.memeName}
              onChange={(e) => setFormData({ ...formData, memeName: e.target.value })}
              className="input w-full h-12 text-lg focus-ring"
              placeholder="Enter your meme token name"
              required
              maxLength={32}
            />
            <p className="text-xs text-muted-foreground">Max 32 characters</p>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-foreground">
              Initial Supply
            </label>
            <input
              type="number"
              value={formData.supply}
              onChange={(e) => setFormData({ ...formData, supply: e.target.value })}
              className="input w-full h-12 text-lg focus-ring"
              placeholder="1000000"
              required
              min="0"
            />
            <p className="text-xs text-muted-foreground">Number of tokens to mint initially</p>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-foreground">
              Decimals
            </label>
            <select
              value={formData.decimals}
              onChange={(e) => setFormData({ ...formData, decimals: parseInt(e.target.value) })}
              className="input w-full h-12 text-lg focus-ring"
              title="Select token decimals"
            >
              {[0, 2, 6, 8, 9].map((decimal) => (
                <option key={decimal} value={decimal}>
                  {decimal} decimals
                </option>
              ))}
            </select>
            <p className="text-xs text-muted-foreground">Token precision (9 is standard)</p>
          </div>

          <button
            type="submit"
            disabled={loading || !connected}
            className="w-full btn-primary h-14 text-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Creating Token...
              </>
            ) : (
              <>
                <Coins className="w-5 h-5" />
                Create Token
              </>
            )}
          </button>
        </form>

        {result && (
          <div className={`mt-6 p-5 rounded-xl border animate-fade-in ${
            result.type === 'success' 
              ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800' 
              : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
          }`}>
            <div className="flex items-start gap-4">
              {result.type === 'success' ? (
                <CheckCircle className="w-6 h-6 text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
              )}
              <div className="flex-1">
                <p className={`font-semibold text-lg ${
                  result.type === 'success' 
                    ? 'text-emerald-800 dark:text-emerald-200' 
                    : 'text-red-800 dark:text-red-200'
                }`}>
                  {result.message}
                </p>
                {result.data && (
                  <div className="mt-3 space-y-2 text-sm text-emerald-700 dark:text-emerald-300">
                    <div className="p-3 bg-emerald-100 dark:bg-emerald-800/30 rounded-lg">
                      <p className="font-mono break-all">
                        <strong>Signature:</strong> {result.data.signature}
                      </p>
                    </div>
                    <div className="p-3 bg-emerald-100 dark:bg-emerald-800/30 rounded-lg">
                      <p className="font-mono break-all">
                        <strong>Mint Address:</strong> {result.data.mint}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}