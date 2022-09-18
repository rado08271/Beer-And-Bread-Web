import AbiData from "../../domain/entity/model/AbiData";
import ContractData from "../../domain/entity/model/ContractData";
import {getAbiById} from "../reducers/abiReducer";

export default getAbiById

export const contractAbiSelector = ((state: { contract: ContractData, abi: AbiData } | AbiData) => ("abi" in state.abi) ? state.abi.abi.contract : state.abi.contract)
