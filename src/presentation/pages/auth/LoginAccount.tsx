import LoginAccountForm from "../../components/forms/auth-form/LoginAccountForm";
import {useNavigate} from 'react-router-dom';
import {putData} from "../../../shared/utils/cache";
import {Card, CardHeader, Container, CardContent} from "@mui/material";

export default function LoginAccount () {
    const navigate = useNavigate();

    return (
        <Container>
            <Card
                className={"mb-2"}
                style={{ width: '50vw', justifyContent: 'center', display: "flex" }}
            >
                <CardHeader className={"text-center"}>Please pass your account address to access your wallet</CardHeader>
                <CardContent className={"content-center"}>
                    <LoginAccountForm
                        onSuccess={(accountAddress) => {
                            putData("CURRENT_LOGGED_ACCOUNT_ADDRESS", accountAddress)
                            navigate('/dashboard', {replace: true})
                        }}
                        onError={(message) => console.error(message)}/>
                </CardContent>
            </Card>
        </Container>
    )
}