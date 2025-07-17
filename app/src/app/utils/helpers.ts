export const truncateAddress = (address: string, chars = 4): string => {
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
};

export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat().format(num);
};

export const formatTokenAmount = (amount: number, decimals: number): string => {
  const formatted = amount / Math.pow(10, decimals);
  return formatNumber(formatted);
};

export const validateTokenName = (name: string): string | null => {
  if (!name.trim()) {
    return 'Token name is required';
  }
  if (name.length > 32) {
    return 'Token name must be 32 characters or less';
  }
  if (!/^[a-zA-Z0-9\s_-]+$/.test(name)) {
    return 'Token name can only contain letters, numbers, spaces, underscores, and hyphens';
  }
  return null;
};

export const validateSupply = (supply: string): string | null => {
  const num = parseFloat(supply);
  if (isNaN(num) || num <= 0) {
    return 'Supply must be a positive number';
  }
  if (num > Number.MAX_SAFE_INTEGER) {
    return 'Supply is too large';
  }
  return null;
};

export const getExplorerUrl = (signature: string, cluster = 'devnet'): string => {
  return `https://explorer.solana.com/tx/${signature}?cluster=${cluster}`;
};