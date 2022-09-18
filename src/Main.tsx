import React from 'react';
import './shared/styles/App.scss';
import App from "./presentation/pages/App";
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import {Paper, Typography} from "@mui/material";
import {makeStyles} from "@material-ui/core";

const homeStyles = makeStyles((theme) => ({
    container: {
        padding: theme.spacing(3),
        display: "flex",
    },
    card: {
        maxWidth: '30%',
        textAlign: "center"
    },
}))

function Main() {

    return (
        <div>
            <App/>
            <ToastContainer/>

        </div>
    )
}

export default Main;