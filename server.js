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
    message: "Too many requests, please try again after one hour",
    draft_polli_ratelimit_headers: true,
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

app.use(express.static("public"));
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
//app.all('*', function(req, res, next) {
    //setTimeout(function() {
        //next();
    //}, 10000); // 10 seconds
//});

app.get("/", function (req, res) {
    res.render("index", { content: null, txIds: null, image: null, error: null });
});

app.post("/", apiLimiter, async function (req, res) {
    const seed = process.env.SEED;
    const wallet = await Wallet.fromSeed(seed, "m/44'/145'/0'/0/0");
    var userAddress = req.body.userAddress;
    var blacklistAddress = [
        "bitcoincash:qp3ztytwhuudk28tzgcxt68sv0sfvj3lmq2altcp9r",
        "bitcoincash:zp3ztytwhuudk28tzgcxt68sv0sfvj3lmqdhv4k86s",
        "bitcoincash:qp4mgas9zzmlxa0tte3e8djwjynftv5vlvpeg0hs4l",
        "bitcoincash:zp4mgas9zzmlxa0tte3e8djwjynftv5vlvxnm3ek2v"
    ];
    for (let element of blacklistAddress) {
        if (userAddress.includes(element)) {
            res.render("index", { content: null, txIds: null, image: null, error: "Verification failed" });
            return;
        }
    }
    if (userAddress = ! req.body.userAddress) {
        res.render("index", { content: null, txIds: null, image: null, error: "You need to provide CashTokens aware address- bitcoincash:z..." });
        return; 
    }
    let text = req.body.userAddress;
    let result = text.match("bitcoincash:z");
    if (userAddress = ! result) {
        res.render("index", { content: null, txIds: null, image: null, error: "You need to provide CashTokens aware address- bitcoincash:z..." });
        return; 
    }
    const verifyData = await verify(process.env.HCAPTCHA_SECRET, req.body["h-captcha-response"]);
    console.log(verifyData);
    //Config.EnforceCashTokenReceiptAddresses = true;
    if (userAddress = req.body.userAddress, verifyData.success) {
        const { txId } = await wallet.send([new TokenSendRequest(
            {
                cashaddr: userAddress,
                amount: process.env.TOKENAMOUNT,
                tokenId: process.env.TOKENID
            }
        )]);
        res.render("index", {
            content: "You got 100 XMI! You can claim again after one hour",
            txIds: txId,
            error: null
        });
    } else if (! verifyData.success) {
        res.render("index", { content: null, txIds: null, image: null, error: "Captcha verification failed" });
        return;
    }
});

app.listen(process.env.PORT, () => {
    console.log("Server listening on port " + process.env.PORT + "!");
});