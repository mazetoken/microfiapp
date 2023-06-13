import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import bodyParser from "body-parser";
import rateLimit from "express-rate-limit";
import requestIp from "request-ip";
import { verify } from "hcaptcha";
import { Wallet, TokenSendRequest } from "mainnet-js";

const app = express();
app.set('trust proxy', 1);
app.use(requestIp.mw());

const apiLimiter = rateLimit({
    windowMs: 2 * 60 * 60 * 1000, // 2 hours
    max: 1,
    keyGenerator: function (req, res) {
        return req.clientIp
    },
    message: "Too many requests, please try again after an hour",
    draft_polli_ratelimit_headers: true,
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
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

app.post("/", apiLimiter, async function (req, res) {
    //DefaultProvider.servers.testnet = ["wss://chipnet.imaginary.cash:50004"]
    //Config.EnforceCashTokenReceiptAddresses = true;
    var userAddress = req.body.userAddress;
    var blacklistAddress1 = "bitcoincash:zp3ztytwhuudk28tzgcxt68sv0sfvj3lmqdhv4k86s";
    var blacklistAddress2 = "bitcoincash:zq9aarucz2djnjtedw0c3rkfmfvhfwszs5yd75n7tk";
    var blacklistAddress3 = "bitcoincash:qp4mgas9zzmlxa0tte3e8djwjynftv5vlvpeg0hs4l";
    var blacklistAddress4 = "bitcoincash:zp4mgas9zzmlxa0tte3e8djwjynftv5vlvxnm3ek2v";
    const verifyData = await verify(process.env.HCAPTCHA_SECRET, req.body["h-captcha-response"]);
    console.log(verifyData);
    const seed = process.env.SEED;
    const wallet = await Wallet.fromSeed(seed, "m/44'/145'/0'/0/0");
    if (userAddress = req.body.userAddress, userAddress != blacklistAddress1, userAddress != blacklistAddress2, userAddress != blacklistAddress3, userAddress != blacklistAddress4, verifyData.success) {
        const { txId } = await wallet.send([new TokenSendRequest(
            {
                cashaddr: userAddress,
                amount: process.env.TOKENAMOUNT,
                tokenId: process.env.TOKENID
            }
        )]);
        res.render("index", {
            content: "You got 100 XMI! You can claim again after two hours",
            txIds: txId,
            error: null
        });
    } else if (userAddress != req.body.userAddress) {
        res.render("index", { content: null, txIds: null, image: null, error: "You need to provide valid bitcoincash address" });
        return;
    } else if (userAddress = blacklistAddress1, userAddress = blacklistAddress2, userAddress = blacklistAddress3, userAddress = blacklistAddress4) {
        res.render("index", { content: null, txIds: null, image: null, error: "Verification failed" });
        return;
    } else if (! verifyData.success) {
        res.render("index", { content: null, txIds: null, image: null, error: "Captcha verification failed" });
        return;
    }
});

app.listen(process.env.PORT, () => {
    console.log("Server listening on port " + process.env.PORT + "!");
});