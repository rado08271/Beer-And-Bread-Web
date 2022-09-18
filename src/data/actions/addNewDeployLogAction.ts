import {createTokenSlice} from "../reducers/createTokenReducer";
import CreateTokenData from "../../domain/entity/model/CreateTokenData";

const {addNewDeployLogData} = createTokenSlice.actions
export default addNewDeployLogData

export const deployLogsSelector = ((state: {create: CreateTokenData }) => state.create.logs)