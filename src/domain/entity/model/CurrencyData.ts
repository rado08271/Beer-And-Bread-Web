import RootState from "./RootState";
import Contract from "../contractDto";
import Abi from "../abiDto";

export default interface CurrencyData extends RootState {
    contracts: Contract
    contractAbi: Abi

}