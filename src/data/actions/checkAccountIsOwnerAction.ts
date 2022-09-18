import {checkIsOwner} from "../reducers/basicActionUserReducer";
import UserData from "../../domain/entity/model/UserData";

export default checkIsOwner

export const isOwnerSelector = ((state: {action: UserData}) => state.action.accountIsOwner)