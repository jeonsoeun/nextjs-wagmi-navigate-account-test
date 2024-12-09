import {
  Chain,
  base,
  baseSepolia,
  mainnet,
  sepolia,
  holesky,
} from "wagmi/chains";

import { createConfig, fallback, http } from "wagmi";
import { Transport } from "viem";
import { injected, walletConnect } from "wagmi/connectors";
import { ConnectorId } from "./connectorIds";

export const CHAINS: [Chain, ...Chain[]] = [
  mainnet,
  base,
  baseSepolia,
  mainnet,
  sepolia,
  holesky,
];

// 환경별 HTTP 노드 URL을 처리하는 함수
const getHttpStrings = (chain: Chain): string[] => {
  return chain.rpcUrls.default.http.slice();
};
export const CLIENT_CONFIG = {
  batch: {
    multicall: {
      batchSize: 1024 * 200,
      wait: 16,
    },
  },
  pollingInterval: 6_000,
};

// transports 생성 로직
export const transports = CHAINS.reduce((ts, chain) => {
  // HTTP 노드 URL 목록을 가져옴
  const httpStrings = getHttpStrings(chain);

  // 기존 객체에 새로운 체인 ID와 트랜스포트를 추가
  return {
    ...ts,
    [chain.id]: fallback(httpStrings.map((t: string) => http(t))),
  };
}, {} as Record<number, Transport>);

// MetaMask() 와그미에서 제공하는 걸 사용했을때 용량 이슈가 있어서 아래처럼 사용 했을 가능성 있어서 확인 필요
// https://nextjs.org/docs/app/building-your-application/optimizing/package-bundling
// export const metaMaskConnector = injected({
//   target: "metaMask",
//   shimDisconnect: false,
// });

const connectors = {
  // [ConnectorId.Metamask]: metaMask({ shouldShimWeb3: true,  }),
  [ConnectorId.WalletConnect]: walletConnect({
    projectId: "86c32afc0c37c56b0d2bd72c",
    qrModalOptions: {
      themeVariables: {
        "--wcm-z-index": "9999",
      },
    },
  }),
};

// 다시 로그인할 때 새로운 계정을 선택하도록 강제하고 싶다면 shimDisconnect를 활성화하여, 지갑에 연결된 이전 계정을 자동으로 사용하지 않고, 다시 계정 선택을 요청할 수 있습니다.
export function createWagmiConfig() {
  return createConfig({
    chains: CHAINS,
    ssr: false,
    transports, // 활용, 멀티 콜까지 transport에서 쓰는것들 예제 필요
    ...CLIENT_CONFIG, // 멀티콜 어떻게 쓰는지 예제 필요
    connectors: [
      // connectors[ConnectorId.Metamask],
      connectors[ConnectorId.WalletConnect],
      injected({ shimDisconnect: true }), // 메타마스크, Okx연결은 이걸로 해결. 이유는 Kaia처럼 직접 만들었더니 지갑에서 주소 바꾸면 앱에 적용이 안됨.
    ],
  });
}
