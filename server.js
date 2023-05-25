import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
//import http from "http";
import bodyParser from "body-parser";
import rateLimit from "express-rate-limit";
import { verify } from "hcaptcha";
import { Config, Wallet, TokenSendRequest } from "mainnet-js";

const app = express();
app.set('trust proxy', 1);

const apiLimiter = rateLimit({
    windowMs: 2 * 60 * 1000,
    max: 10,
    message: "Too many requests, please try again later",
    draft_polli_ratelimit_headers: true,
	//standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	//legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

const sleep = (ms = number) => new Promise((resolve) => setTimeout(resolve, ms));

app.use(express.static("public"));
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

app.get("/", function (req, res) {
    res.render("index", { content: null, txIds: null, image: null, error: null });
});

//DefaultProvider.servers.testnet = ["wss://chipnet.imaginary.cash:50004"]
Config.EnforceCashTokenReceiptAddresses = true;

app.post("/", apiLimiter, async function (req, res) {
    const userAddress = req.body.userAddress;
    if (userAddress = req.body.userAddress) {
        const seed = process.env.SEED;
        const wallet = await Wallet.fromSeed(seed, "m/44'/145'/0'/0/0");
        const { txId } = await wallet.send([new TokenSendRequest(
            {
                cashaddr: userAddress,
                amount: process.env.TOKENAMOUNT,
                tokenId: process.env.TOKENID
            }
        )]);
        //const bcmrUrl = "https://bafkreiejafiz23ewtyh6m3dpincmxouohdcimrd33abacrq3h2pacewwjm.ipfs.dweb.link";
        //await BCMR.addMetadataRegistryFromUri(bcmrUrl);
        //const tokenInfo = BCMR.getTokenInfo(process.env.TOKENID);
        res.render("index", {
            content: "You got 100 XMI! You can claim again after an hour",
            txIds: txId,
            //image: tokenInfo.uris.icon,
            error: null
        });
    } else if (userAddress = !req.body.userAddress) {
        res.render("index", { content: null, txIds: null, image: null, error: "You need to provide valid bitcoincash address" });
    }
    try {
        const verifyData = await verify(process.env.HCAPTCHA_SECRET, req.body["h-captcha-response"])
        console.log(verifyData);
        if (! verifyData.success) {
            throw new Error('captcha verification failed');
        }
    } catch (e) {
        res.render("index", { content: null, txIds: null, image: null, error: e.message });
        return;
    }
});

//const server = http.createServer(app);
//server.listen(process.env.PORT, () => {
app.listen(process.env.PORT, () => {
    console.log("Server listening on port " + process.env.PORT + "!");
});