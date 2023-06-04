import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import bodyParser from "body-parser";
import rateLimit from "express-rate-limit";
import requestIp from "request-ip";
import { verify } from "hcaptcha";
import { Config, Wallet, TokenSendRequest } from "mainnet-js";

const app = express();
app.set('trust proxy', 1);
app.use(requestIp.mw());

const apiLimiter = rateLimit({
    windowMs: 1 * 60 * 60 * 1000, // 1 hour
    max: 1,
    keyGenerator: function (req, res) {
        return req.clientIp
    },
    message: "Too many requests, please try again after an hour",
    draft_polli_ratelimit_headers: true,
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

//const sleep = (ms = number) => new Promise((resolve) => setTimeout(resolve, ms));

app.use(express.static("public"));
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

app.get("/", function (req, res) {
    res.render("index", { content: null, txIds: null, image: null, error: null });
});

app.post("/", apiLimiter, async function (req, res) {
    //DefaultProvider.servers.testnet = ["wss://chipnet.imaginary.cash:50004"]
    Config.EnforceCashTokenReceiptAddresses = true;
    let userAddress = req.body.userAddress;
    const verifyData = await verify(process.env.HCAPTCHA_SECRET, req.body["h-captcha-response"]);
    console.log(verifyData);
    if (userAddress = req.body.userAddress, verifyData.success) {
        const seed = process.env.SEED;
        const wallet = await Wallet.fromSeed(seed, "m/44'/145'/0'/0/0");
        const { txId } = await wallet.send([new TokenSendRequest(
            {
                cashaddr: userAddress,
                amount: process.env.TOKENAMOUNT,
                tokenId: process.env.TOKENID
            }
        )]);
        //const bcmrUrl = "";
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
        return;
    } else if (! verifyData.success) {
        res.render("index", { content: null, txIds: null, image: null, error: "Captcha verification failed" });
        return;
    }
    //try {
        //const verifyData = await verify(process.env.HCAPTCHA_SECRET, req.body["h-captcha-response"])
        //console.log(verifyData);
        //if (! verifyData.success) {
            //throw new Error("captcha verification failed");
        //}
    //} catch (e) {
        //res.render("index", { content: null, txIds: null, image: null, error: e.message });
        //return;
    //}
});

app.listen(process.env.PORT, () => {
    console.log("Server listening on port " + process.env.PORT + "!");
});