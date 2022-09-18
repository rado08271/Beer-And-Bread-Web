import BusinessData from "../../../domain/entity/model/BusinessData";
import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from "@mui/material";
import {useEffect, useState} from "react";
import ChangeBusinessDataForm from "../forms/ChangeBusinessDataForm";

interface Props {
    businessData: BusinessData
}

export default function ChangeBusinessDataModal(props: Props) {

    const [opened, setOpened] = useState(true)

    useEffect(() => {
        setOpened(props.businessData !== null)
    }, [props.businessData])

    function close() {
        setOpened(false)
    }

    return (
        <Dialog
            open={opened}
            keepMounted
            onClose={close}
            title={"Change Owner"}
        >
            <ChangeBusinessDataForm
                businessData={props.businessData}
                onSuccess={() => close()}
            />
        </Dialog>
    )
}