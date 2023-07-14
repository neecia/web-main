import { ethers } from "ethers";
import { AlchemyProvider } from "../../constants";
import ERC20Token from "./ERC20Token";

const ERC20TokenContract = new ethers.Contract(
  ERC20Token.address,
  ERC20Token.abi,
  AlchemyProvider
);

export default ERC20TokenContract;
