import { ConnectorId } from "@/config/connectorIds";

import { ReactNode, useEffect } from "react";
import { useAccount, useConnect } from "wagmi";

const AppLayout = ({ children }: { children: ReactNode }) => {
  const { connect, connectors } = useConnect();
  const { address } = useAccount();
  useEffect(() => {
    console.log("AppLayout useEffect");
  }, []);
  useEffect(() => {
    console.log("AppLayout useEffect address:", address);
  }, [address]);
  return (
    <div>
      <div>
        <button
          onClick={() => {
            const connector = connectors.find(
              (c) => c.id === ConnectorId.Metamask
            );
            if (connector) {
              connect({
                connector: connector,
              });
            }
          }}
        >
          {address ? address : "connect"}
        </button>
      </div>
      {children}
    </div>
  );
};
export default AppLayout;
