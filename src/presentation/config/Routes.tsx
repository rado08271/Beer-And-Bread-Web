import IRoute, {ProtectedTypes} from "../interfaces/route";
import accountLoginReducer from "../../data/reducers/accountLoginReducer";
import Home from "../pages/home/Home";
import LoginAccount from "../pages/auth/LoginAccount";
import TokenList from "../components/list/TokenList";
import LogoutAccount from "../pages/auth/LogoutAccount";
import contractReducer from "../../data/reducers/contractReducer";
import contractsReducer from "../../data/reducers/contractsReducer";
import HomeIcon from '@mui/icons-material/Home'
import LogoutIcon from '@mui/icons-material/Logout';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import DashboardIcon from '@mui/icons-material/Dashboard';
import KeyIcon from '@mui/icons-material/Key';
import superReducer from "../../data/reducers/superReducer";
import Dashboard from "../pages/dapp/Dashboard";
import CurrencyDashboard from "../pages/dapp/CurrencyDashboard";
import abiReducer from "../../data/reducers/abiReducer";
import {combineReducers} from "redux";
import tokenReducer from "../../data/reducers/basicActionTokenReducer";
import userActionReducer from "../../data/reducers/basicActionUserReducer";
import CreateWallet from "../pages/auth/CreateWallet";
import basicExchangerStatsLogsReducer from "../../data/reducers/basicExchangerStatsLogsReducer";
import DefineNewCurrency from "../pages/dapp/DefineNewCurrency";
import MapIcon from '@mui/icons-material/Map';
import createTokenReducer from "../../data/reducers/createTokenReducer";
import ExchangeMoney from "../pages/money/ExchangeMoney";

const routes: IRoute[] = [
    {
        path: "/",
        exact: true,
        component: <Home/>,
        name: "Home",
        protected: ProtectedTypes.PUBLIC,
        icon: <HomeIcon color={"secondary"}/>
    },
    {
        path: "/dashboard",
        exact: true,
        component: <Dashboard/>,
        name: "Dashboard",
        protected: ProtectedTypes.PRIVATE,
        reduxStore: combineReducers({contractData: contractsReducer}),
        icon: <DashboardIcon color={"secondary"}/>
    },
    {
        path: "/define",
        exact: true,
        component: <DefineNewCurrency/>,
        name: "New Currency",
        protected: ProtectedTypes.PRIVATE,
        reduxStore: combineReducers({create: createTokenReducer, action: userActionReducer, contractData: contractsReducer}),
        icon: <MapIcon color={"secondary"}/>
    },
    {
        path: "/login",
        exact: true,
        component: <LoginAccount/>,
        name: "Login",
        protected: ProtectedTypes.PUBLIC_ONLY,
        reduxStore: accountLoginReducer,
        icon: <KeyIcon/>
    },
    {
        path: "/logout",
        exact: true,
        component: <LogoutAccount/>,
        name: "Logout",
        protected: ProtectedTypes.PRIVATE,
        reduxStore: combineReducers({sup: superReducer}),
        icon: <LogoutIcon/>
    },
    {
        path: "/create",
        exact: true,
        component: <CreateWallet/>,
        name: "Create",
        protected: ProtectedTypes.PUBLIC_ONLY,
        reduxStore: combineReducers({sup: superReducer}),
        icon: <AccountBalanceWalletIcon/>,
        hidden: true
    },
    {
        path: "/currency/:contractAddress",
        exact: true,
        component: <CurrencyDashboard/>,
        name: "",
        protected: ProtectedTypes.PRIVATE,
        reduxStore: combineReducers({abi: abiReducer, contract: contractReducer, token: tokenReducer, action: userActionReducer, stats: basicExchangerStatsLogsReducer}),
        hidden: true
        // reduxStore: contractReducer,
    },
    {
        path: "/exchange/",
        exact: true,
        component: <ExchangeMoney/>,
        name: "Fund account",
        protected: ProtectedTypes.PRIVATE,
        reduxStore: combineReducers({sup: superReducer}),
        // hidden: true
        // reduxStore: contractReducer,
    },
]

export default routes;