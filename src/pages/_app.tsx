import { createWagmiConfig } from "@/config/wagmiConfig";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { WagmiProvider } from "wagmi";
import AppLayout from "../component/AppLayout";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useMemo } from "react";

const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  const config = useMemo(() => createWagmiConfig(), []);
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <AppLayout>
          <Component {...pageProps} />
        </AppLayout>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
