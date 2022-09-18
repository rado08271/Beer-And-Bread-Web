import {basicActionTokenSlice} from "../reducers/basicActionTokenReducer";
import TokenData from "../../domain/entity/model/TokenData";

const {businessToPay} = basicActionTokenSlice.actions
export default businessToPay

export const businessToPaySelector = ((state: { token: TokenData }) => state.token.businessToPay)
export const businessAddressToPaySelector = ((state: { token: TokenData }) => state.token.businessToPay?.owner)