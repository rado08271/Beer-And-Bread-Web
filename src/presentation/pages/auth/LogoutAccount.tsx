import {Backdrop, Card, CardContent, CircularProgress, Container} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import doLogout, {accountLogoutSelector} from "../../../data/actions/accountDoLogoutAction";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";

export default function LogoutAccount() {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const loggedIn = useSelector(accountLogoutSelector)
    const [onLogout, logoutStarted] = useState(false)

    useEffect(() => {
        dispatch(doLogout())
        logoutStarted(true)
    }, [dispatch])

    useEffect(() => {
        if (!loggedIn && onLogout) {
            navigate('/login', {replace: true})
        }
    }, [loggedIn, onLogout])

    return (
        <Container>
            <Backdrop
                sx={{zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={!loggedIn}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        </Container>
    )
}