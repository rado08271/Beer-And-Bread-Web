import {createToken} from "../reducers/createTokenReducer";
import CreateTokenData from "../../domain/entity/model/CreateTokenData";

export default createToken

export const createTokenLoadingSelector = ((state: {create: CreateTokenData }) => state.create.createTokenLoading)
