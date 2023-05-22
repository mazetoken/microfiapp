import * as dotenv from "dotenv";
dotenv.config();
import next from "next";
import express from "express";
import serverless from "serverless-http";
import bodyParser from "body-parser";
import rateLimit from "express-rate-limit";
import { Config, Wallet, TokenSendRequest, BCMR } from "mainnet-js";

const dev = process.env.NODE_ENV !== "production";
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();

//DefaultProvider.servers.testnet = ["wss://chipnet.imaginary.cash:50004"]
Config.EnforceCashTokenReceiptAddresses = true;

nextApp.prepare().then(() => {
    const app = express();
    app.use(express.json());
    app.use(express.static("public"));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    //app.set("view engine", "ejs");

    const apiLimiter = rateLimit({
        windowMs: 1 * 60 * 60 * 1000, // 1 hour
        max: 1,
        //draft_polli_ratelimit_headers: true,
        message: "Too many requests, please try again after an hour",
        standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
        legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    });

    app.get("/", function (req, res) {
        res.render("index", { content: null, txIds: null, image: null, error: null });
        return handle(req, res);
    });

    app.post("/", apiLimiter, async function (req, res) {
        let userAddress = req.body.userAddress;
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
    });
    serverless(app);
    app.listen(process.env.PORT, () => console.log("Microfi app listening on port " + process.env.PORT + "!"));
})