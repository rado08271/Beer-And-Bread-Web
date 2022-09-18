import {getDefinedArea} from "../reducers/basicActionTokenReducer";
import ContractData from "../../domain/entity/model/ContractData";
import AbiData from "../../domain/entity/model/AbiData";
import TokenData from "../../domain/entity/model/TokenData";

export default getDefinedArea;

export const definedAreaSelector = ((state: { token: TokenData }) => state.token.definedArea)
