import {basicActionUserSlice} from "../reducers/basicActionUserReducer";
import UserData from "../../domain/entity/model/UserData";

const {loggedUserAddress} = basicActionUserSlice.actions
export default loggedUserAddress

export const loggedAccountAddressSelector = (state: {action: UserData}) => state.action.loggedAccountAddress

