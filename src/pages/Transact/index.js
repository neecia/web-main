import React from "react";
import Connector from "../../context/WalletConnector/Connector";
import WalletIcon from "../../assets/images/global_icon_wallet.png";
import useUserBalance from "../../web3/hooks/useUserBalance";
import { Loading } from "../../components/Loading";
import useSigmaCurrencyInput from "../../hooks/TextField/useSigmaCurrencyInput";
import SigmaButton from "../../components/Animation/SigmaButton";
import useBankSendTokenWithSetBank from "../../web3/hooks/Bank/useBankSendTokenWithSetBank";
import useBankBankList from "../../web3/hooks/Bank/ReadOnly/useBankBankList";

import useERC20Balance from "../../web3/hooks/ERC20/useERC20Balance";

import ERC20TokenContract from "../../web3/contracts/ERC20TokenContract";
import useSigmaDidMount from "../../hooks/useSigmaDidMount";
import ERC20Token from "../../web3/contracts/ERC20TokenContract/ERC20Token";

import * as dayjs from "dayjs";
import Bank from "../../web3/contracts/BankContract/Bank";
import useERC20 from "../../web3/hooks/ERC20/useERC20";

const Transact = () => {
  const TO_ADDRESSES = [
    "0xC22d781B8382fdDAB5531e70350A9AdB8586Fc02",
    "0xD92249273F549624a96B0b477ca6018B0b187bbF",
    "0x463A466aaac27685c36cEa31ABFc07dB032d2180",
    "0xB9927e2E0769621b53cc94481B1B934337c836eE"
  ];
  /** Life Cycle */

  let { address, balance, connectWallet, isWalletConnected } =
    Connector.useContainer();

  // const { isLoadingBalance, displayBalance, fetchBalance } =
  //   useERC20Balance(ERC20TokenContract);

  const {
    fetchBalance,
    displayBalance,
    isLoadingBalance,

    /** isApproved */
    isApproved,
    allowanceBN,
    fetchAllowance,

    /** Approve */
    fetchApprove,
    isValidApproveTransaction,
    isLoadingApproveButton,
    isValidTxInERC20
  } = useERC20(ERC20TokenContract);

  const {
    isLoadingBalance: isLoadingUserBalance,
    displayBalance: displayUserBalance,
    fetchBalance: fetchUserBalance
  } = useUserBalance();

  const { isLoadingBankList, displayBankList, fetchBankList } =
    useBankBankList(address);

  const {
    /** Tx */
    isLoadingSendTokenWithSetBankTx,
    isValidSendTokenWithSetBankTx,
    fetchSendTokenWithSetBankTx
  } = useBankSendTokenWithSetBank();

  const {
    inputComponent,
    onClickMax: onClickInputMax,
    weiValue,
    isPositive: isPositiveInput
  } = useSigmaCurrencyInput({
    name: "ETH",
    placeholder: `Value to send`,
    balance: balance
  });

  const [selectedAddress, setSelectedAddress] = React.useState(TO_ADDRESSES[0]);

  useSigmaDidMount(() => {
    fetchUserBalance(selectedAddress);
    fetchBankList();
    fetchBalance(address);
    fetchAllowance(address, Bank.address);
  });

  const handleSelect = (e) => {
    fetchUserBalance(e.target.value);
    setSelectedAddress(e.target.value);
  };

  const onClickSend = async () => {
    if (!isValidTransaction) return;
    fetchSendTokenWithSetBankTx(
      ERC20Token.address,
      selectedAddress,
      weiValue,
      `${dayjs().unix()}`
    )
      .then(() => {
        // 여기서 Log 리셋
        fetchUserBalance(selectedAddress);
        fetchBankList();
        fetchBalance(address);
      })
      .catch((e) => {});
  };

  const onClickApprove = async () => {
    if (!isWalletConnected) return;

    if (!isValidApproveTransaction) return;
    fetchApprove(Bank.address).then(() => {
      fetchAllowance(address, Bank.address);
    });
  };

  /** Validation */
  const isValidTransaction = React.useMemo(() => {
    return isValidTxInERC20 && isPositiveInput && isWalletConnected;
  }, [isValidTxInERC20, isPositiveInput, isWalletConnected]);

  return (
    <section className="w-full  flex flex-col p-[20px] relative">
      {/* {!isWalletConnected && (
        
      )} */}
      <div className="text-[32px] mb-[20px] font-bold">Bank</div>
      <div className="flex flex-col items-center w-[510px]">
        <div className="flex flex-col w-full p-[10px] border-[1px] border-black rounded-md">
          <div className="font-semibold text-[24p]">From</div>
          {isWalletConnected ? (
            <div className="flex flex-col ">
              {" "}
              <div>{`Account Info: ${address}`}</div>
              {isLoadingBalance ? (
                <Loading />
              ) : (
                <div className="">{`Balance: ${displayBalance}`}</div>
              )}
            </div>
          ) : (
            <div
              className="w-fit flex justify-center items-center cursor-pointer bg-black p-[7px] rounded-md"
              onClick={() => {
                connectWallet();
              }}
            >
              <div className="sm:w-[14.6px] sm:h-[12px] w-[12.16px] h-[10px] flex">
                <img src={WalletIcon} alt="icon" />
              </div>
              <p className="sm:text-[12px] sm:ml-[10px] text-[10px] ml-[8px] text-white">
                Connect Wallet
              </p>
            </div>
          )}
        </div>
        <div className="my-[10px] text-[32px]"> ⬇ </div>

        <div className="flex flex-col w-full p-[10px] border-[1px] border-black rounded-md">
          <div className="font-semibold text-[24p]">To</div>
          <div className="flex flex-col">
            {" "}
            <div>Account Info</div>
            <div className="flex border-[1px] border-black w-fit">
              <select
                className=""
                name="cars"
                onChange={handleSelect}
                defaultValue={TO_ADDRESSES[0]}
              >
                {TO_ADDRESSES.map((to_address, index) => (
                  <option key={`toaddress_option-${index}`} value={to_address}>
                    {to_address}
                  </option>
                ))}
              </select>
            </div>
            {isLoadingUserBalance ? (
              <Loading />
            ) : (
              <div>{`Balance: ${displayUserBalance}`}</div>
            )}
          </div>
        </div>
      </div>

      <div className="h-[50px]" />
      <div className="flex items-center w-[510px] border-[1px] border-black p-[5px] rounded-md bg-black">
        <div className="text-white">Value: </div>
        <div className={`flex  w-full`}>
          {inputComponent}
          <div
            className={`${
              isValidApproveTransaction ? "" : "cursor-not-allowed opacity-50"
            } mr-[5px] w-fit px-[5px] flex justify-center items-center transition-all hover:opacity-70 sm:text-[18px] text-[14px] font-medium bg-white text-black rounded-md`}
            onClick={onClickApprove}
          >
            <SigmaButton>Approve</SigmaButton>
          </div>
          <div
            className={`${
              isValidTransaction ? "" : "cursor-not-allowed opacity-50"
            } sm:min-w-[60px] min-w-[50px] flex justify-center items-center  transition-all hover:opacity-70 sm:text-[18px] text-[14px] font-medium bg-white text-black rounded-md`}
            onClick={onClickSend}
          >
            <SigmaButton className={``}>Send</SigmaButton>
          </div>
        </div>
      </div>
      <div className="h-[50px]" />
      <div className="flex flex-col w-[510px]">
        <div>Log</div>
        <div className="flex items-center w-full border-[1px] border-black p-[5px]">
          {isLoadingSendTokenWithSetBankTx ? (
            <>
              <p className="mr-[5px]">Transaction Loading...</p>
              <Loading />
            </>
          ) : (
            <p>Please send value</p>
          )}
        </div>
      </div>
      <div className="flex flex-col w-[900px] mt-[10px] border-[1px] border-black py-[5px]">
        <LogHeaderRow />
        {isLoadingBankList ? (
          <Loading />
        ) : (
          displayBankList.map((bankItem, index) => {
            return (
              <LogItemRow
                count={index + 1}
                to={bankItem.to}
                amount={bankItem.amount}
                time={bankItem.time}
              />
            );
          })
        )}
      </div>
    </section>
  );
};

const LogHeaderRow = () => {
  return (
    <div className={` w-full flex justify-evenly items-center`}>
      <div className="text-center w-[10%] border-[1px] border-black">Count</div>
      <div className="text-center w-[54%] border-[1px] border-black">To</div>
      <div className="text-center w-[10%] border-[1px] border-black">
        Amount
      </div>
      <div className="text-center w-[22%] border-[1px] border-black">Time</div>
    </div>
  );
};

const LogItemRow = ({ count, to, amount, time }) => {
  return (
    <div className={` w-full flex justify-evenly items-center mt-[5px]`}>
      <div className="text-center w-[10%] border-[1px] border-black">
        {count}
      </div>
      <div className="text-center w-[54%] border-[1px] border-black">{to}</div>
      <div className="text-center w-[10%] border-[1px] border-black">
        {amount}
      </div>
      <div className="text-center w-[22%] border-[1px] border-black">
        {time}
      </div>
    </div>
  );
};

export default Transact;
