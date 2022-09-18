import {getTokenName} from "../reducers/basicActionTokenReducer";
import TokenData from "../../domain/entity/model/TokenData";

export default getTokenName;

export const tokenNameSelector = ((state: { token: TokenData }) => state.token.tokenName)
