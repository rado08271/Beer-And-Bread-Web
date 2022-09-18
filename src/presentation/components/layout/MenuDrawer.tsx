import {
    Avatar,
    Badge,
    Divider,
    List,
    ListItem,
    ListItemAvatar,
    ListItemIcon,
    ListItemText,
    SwipeableDrawer,
    Toolbar,
    Tooltip,
    Typography,
    useMediaQuery,
    useTheme
} from "@mui/material";
import {makeStyles} from "@material-ui/core";
import routes from "../../config/Routes";
import {ProtectedTypes} from "../../interfaces/route";
import {useLocation, useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import checkLogin, {
    accountCheckedSelector,
    accountLoggedInSelector,
    checkLoadingSelector
} from "../../../data/actions/accountIsLoggedAction";
import {useEffect, useState} from "react";
import getBalance, {accountGetBalance} from "../../../data/actions/accountGetBalance";
import {accountUnlockLoadingSelector} from "../../../data/actions/unlockAccountAction";

const drawerStyle = makeStyles((theme) => ({
    drawer: {
        width: theme.spacing(30),
    },
    paper: {width: theme.spacing(30),},
    active: {background: theme.palette.primary.light},
    bottomPush: {
        position: "absolute",
        bottom: 0,
        textAlign: "center",
        paddingBottom: 10,
    }
}))

export default function MenuDrawer() {
    const drawer = drawerStyle()
    const navigate = useNavigate();
    const location = useLocation();

    const dispatch = useDispatch()

    const address = useSelector(accountCheckedSelector)
    const loggedIn = useSelector(accountLoggedInSelector)
    const balance = useSelector(accountGetBalance)
    const loginLoading = useSelector(checkLoadingSelector)

    const theme = useTheme();
    const smallScreen = useMediaQuery(theme.breakpoints.down('md'));
    const [opened, setOpened] = useState(false);

    useEffect(() => {
        dispatch(checkLogin())
    }, [dispatch])

    useEffect(() => {
        dispatch(getBalance({address}))
    }, [address])

    useEffect(() => {
        if (!loginLoading) {
            // TODO: Recreate to work everywhere
            routes.forEach(route => {
                if ((route.path.startsWith("/currency") && location.pathname.startsWith("/currency")) &&
                    (route.protected === ProtectedTypes.PRIVATE && !loggedIn)) {
                    navigate("/login", {replace: true})
                }
            })
        }
    }, [loginLoading])

    return (
        <SwipeableDrawer
            onOpen={() => {setOpened(true)}}
            onClose={() => {setOpened(false)}}
            open={smallScreen && opened}
            className={drawer.drawer}
            variant={!smallScreen || opened ? "permanent" : "temporary"}
            aria-orientation={"vertical"}
            anchor={"left"}
            classes={{
                paper: drawer.paper
            }}
        >
            <Toolbar variant={"dense"}>
                <Typography variant={"h5"}>
                    Beer and Bread
                </Typography>
            </Toolbar>

            <Divider/>

            <List>
                {routes.map((route, index) => {
                    if ((
                            (route.protected === ProtectedTypes.PUBLIC) ||
                            (route.protected === ProtectedTypes.PRIVATE && loggedIn) ||
                            (route.protected === ProtectedTypes.PUBLIC_ONLY && !loggedIn)
                        ) && !route.hidden
                    ) {
                        return <ListItem
                            button
                            divider
                            key={route.name}
                            onClick={() => navigate(route.path)}
                            className={location.pathname === route.path ? drawer.active : ""}
                        >
                            <ListItemIcon>{route.icon}</ListItemIcon>
                            <ListItemText primary={route.name}/>
                        </ListItem>
                    }
                })}
            </List>

            <List style={{marginTop: `auto`}}>
                <Divider light/>
                <Tooltip title={address ? address : ""}>
                    <ListItem>
                        <ListItemAvatar>
                            <Badge badgeContent={0} color="primary">
                                <Avatar sx={{bgcolor: `#${address?.slice(2, 8)}`}}></Avatar>
                            </Badge>
                        </ListItemAvatar>

                        <ListItemText>{(balance / 1e18).toFixed((balance / 1e18) % 10 === 0 ? 1 : 5)} ETH</ListItemText>
                    </ListItem>
                </Tooltip>
            </List>
        </SwipeableDrawer>
    )
}