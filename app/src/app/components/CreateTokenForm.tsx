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
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
          <Coins className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Create Meme Token</h2>
      </div>

      {!connected && (
        <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-500 mt-0.5" />
            <p className="text-yellow-800">Please connect your wallet to create a token</p>
          </div>
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Token Name
          </label>
          <input
            type="text"
            value={formData.memeName}
            onChange={(e) => setFormData({ ...formData, memeName: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
            placeholder="Enter your meme token name"
            required
            maxLength={32}
          />
          <p className="text-xs text-gray-500 mt-1">Max 32 characters</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Initial Supply
          </label>
          <input
            type="number"
            value={formData.supply}
            onChange={(e) => setFormData({ ...formData, supply: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
            placeholder="1000000"
            required
            min="0"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Decimals
          </label>
          <select
            value={formData.decimals}
            onChange={(e) => setFormData({ ...formData, decimals: parseInt(e.target.value) })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
            title="Select token decimals"
          >
            {[0, 2, 6, 8, 9].map((decimal) => (
              <option key={decimal} value={decimal}>
                {decimal} decimals
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={loading || !connected}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold py-3 px-4 rounded-lg hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Creating Token...
            </>
          ) : (
            <>
              <Coins className="w-4 h-4" />
              Create Token
            </>
          )}
        </button>
      </form>

      {result && (
        <div className={`mt-4 p-4 rounded-lg ${
          result.type === 'success' 
            ? 'bg-green-50 border border-green-200' 
            : 'bg-red-50 border border-red-200'
        }`}>
          <div className="flex items-start gap-3">
            {result.type === 'success' ? (
              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
            )}
            <div className="flex-1">
              <p className={`font-medium ${
                result.type === 'success' ? 'text-green-800' : 'text-red-800'
              }`}>
                {result.message}
              </p>
              {result.data && (
                <div className="mt-2 text-sm text-green-700">
                  <p><strong>Signature:</strong> {result.data.signature}</p>
                  <p><strong>Mint:</strong> {result.data.mint}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}