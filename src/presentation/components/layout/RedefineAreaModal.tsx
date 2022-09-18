import BusinessData from "../../../domain/entity/model/BusinessData";
import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from "@mui/material";
import {useEffect, useState} from "react";
import ChangeBusinessDataForm from "../forms/ChangeBusinessDataForm";
import PointDTO from "../../../domain/entity/contractDto/PointDTO";
import RedefineAreaDataForm from "../forms/RedefineAreaDataForm";

interface Props {
    polygon: PointDTO[]
}

export default function RedefineAreaModal(props: Props) {

    const [opened, setOpened] = useState(true)

    useEffect(() => {
        setOpened(props.polygon !== null)
    }, [props.polygon])

    function close() {
        setOpened(false)
    }

    return (
        <Dialog
            open={opened}
            keepMounted
            onClose={close}
            title={"Redefine Area"}
        >
            <RedefineAreaDataForm
                polygon={props.polygon}
                onSuccess={() => close()}
            />
        </Dialog>
    )
}