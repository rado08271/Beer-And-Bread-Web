import {getAllBusinesses} from "../reducers/basicActionTokenReducer";
import TokenData from "../../domain/entity/model/TokenData";

export default getAllBusinesses

export const businessesSelector = ((state: { token: TokenData }) => state.token.businesses)
