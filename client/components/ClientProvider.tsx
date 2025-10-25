'use client';

import {WagmiConfig} from "wagmi";
import {
    RainbowKitProvider,
    getDefaultConfig,
} from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { somniaTestnet } from "viem/chains";

const queryClient = new QueryClient();
const Get_WalletConnect_ID = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID;
const config = getDefaultConfig({
    appName: "Somnia Example App",
    projectId: Get_WalletConnect_ID ?? '',
    chains: [somniaTestnet],
    ssr: true,
});

export default function ClientProvider({ children }:{children:any}) {
    return (
        <WagmiConfig config={config}>
            <QueryClientProvider client={queryClient}>
                <RainbowKitProvider modalSize={'compact'}>{children}</RainbowKitProvider>
            </QueryClientProvider>
        </WagmiConfig>
    );
}