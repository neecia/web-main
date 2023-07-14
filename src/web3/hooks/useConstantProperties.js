import React from "react";
import { ContractCallState } from "../constants";

export default function useConstantProperties(constractCallState) {
  const isCallSuccess = React.useMemo(
    () => constractCallState === ContractCallState.SUCCESS,
    [constractCallState]
  );

  const isLoading = React.useMemo(
    () => constractCallState === ContractCallState.FETCHING,
    [constractCallState]
  );

  return {
    isCallSuccess,
    isLoading
  };
}
