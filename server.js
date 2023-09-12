import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import helmet from "helmet";
import bodyParser from "body-parser";
import rateLimit from "express-rate-limit";
import requestIp from "request-ip";
//import { verify } from "hcaptcha";
import { Config, Wallet, TokenSendRequest } from "mainnet-js";

Config.EnforceCashTokenReceiptAddresses = true;
Config.DefaultParentDerivationPath = "m/44'/145'/0'/0/0";

const app = express();
app.use(helmet());
app.set('trust proxy', 1);
app.use(requestIp.mw());

const apiLimiter = rateLimit({
    windowMs: 30 * 60 * 1000, // 30 minutes
    max: 2,
    keyGenerator: function (req, res) {
        return req.clientIp
    },
    message: "Too many requests, please try again in 30 minutes",
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
    //}, 2000); // 2 seconds
//});

app.get("/", function (req, res) {
    res.render("index", { content: null, txIds: null, image: null, error: null });
});

app.post("/", apiLimiter, async function (req, res) {
    //const seed = process.env.SEED;
    //const wallet = await Wallet.fromSeed(seed, "m/44'/145'/0'/0/0");
    const wif = process.env.WIF;
    const wallet = await Wallet.fromWIF(wif);
    var userAddress = req.body.userAddress;
    const tokenAmount = 50000000000; // amount of Cash Tokens to distribute (with decimal places)
    const token = "15b6e0152a4ecb7a561ac0e1f3dca540db8133c520bffdaf532e6d99b4f980e3"; // fungible tokenId (category)
    var blacklistAddress = [ "bitcoincash:zr3p4sja97wku94uayqqxe0lte32hjz62g80zy8ewk" ];
    for (let element of blacklistAddress) {
        if (userAddress.includes(element)) {
            res.render("index", { content: null, txIds: null, image: null, error: "Verification failed" });
            return;
        }
    }
    if (userAddress =! req.body.userAddress) {
        res.render("index", { content: null, txIds: null, image: null, error: "You need to provide CashTokens aware address- bitcoincash:z..." });
        return; 
    }
    let text = req.body.userAddress;
    let result = text.match("bitcoincash:z");
    if (userAddress =! result) {
        res.render("index", { content: null, txIds: null, image: null, error: "You need to provide CashTokens aware address- bitcoincash:z..." });
        return; 
    }
    //const verifyData = await verify(process.env.HCAPTCHA_SECRET, req.body["h-captcha-response"]);
    //console.log(verifyData);
    //if (userAddress = req.body.userAddress, verifyData.success) {
    if (userAddress = req.body.userAddress) {
        try {
        const { txId } = await wallet.send([new TokenSendRequest(
            {
                cashaddr: userAddress,
                amount: tokenAmount,
                tokenId: token
            }
        )]);
        res.render("index", {
            content: "You got 300 MESH! You can claim again after 30 minutes",
            txIds: txId,
            error: null
        });
        } catch (e) {
            //console.log("Not enough funds");
            res.render("index", {
                content: null,
                txIds: null,
                error: "Not enough funds. Send 2000 satoshi to bitcoincash:qz2ajh3pcp06rqrjgw5df0a02yrg2jypeywg34pafc and try again."
            });
        }
    //} else if (! verifyData.success) {
        //res.render("index", { content: null, txIds: null, image: null, error: "Captcha verification failed" });
        //return;
    }    
});

app.listen(process.env.PORT, () => {
    console.log("Server listening on port " + process.env.PORT + "!");
});