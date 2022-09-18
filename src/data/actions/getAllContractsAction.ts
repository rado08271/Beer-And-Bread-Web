import {getAllContracts} from "../reducers/contractsReducer";
import MultipleContractData from "../../domain/entity/model/MultipleContractData";

export default getAllContracts

export const allContractAddressesSelector = (state: {contractData: MultipleContractData }) => state.contractData.contracts.map(value => value.contractAccount)
export const allContractsSelector = (state: {contractData: MultipleContractData }) => state.contractData.contracts.map(value => value)
export const allContractIdsSelector = (state: {contractData: MultipleContractData }) => state.contractData.contracts.map(value => value._id)
export const allContractAreasSelector = (state: {contractData: MultipleContractData }) => state.contractData.contracts.map(value => value.deployData.token.area)
