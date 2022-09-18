import {checkIsActive} from "../reducers/basicActionUserReducer";
import UserData from "../../domain/entity/model/UserData";

export default checkIsActive

export const isActiveSelector = ((state: {action: UserData}) => state.action.accountIsActive)