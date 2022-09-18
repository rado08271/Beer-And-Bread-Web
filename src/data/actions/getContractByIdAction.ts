import contractReducer, {getContractById} from "../reducers/contractReducer";
import ContractData from "../../domain/entity/model/ContractData";
import AbiData from "../../domain/entity/model/AbiData";

export default getContractById

export const contractAbiIdSelector = ((state: { contract: ContractData, abi: AbiData } | ContractData) => ("contract" in state.contract) ? state.contract.contract.abiId : state.contract.abiId)
export const contractIdSelector = ((state: { contract: ContractData, abi: AbiData } | ContractData) => ("contract" in state.contract) ? state.contract.contract._id : state.contract._id)
export const contractAddressSelector = ((state: { contract: ContractData, abi: AbiData } | ContractData) => ("contract" in state.contract) ? state.contract.contract.contractAccount : state.contract.contractAccount)