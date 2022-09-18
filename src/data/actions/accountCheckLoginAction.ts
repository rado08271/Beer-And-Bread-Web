import {accountLogin} from "../reducers/accountLoginReducer";
import SessionData from "../../domain/entity/model/SessionData";

export default accountLogin

export const accountLoggedIn = (state: SessionData) => state.logged
export const accountAddress = (state: SessionData) => state.address
export const accountError = (state: SessionData) => state.error
export const loading = (state: SessionData) => state.stateRequest

