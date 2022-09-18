import React, {useEffect} from 'react';
import routes from "../config/Routes";
import {RouteObject, useRoutes} from "react-router-dom";
import {Provider} from "react-redux";
import {applyMiddleware, combineReducers, configureStore, createStore} from "@reduxjs/toolkit";
import {Container, createTheme, Paper, Theme, ThemeProvider, ThemeWithProps, Typography, useTheme} from "@mui/material";
import {makeStyles, MuiThemeProvider} from "@material-ui/core";
import MenuDrawer from "../components/layout/MenuDrawer";
import superReducer from "../../data/reducers/superReducer"
import abiReducer, {abiSlice} from "../../data/reducers/abiReducer";
import contractReducer, {contractSlice} from "../../data/reducers/contractReducer";
import logger, {createLogger} from 'redux-logger'
import {curryGetDefaultMiddleware} from "@reduxjs/toolkit/dist/getDefaultMiddleware";

const theme = createTheme();

const useStyles = makeStyles( (theme) => ({
    page: {
        background: theme.palette.background.default,
        width: '100%',
        height: 'auto',
        display: "flex",
    },
    root: {
        display: "flex"
    },
    author: {
        position: "fixed",
        bottom: 0,
        right: 0,
        padding: theme.spacing(2)
    }

}))

function App() {
    const classes = useStyles()

    useEffect(() => {
        const store = configureStore({reducer: {
            contract: contractReducer,
            abi: abiReducer,
        }})
        type RootState = ReturnType<typeof store.getState>
        type AppDispatch = typeof store.dispatch

    }, [])

    return (
        <ThemeProvider theme={theme}>
            <div className={classes.root}>
                <Provider store={configureStore({reducer: combineReducers({sup: superReducer})})}>
                    <MenuDrawer/>
                    <div className={classes.page}>
                        {useRoutes(routes.map((route, index): RouteObject => {
                            return {
                                path: route.path,
                                element: route.reduxStore
                                    ? <Provider store={configureStore({
                                        reducer: route.reduxStore,
                                        middleware: (getDefaultMiddleware) => getDefaultMiddleware({serializableCheck: false}),
                                    })} children={route.component}/>
                                    : route.component,
                                caseSensitive: route.exact,
                                index: true}
                        }))}
                    </div>
                </Provider>
                <Paper className={classes.author}>
                    <Typography align={"justify"}>Radoslav Figura @KPI FEI TUKE 2022</Typography>
                </Paper>
            </div>
        </ThemeProvider>
    )
}

export default App;

/**
 *
 *
 *     const [network, setNetwork] = useState<string | null>();
 *     const [account, setAccount] = useState<string | null>();
 *     const [newAccount, createAccount] = useState<any>();
 *     const [balance, setBalance] = useState<string | null>();
 *     const [web] = useState<Web3>(new Web3(Web3.givenProvider || new Web3.providers.HttpProvider("http://localhost:8545")));
 *
 *     useEffect(() => {
 *     })
 *
 *     function createWallet() {
 *         createAccount(web.eth.accounts.create())
 *     }
 *
 *     async function load() {
 *         setNetwork("loading...")
 *         setNetwork(await web.eth.net.getNetworkType());
 *         await web.eth.getAccounts(async (error, accounts) => {
 *             setAccount(accounts[0])
 *             await web.eth.getBalance(accounts[0], (error, accountBalance) => {
 *                 setBalance(accountBalance)
 *             })
 *         })
 *     }
 *
 * <div className={"container"}>
 *             {
 *                 (network != null)
 *                     ? <h1>Network is {network}</h1>
 *                     : <h1>Click First</h1>
 *             }
 *
 *             <Button onClick={createWallet}>New Account</Button>
 *             <OverlayTrigger
 *                 placement="bottom"
 *                 delay={{show: 250, hide: 400}}
 *                 overlay={<Tooltip id={"button-tooltip"}>{ (network != null) ? "Account: " + account + "\nBalance: " + balance : "Not loaded"}</Tooltip> }
 *             >
 *                 <Button variant={"success"} onClick={load}>Account info</Button>
 *             </OverlayTrigger>
 *             <div>
 *                 {newAccount != null
 *                     ? <h1>{newAccount.address}</h1>
 *                     : <h1>Nothing</h1>
 *                 }
 *             </div>
 *         </div>
 */