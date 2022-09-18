import PointDTO from "../contractDto/PointDTO";

export enum BussinessState {
    OPENED,
    CLOSED,
    UNKNOWN
}

export default interface BusinessData {
    id: string,
    brand: string,
    state: BussinessState,
    owner: string,
    location: PointDTO,
    currentIsOwner?: boolean,
}