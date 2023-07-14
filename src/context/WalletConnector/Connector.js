import React, { useContext } from "react";

import { createContainer } from "unstated-next";
import { useConnectWallet, useSetChain, useWallets } from "@web3-onboard/react";
import { ethers } from "ethers";
import { CHAINS } from "../constants";
import Web3 from "web3";

const useConnector = () => {
  const [{ wallet, connecting }, connect, disconnect] = useConnectWallet();
  const [
    {
      chains, // the list of chains that web3-onboard was initialized with
      connectedChain, // the current chain the user's wallet is connected to
      settingChain // boolean indicating if the chain is in the process of being set
    },
    setChain // function to call to initiate user to switch chains in their wallet
  ] = useSetChain();
  const [ethersProvider, setProvider] = React.useState(null);
  const [web3Provider, setWeb3Provider] = React.useState(null);
  const connectedWallets = useWallets();

  React.useEffect(() => {
    if (wallet?.provider) {
      setWeb3Provider(new Web3(wallet.provider));
      setProvider(new ethers.providers.Web3Provider(wallet.provider, "any"));
    } else {
      setWeb3Provider(null);
      setProvider(null);
    }
  }, [wallet]);

  /** Wallet Handlers */
  const connectWallet = React.useCallback(
    async (connectInfo = null) => {
      try {
        await connect(connectInfo);
        await setChain({
          chainId: CHAINS.GOERLI.id
        });
      } catch (e) {
        console.log(e);
      }
    },
    [wallet]
  );

  const disconnectWallet = React.useCallback(async () => {
    try {
      await disconnect({ label: wallet.label });
    } catch (e) {
      console.log(e);
    }
  }, [wallet]);

  const readyToTransact = React.useCallback(async () => {
    if (!wallet) {
      const walletSelected = await connect();
      if (!walletSelected) return false;
    }

    if (!ethersProvider) return false;

    await setChain({ chainId: CHAINS.GOERLI.id });

    return true;
  }, [wallet, ethersProvider]);

  /** Wallet Values */
  const address = React.useMemo(() => {
    return wallet?.accounts[0]?.address;
  }, [wallet]);

  const balance = React.useMemo(() => {
    return wallet?.accounts[0]?.balance?.ETH
      ? wallet?.accounts[0]?.balance?.ETH
      : "0";
  }, [wallet, wallet?.accounts]);

  /** Transaction */
  const signer = React.useMemo(() => {
    return ethersProvider ? ethersProvider.getUncheckedSigner() : null;
  }, [ethersProvider]);

  /** Validations */
  const isWalletConnected = React.useMemo(() => {
    return wallet ? true : false;
  }, wallet);

  return {
    wallet,
    connecting,
    connectWallet,
    disconnectWallet,
    readyToTransact,

    address,
    balance,

    connectedWallets,

    ethersProvider,
    web3Provider,
    signer,
    isWalletConnected
  };
};

let Connector = createContainer(useConnector);

export default Connector;
