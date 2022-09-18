import {getMicroeconomicsOwner} from "../reducers/basicActionTokenReducer";
import TokenData from "../../domain/entity/model/TokenData";

export default getMicroeconomicsOwner

export const microeconomicsOwnerAddressSelector = ((state: {token: TokenData}) => state.token.ownerAddress)