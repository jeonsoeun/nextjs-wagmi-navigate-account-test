import { EIP1193Provider } from "viem";

declare global {
  interface Window {
    okxwallet: EIP1193Provider | undefined;
    coinbaseWalletExtension?: EIP1193Provider | undefined;
    ethereum?: (EIP1193Provider & { isMetaMask?: boolean }) | undefined;
    phantom?: { ethereum: EIP1193Provider | undefined } | undefined;
  }
}
