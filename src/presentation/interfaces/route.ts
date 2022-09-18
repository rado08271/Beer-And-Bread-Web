import IPage from "./page";
import {Reducer} from "redux";

export enum ProtectedTypes {
    PUBLIC,
    PRIVATE,
    PUBLIC_ONLY
}

export default interface IRoute {
    path: string;
    exact: boolean;
    component: IPage;
    name: string;
    hidden?: boolean
    icon?: any;
    protected: ProtectedTypes;
    reduxStore?: Reducer;
}