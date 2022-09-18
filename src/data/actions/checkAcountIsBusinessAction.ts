import {checkIsBusiness} from "../reducers/basicActionUserReducer";
import UserData from "../../domain/entity/model/UserData";

export default checkIsBusiness

export const isBusinessSelector = ((state: {action: UserData}) => state.action.accountIsBusiness)