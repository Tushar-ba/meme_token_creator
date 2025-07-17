"use client";

import dynamic from "next/dynamic";
import { Loader2, Wallet } from "lucide-react";

const WalletMultiButton = dynamic(
  () =>
    import("@solana/wallet-adapter-react-ui").then(
      (mod) => mod.WalletMultiButton
    ),
  {
    ssr: false,
    loading: () => (
      <div className="flex justify-center">
        <button
          type="button"
          className="relative overflow-hidden bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg font-semibold px-8 py-3 text-white flex items-center gap-3 shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="relative z-10">Loading Wallet...</span>
        </button>
      </div>
    ),
  }
);

export default function WalletButton() {
  return (
    <div className="flex justify-center">
      <div className="relative">
        <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
        <WalletMultiButton className="!relative !bg-gradient-to-r !from-purple-500 !to-pink-500 !rounded-lg !font-semibold !px-8 !py-3 !text-white hover:!from-purple-600 hover:!to-pink-600 !transition-all !duration-300 !shadow-lg hover:!shadow-xl !flex !items-center !gap-3" />
      </div>
    </div>
  );
}
