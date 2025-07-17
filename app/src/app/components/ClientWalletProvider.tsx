'use client';

import { ReactNode, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import the WalletContextProvider
const WalletContextProvider = dynamic(
  () => import('../contexts/WalletContextProvider'),
  { ssr: false }
);

interface ClientWalletProviderProps {
  children: ReactNode;
}

export default function ClientWalletProvider({ children }: ClientWalletProviderProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // During SSR, just render children without the wallet context
  if (!mounted) {
    return <>{children}</>;
  }

  // Once mounted on client, render with wallet context
  return <WalletContextProvider>{children}</WalletContextProvider>;
}