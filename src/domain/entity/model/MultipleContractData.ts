import RootState from "./RootState";
import Contract from '../contractDto'

export default interface MultipleContractData extends RootState {
    contracts: Contract[]
}