import {useEffect} from "react";
import Web3 from "web3";
import {FormControl, TextField} from "@mui/material";
import {Connection, Keypair, LAMPORTS_PER_SOL} from "@solana/web3.js";
import {BLOCKCHAIN_URL} from "../../config/constants";

export default function CreateWallet() {
    const connection = new Connection("https://api.devnet.solana.com", 'confirmed')
    const web3 = new Web3(`${BLOCKCHAIN_URL}`)

    useEffect(() => {
        const accountToCreate = web3.eth.accounts.create()
        const wallet = web3.eth.accounts.wallet.create(1)
        wallet.save("12345", "WALLET")
        console.log(accountToCreate)
        console.log(wallet)
        // accountToCreate.
    }, [])

    useEffect(() => {
        console.log("Connection to cluser established", connection)
        getData()
    }, [])

    async function getData() {
        const Info = await connection.getEpochInfo()
        console.log(Info)
        createAccount()
    }

    // async function connectToken() {
    //     const programId = "6xXj3ds7LRLeDruqNBfdvfSFws79rh75ANR52AaLgKEy"
    //     const instruction =  new TransactionInstruction({
    //
    //     });
    // }

    async function createAccount() {
        const keyPair = Keypair.generate();
        console.log(keyPair.publicKey.toJSON())
        console.log(keyPair.secretKey)
        requestAirdrop(keyPair)
    }

    async function requestAirdrop(keypair: Keypair) {
        let airdropSignature = await connection.requestAirdrop(
            keypair.publicKey,
            LAMPORTS_PER_SOL,
        );
        console.log(`sign: ${airdropSignature}`);

        await connection.confirmTransaction(airdropSignature);
        let balance = await connection.getBalance(keypair.publicKey);
        console.log(`balance: ${balance}`);
    }

    return (
        <div>
            <FormControl>
                <TextField>

                </TextField>
            </FormControl>
        </div>
    )
}