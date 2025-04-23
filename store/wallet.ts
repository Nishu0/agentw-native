import { create } from "zustand";
import { IToken, Wallet } from "@/types/wallet";
interface IWallet {
    currentWallet: null | Wallet;
    wallets: null | Wallet[];
    tokens: null | IToken[];
    balance: null | number;
    setCurrentWallet: (wallet: Wallet) => void;
    setWallets: (wallets: Wallet[]) => void;
    setTokens: (tokens: IToken[]) => void
    setBalance: (balance: number) => void
}

const useWalletStore = create<IWallet>((set) => ({
    currentWallet: null,
    tokens: null,
    wallets: null,
    balance: null,
    setCurrentWallet: (currentWallet) =>
        set({
            currentWallet: currentWallet,
        }),
    setWallets: (wallets) =>
        set({
            wallets: wallets,
        }),
    setTokens: (tokens) =>
        set({
            tokens: tokens,
        }),
    setBalance: (balance) =>
        set({
            balance: balance,
        }),
}));

export default useWalletStore;