import React from "react";
import { NumericFormat } from "react-number-format";
import SigmaButton from "../../components/Animation/SigmaButton";
import {
  BN,
  convertToWei,
  convertToSixDecimalWei,
  isBNPositive
} from "../../web3/utils/AKBN";

export default function useSigmaCurrencyInput({
  name,
  className = "w-full rounded-l",
  placeholder,
  balance
}) {
  const [textValue, setTextValue] = React.useState("");

  /** Component */
  const inputComponent = React.useMemo(() => {
    return (
      <div
        className={`relative ${className} bg-black sm:py-[10px] py-[7px] 
      `}
      >
        <NumericFormat
          name={name}
          className={`w-full bg-transparent outline-none border-none px-[10px] text-white`}
          thousandSeparator={true}
          allowNegative={false}
          valueIsNumericString={true}
          value={textValue}
          placeholder={placeholder}
          onValueChange={(values, sourceInfo) => {
            if (sourceInfo.source === "event") {
              setTextValue(values.value);
            }
          }}
        />
      </div>
    );
  }, [textValue, balance]);

  const onClickMax = () => {
    setTextValue(balance);
  };

  // const maxComponent = React.useMemo(() => {
  //   return (
  //     <div
  //       className="sm:min-w-[60px] min-w-[50px] flex justify-center items-center cursor-pointer transition-all hover:opacity-70 sm:text-[18px] text-[14px] font-medium bg-white text-black rounded-md"
  //       onClick={onClickMax}
  //     >
  //       <SigmaButton>Send</SigmaButton>
  //     </div>
  //   );
  // }, [balance]);

  /** Actions */
  const initInput = () => {
    setTextValue("");
  };

  /** Converted Values */
  const bn = React.useMemo(() => BN(textValue), [textValue]);
  const isNaN = React.useMemo(() => bn.isNaN(), [bn]);

  const isValid = React.useMemo(() => !isNaN, [isNaN]);

  const stringValue = React.useMemo(() => {
    if (!isValid) return 0;
    return bn.toString();
  }, [isValid, bn]);

  const numberValue = React.useMemo(() => {
    if (!isValid) return 0;
    return bn.toNumber();
  }, [isValid, bn]);

  const isPositive = React.useMemo(() => {
    return isValid && isBNPositive(bn);
  }, [bn, isValid]);

  const weiValue = React.useMemo(() => {
    if (!isValid) return "0";
    return convertToWei(bn).toString();
  }, [isValid, bn]);

  const mweiValue = React.useMemo(() => {
    if (!isValid) return "0";
    return convertToSixDecimalWei(bn).toString();
  }, [isValid, bn]);

  const isBiggerThanBalance = React.useMemo(() => {
    const balanceBN = BN(balance);
    return bn.gt(balanceBN);
  }, [balance, bn]);

  /** Helpers */
  const isValidTxInInput = React.useMemo(() => {
    return isPositive && !isBiggerThanBalance;
  }, [isPositive, isBiggerThanBalance]);

  return {
    inputComponent,
    // maxComponent,
    initInput,
    onClickMax,
    bn,
    isValid,
    textValue,
    numberValue,
    isPositive,
    stringValue,
    weiValue,
    mweiValue,
    isBiggerThanBalance,
    isValidTxInInput
  };
}
