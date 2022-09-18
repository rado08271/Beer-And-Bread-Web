import {Backdrop, CircularProgress} from "@mui/material";

export default function Loader(props: {ready: boolean}) {
    return (
        <Backdrop
            sx={{zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={!props.ready}
        >
            <CircularProgress color="inherit" />
        </Backdrop>
    )
}