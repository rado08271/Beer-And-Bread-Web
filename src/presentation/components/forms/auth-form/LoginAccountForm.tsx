import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import accountLogin, {
    accountError,
    accountLoggedIn,
    loading,
    accountAddress as address
} from "../../../../data/actions/accountCheckLoginAction";
import {Link} from "react-router-dom";
import {
    Container,
    FormGroup,
    InputLabel,
    FormHelperText,
    FormControl,
    Input,
    Button,
    TextField,
    Typography, useFormControl
} from "@mui/material";
import showNotification from "../../../../domain/service/NotificationService";
import unlockAccount, {accountUnlockLoadingSelector} from "../../../../data/actions/unlockAccountAction";

interface Props {
    onSuccess: (accountAddress: string) => void
    onError: (message: string) => void
}

export default function LoginAccountForm(props: Props) {
    const [accountAddress, setAccountAddress] = useState<string>("");
    const [valid, setValid] = useState(false);

    const account = useSelector(address)
    const error = useSelector(accountError)
    const logged = useSelector(accountLoggedIn)
    const loadedState = useSelector(loading)
    const loadingUnlock = useSelector(accountUnlockLoadingSelector)

    const dispatch = useDispatch();

    const formControl = useFormControl()

    useEffect(() => {
        if (!error && loadedState === 1 && logged) props.onSuccess(account)
        else if (error != null && !logged) {
            props.onError(error!!)
        }
    }, [logged, error])

    useEffect(() => {
        if (accountAddress.startsWith("0x") && accountAddress.length === 42) {
            setValid(true)
        } else {
            setValid(false)
        }
    }, [accountAddress])

    useEffect(() => {
        if (error) {
            showNotification({
                message: error,
                type: "error",
                title: "Login",
                ttl: 1000
            })
        }
    }, [error])

    async function login() {
        dispatch(accountLogin({address: accountAddress}))
        dispatch(unlockAccount({address: accountAddress}))
    }

    return (
        <Container>
            <FormControl
                onKeyPress={(e) => {
                    if (e.key === "Enter" && (loadedState !== 0 && valid)) login()
                }}
            >
                <FormGroup className="mb-3" >
                    <TextField
                        required
                        label={"Wallet Address:"}
                        id="walletAddress"
                        type="name"
                        aria-describedby={"never-share-data"}
                        placeholder="0x000000000000000000000000000"
                        variant="standard"
                        helperText={""}
                        maxRows={1}
                        error={error != null}
                        onChange={e => setAccountAddress(e.target.value)}
                    />

                    <Typography>We'll never share your wallet with anyone else.</Typography>

                    <Typography color={"error"} variant={"caption"} maxWidth={200}>{error}</Typography>
                </FormGroup>

                {/*{error !== null ?*/}
                {/*    <FormGroup className="mb-3">*/}
                {/*        <TextField*/}
                {/*            required*/}
                {/*            label={"Wallet Address:"}*/}
                {/*            id="wallet key"*/}
                {/*            type="name"*/}
                {/*            aria-describedby={"never-share-data"}*/}
                {/*            placeholder="Wallet private key"*/}
                {/*            variant="standard"*/}
                {/*            helperText={""}*/}
                {/*            maxRows={1}*/}
                {/*            onChange={e => setAccountAddress(e.target.value)}*/}
                {/*        />*/}

                {/*        <Typography>Import new wallet</Typography>*/}
                {/*    </FormGroup> : <></>*/}
                {/*}*/}

                <Button type={"submit"} variant={"outlined"}
                        onClick={login}
                        disabled={(loadedState !== 0 && !valid)} >
                    Login
                </Button>

                <Typography variant={"subtitle2"}>
                    Need new account? Use wallet extensions like Metamask, Coinbase, etc
                </Typography>
                D0x12355Cf0DE480dA818E834c6Ca439ED4d7Ab4626
            </FormControl>


        </Container>
    )
}