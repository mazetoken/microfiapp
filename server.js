import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { Config, Wallet, TokenSendRequest } from "mainnet-js";
import requestIp from "request-ip";

Config.EnforceCashTokenReceiptAddresses = true;
Config.DefaultParentDerivationPath = "m/44'/145'/0'/0/0";

const app = express();
app.use(helmet());
app.set('trust proxy', 1);
app.use(requestIp.mw());

const apiLimiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 1,
    keyGenerator: function (req, res) {
        return req.clientIp
    },
    message: "Too many requests, please try again in 10 minutes",
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
    let number = req.body.number; // captcha number
    const tokenAmount = 7200; // amount of CashTokens to distribute (with decimal places)
    const token = "b3dd6dee4e783acd755d216dd39e34faae748c43927dcb82152b6c2affd57bab"; // fungible tokenId (category)
    //let blacklistAddress = [ "bitcoincash:...", "bitcoincash:..." ];
    //for (let element of blacklistAddress) {
        //if (userAddress.includes(element)) {
            //res.render("index", { content: null, txIds: null, image: null, error: "Verification failed" });
            //return;
        //}
    //}
    if (userAddress =! req.body.userAddress, number =! req.body.number) {
        res.render("index", { content: null, txIds: null, image: null, error: "You need to provide CashTokens aware address- bitcoincash:z..." });
        return; 
    }
    let text = req.body.userAddress;
    let result = text.match("bitcoincash:z");
    if (userAddress =! result) {
        res.render("index", { content: null, txIds: null, image: null, error: "You need to provide CashTokens aware address- bitcoincash:z..." });
        return; 
    }
    if (userAddress = req.body.userAddress, number = req.body.number) {
        try {
        const { txId } = await wallet.send([new TokenSendRequest(
            {
                cashaddr: userAddress,
                amount: BigInt(tokenAmount),
                tokenId: token,
                value: 800
            }
        )]);
        res.render("index", {
            content: "You got 7200 ZOMBIE CashTokens! You can claim again after 10 minutes",
            txIds: txId,
            error: null
        });
        } catch (e) {
            //console.log("Not enough funds");
            res.render("index", {
                content: null,
                txIds: null,
                error: "No luck. Try again later."
            });
        }
    };
});

app.listen(process.env.PORT, () => {
    console.log("Server listening on port " + process.env.PORT + "!");
});