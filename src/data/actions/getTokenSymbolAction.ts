import {getTokenSymbol} from "../reducers/basicActionTokenReducer";
import TokenData from "../../domain/entity/model/TokenData";

export default getTokenSymbol;

export const tokenSymbolSelector = ((state: { token: TokenData }) => state.token.tokenSymbol)
