import React, {useState} from 'react';
import './App.css';
import {Button, Figure, Tooltip} from 'react-bootstrap';
import Web3 from 'web3';

function App() {

    const [network, setNetwork] = useState("click first");
    const [account, setAccount] = useState<string | null>();
    const [balance, setBalance] = useState<string | null>();

    async function load() {
        setNetwork("loading...")
        // const web = await new Web3(Web3.givenProvider || "http://localhost:8545");
        // setNetwork(await web.eth.net.getNetworkType());
        // setAccount(await web.defaultAccount)
    }

    return (
        <div className={"container"}>
            <h1>Network is {network}</h1>
            <Button onClick={load}>Click</Button>
            {/*<div>*/}
            {/*    <Figure>*/}
            {/*        <Figure.Image*/}
            {/*            width={171}*/}
            {/*            height={180}*/}
            {/*            alt="171x180"*/}
            {/*            src="https://interactive-examples.mdn.mozilla.net/media/cc0-images/grapefruit-slice-332-332.jpg"*/}
            {/*        />*/}
            {/*        <Figure.Caption>*/}
            {/*            Nulla vitae elit libero, a pharetra augue mollis interdum.*/}
            {/*        </Figure.Caption>*/}
            {/*    </Figure>*/}
            {/*</div>*/}
            <Tooltip>{account}</Tooltip>
            <Tooltip>{balance}</Tooltip>
        </div>
    );
}

export default App;
