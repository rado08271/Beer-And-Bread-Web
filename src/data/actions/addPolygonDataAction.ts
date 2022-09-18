import {createTokenSlice} from "../reducers/createTokenReducer";
import CreateTokenData from "../../domain/entity/model/CreateTokenData";

const {addPolygonData} = createTokenSlice.actions
export default addPolygonData

export const polygonDataSelector = ((state: {create: CreateTokenData }) => state.create.polygonData)