import React from "react";
import useConstantProperties from "./useConstantProperties";
import { Web3AlchemyProvider, ContractCallState } from "../constants";
import useNumericTokenConstants from "./useNumericTokenConstants";
import ERC20Token from "../contracts/ERC20TokenContract/ERC20Token";

export default function useUserBalance() {
  /** balance */
  const [balance, setBalance] = React.useState(null);
  const [balanceState, setBalanceState] = React.useState(ContractCallState.NEW);

  const fetch = async (address) => {
    try {
      setBalanceState(ContractCallState.FETCHING);
      const contract = new Web3AlchemyProvider.eth.Contract(
        ERC20Token.abi,
        ERC20Token.address
      );
      let balance = await contract.methods.balanceOf(address).call();
      setBalanceState(ContractCallState.SUCCESS);
      setBalance(Web3AlchemyProvider.utils.fromWei(balance, "ether"));
    } catch (error) {
      console.error(error.message);
      setBalanceState(ContractCallState.ERROR);
      setBalance(null);
    }
  };

  const { isCallSuccess, isLoading } = useConstantProperties(balanceState);
  const { bn, isValid, isPositive, numbered, display, displayNumberFormat } =
    useNumericTokenConstants(balance, isCallSuccess);

  return {
    balance,
    balanceState,
    isLoadingBalance: isLoading,
    isCallSuccessBalance: isCallSuccess,

    balanceBN: bn,
    isValidBalance: isValid,
    isPositiveBalance: isPositive,
    numberedBalance: numbered,
    displayBalance: display,
    displayNumberFormatBalance: displayNumberFormat,

    fetchBalance: fetch
  };
}
