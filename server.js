'use strict';
import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
//import http from "http";
//import path from "path";
import serverless from "serverless-http";
import bodyParser from "body-parser";
import rateLimit from "express-rate-limit";
import { Config, Wallet, TokenSendRequest, BCMR } from "mainnet-js";

//DefaultProvider.servers.testnet = ["wss://chipnet.imaginary.cash:50004"]
Config.EnforceCashTokenReceiptAddresses = true;

const app = express();
app.use(express.json());

//app.use("/.netlify/functions/server", router);
app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

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

//module.exports = app;
//export function app()
//module.exports.handler = serverless(app);
//exports.handler = serverless(app)

serverless(app)
app.listen(3000, () => console.log('Local app listening on port 3000!'));

//const server = http.createServer(app);
//server.listen(process.env.PORT, () => {
//console.log("Server listening on port " + process.env.PORT + "!");
//});