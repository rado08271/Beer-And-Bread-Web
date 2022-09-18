import {useEffect, useState} from "react";
import {
    Backdrop, Button,
    Card, CardActions,
    CardContent, CardHeader,
    CircularProgress,
    Container,
    Dialog,
    DialogContent,
    Stack, TextareaAutosize,
    Typography
} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import dropFunds, {
    fundsErrorSelector,
    fundsHashSelector,
    fundsLoadingSelector
} from "../../../data/actions/accountDropFundsAction";
import checkLogin, {accountCheckedSelector} from "../../../data/actions/accountIsLoggedAction";

export default function ExchangeMoney() {
    const dispatch = useDispatch()
    const [open, setOpen] = useState(true)

    const accountAddress = useSelector(accountCheckedSelector)
    const fundsLoading = useSelector(fundsLoadingSelector)
    const fundsError = useSelector(fundsErrorSelector)
    const fundsHash = useSelector(fundsHashSelector)

    useEffect(() => {
        dispatch(checkLogin())
    }, [dispatch, fundsHash])

    function getFunds() {
        setOpen(true)
        if (accountAddress && accountAddress !== "0x0") dispatch(dropFunds({address: accountAddress}))
    }

    return (
        <Container>
            <Card>
                <CardHeader title={"Get some test funds (1000000000)"}/>
                <CardContent>
                    {
                        fundsLoading ? <Backdrop sx={{zIndex: (theme) => theme.zIndex.drawer + 1 }} open={fundsLoading}>
                                <CircularProgress color="inherit" />
                            </Backdrop> :
                            fundsError !== null || fundsHash === "" ?
                                <Dialog open={fundsError !== null && open} onClose={() => setOpen(false)}>
                                    <DialogContent>{fundsError}</DialogContent>
                                </Dialog> :
                                <Stack direction={"column"} spacing={2}>
                                     <Typography variant={"h4"}>
                                         One Token just dropped from sky supply for {accountAddress}
                                     </Typography>
                                     <TextareaAutosize defaultValue={fundsHash} disabled/>
                                </Stack>
                    }

                </CardContent>
                <CardActions>
                    <Button fullWidth disabled={!(accountAddress && accountAddress !== "0x0")} onClick={getFunds}>Get funds</Button>
                </CardActions>
            </Card>
        </Container>
    )
}