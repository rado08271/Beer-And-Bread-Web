import {basicActionUserSlice} from "../reducers/basicActionUserReducer";
import UserData from "../../domain/entity/model/UserData";

const {addNewEventLogData} = basicActionUserSlice.actions
export default addNewEventLogData

export const eventsLogSelector = ((state: {action: UserData}) => state.action.logs)