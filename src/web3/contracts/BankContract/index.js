import { ethers } from "ethers";
import { AlchemyProvider } from "../../constants";
import Bank from "./Bank";

const BankContract = new ethers.Contract(
  Bank.address,
  Bank.abi,
  AlchemyProvider
);

export default BankContract;
