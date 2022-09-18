import RootState from "./RootState";
import Abi from "../abiDto";

export default interface AccountData extends RootState {
    abi: Abi
}