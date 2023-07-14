import React from "react";
import useDidMount from "./useDidMount";
import Connector from "../context/WalletConnector/Connector";

export default function useSigmaDidMount(
  callback,
  dependencies = [],
  isWalletCheck = true
) {
  const didMount = useDidMount();
  let { isWalletConnected, address } = Connector.useContainer();
  const walletDependencies = isWalletCheck ? [isWalletConnected] : [];

  React.useEffect(() => {
    if (!didMount) return;
    if (isWalletCheck && !isWalletConnected) return;
    if (typeof callback === "function") callback();
  }, [didMount, address, ...dependencies, ...walletDependencies]);
}
