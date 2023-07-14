import Web3 from "web3";
import { ethers } from "ethers";
import { CHAINS } from "../context/constants";

export const ContractCallState = {
  NEW: "NEW",
  FETCHING: "FETCHING",
  SUCCESS: "SUCCESS",
  ERROR: "ERROR"
};

export const Web3AlchemyProvider = new Web3(
  new Web3.providers.HttpProvider(CHAINS.GOERLI.rpcUrl)
);

export const AlchemyProvider = new ethers.providers.JsonRpcProvider(
  CHAINS.GOERLI.rpcUrl
);
