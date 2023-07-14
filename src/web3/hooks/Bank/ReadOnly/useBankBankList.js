import React from "react";
import { ethers } from "ethers";
import BankContract from "../../../contracts/BankContract";
import { ContractCallState } from "../../../constants";
import useConstantProperties from "../../useConstantProperties";
import useNumericTokenConstants from "../../useNumericTokenConstants";
import * as dayjs from "dayjs";

export default function useBankBankList(fromAddress) {
  /** bankList */
  const [bankList, setBankList] = React.useState(null);
  const [bankListState, setBankListState] = React.useState(
    ContractCallState.NEW
  );

  const fetch = async () => {
    try {
      setBankListState(ContractCallState.FETCHING);
      let bankList = await BankContract.getAllbankInfos({
        from: fromAddress
      });

      setBankListState(ContractCallState.SUCCESS);
      setBankList(bankList);
    } catch (error) {
      console.error(error.message);
      setBankListState(ContractCallState.ERROR);
      setBankList(null);
    }
  };
  const { isCallSuccess, isLoading } = useConstantProperties(bankListState);

  const isValidBankList = React.useMemo(() => {
    return isCallSuccess && Array.isArray(bankList);
  }, [isCallSuccess, bankList]);

  const displayBankList = React.useMemo(() => {
    if (!isValidBankList) return [];
    return bankList.map((bank) => {
      const { from, to, amount, Time } = bank;
      return {
        from,
        to,
        amount: ethers.utils.formatEther(amount),
        time: Time ? dayjs.unix(Time).format("YYYY MM DD HH:mm") : "-"
      };
    });
  }, [isValidBankList, bankList]);

  return {
    bankList,
    isLoadingBankList: isLoading,
    isCallSuccessBankList: isCallSuccess,
    isValidBankList,
    displayBankList,
    fetchBankList: fetch
  };
}
