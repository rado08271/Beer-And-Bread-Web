import {unlockAccount} from "../reducers/accountLoginReducer";
import SessionData from "../../domain/entity/model/SessionData";

export default unlockAccount

export const accountUnlockLoadingSelector = ((state: SessionData) => state.unlockAccountLoading)
export const accountUnlockErrorSelector = ((state: SessionData) => state.unlockAccountError)