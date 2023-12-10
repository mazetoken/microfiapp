import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { Config, Wallet, TokenSendRequest } from "mainnet-js";
import requestIp from "request-ip";
//import { verify } from "hcaptcha";

Config.EnforceCashTokenReceiptAddresses = true;
Config.DefaultParentDerivationPath = "m/44'/145'/0'/0/0";

const app = express();
app.use(helmet());
app.set('trust proxy', 1);
app.use(requestIp.mw());

const apiLimiter = rateLimit({
    windowMs: 20 * 60 * 1000, // 20 minutes
    max: 2,
    keyGenerator: function (req, res) {
        return req.clientIp
    },
    message: "Too many requests, please try again in 20 minutes",
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
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
    let userAddress = req.body.userAddress;
    const tokenAmount = 500000; // amount of CashTokens to distribute (with decimal places)
    const token = "bc1faf2615c0b2bdf94036f40f7b3b7bca87f8e515660905b4c454e150ee4f68"; // fungible tokenId (category)
    //let blacklistAddress = [ "bitcoincash:z" ];
    //for (let element of blacklistAddress) {
        //if (userAddress.includes(element)) {
            //res.render("index", { content: null, txIds: null, image: null, error: "Verification failed" });
            //return;
        //}
    //}
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
                amount: BigInt(tokenAmount),
                tokenId: token
            }
        )]);
        res.render("index", {
            content: "You got 5000 LOLLIPOP! You can claim again after 20 minutes",
            txIds: txId,
            error: null
        });
        } catch (e) {
            //console.log("Not enough funds");
            res.render("index", {
                content: null,
                txIds: null,
                error: "Not enough funds. Send 2000 satoshi to bitcoincash:qz2ajh3pcp06rqrjgw5df0a02yrg2jypeywg34pafc and try again"
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