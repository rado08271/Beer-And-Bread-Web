import TokenData from "../../domain/entity/model/TokenData";

export const tokenErrorSelector = ((state: {token: TokenData}) => state.token.error)
export const tokenStateSelector = ((state: {token: TokenData}) => state.token.stateRequest)