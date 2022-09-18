import AccountData from "../../domain/entity/model/AccountData";
import {superSlice} from "../reducers/superReducer";

const {doLogout} = superSlice.actions
export default doLogout

export const accountLogoutSelector = (state: {sup: AccountData}) => state.sup.userLogged

