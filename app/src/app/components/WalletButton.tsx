"use client";

import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

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
          className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg font-semibold px-6 py-3 text-white flex items-center gap-2"
        >
          <Loader2 className="w-4 h-4 animate-spin" />
          Loading...
        </button>
      </div>
    ),
  }
);

export default function WalletButton() {
  return (
    <div className="flex justify-center">
      <WalletMultiButton className="!bg-gradient-to-r !from-purple-500 !to-pink-500 !rounded-lg !font-semibold !px-6 !py-3 !text-white hover:!from-purple-600 hover:!to-pink-600 !transition-all !duration-200" />
    </div>
  );
}
