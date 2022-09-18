import {getRevenue} from "../reducers/basicActionUserReducer";
import UserData from "../../domain/entity/model/UserData";

export default getRevenue

export const revenueSelector = (state: {action: UserData}) => state.action.revenueData
