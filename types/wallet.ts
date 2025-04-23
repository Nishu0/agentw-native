export interface IToken {
    address: string;
    price: string;
    name: string;
    symbol: string;
    image: string;
    decimal: number;
    balance: string;
  }
  
  export interface PanoraToken {
    tokenAddress?: string;
    faAddress?: string;
    symbol: string;
    name: string;
    decimals: number;
    logoUrl: string;
    price?: number;
  }
  
  export type Wallet = {
    name: string;
    seed: string | null;
    publicKey: string;
    secretKey: string;
  }