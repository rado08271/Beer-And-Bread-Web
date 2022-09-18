import RootState from "./RootState";
import Contract from '../contractDto'

export default interface ContractData extends RootState {
    contract: Contract
}