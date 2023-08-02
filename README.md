# Microfi Free Flow Distribution App (aka faucet)

Microfi Free Flow (XMI) Bitcoin Cash CashTokens.

The total supply of 1 million XMI has been distributed for free.

Distribution ran from May 25, 2023 to June 28, 2023 (https://microfi.onrender.com)

Anyone could claim 100 Microfi Free Flow (XMI) CashTokens every hour.

---

Microfi Free Flow website: https://microfi.eu

Check MAZEy Bitcoin Cash CashTokens wallet https://mazetoken.github.io/mazey/

---

To try the app with your CashToken, you need to download the repository, change the wallet and token details in the "example_env.txt" and rename it to ".env".

Open a command line and run:

`npm i`
`npm start`

Open browser: localhost:3000

---

Open `index.ejs` (eg. in Visual Studio Code or in notepad if you are a hardcore) in views directory and remove `<!--` form the line 71 and `--!>` from the line 94. Change `index.ejs` and `server.js` for your needs (e.g. token details).

To disable hCaptcha open `server.js` and add a comment `//` in lines 67-68 and 83-86, like this: 

`//const verifyData = await verify(process.env.HCAPTCHA_SECRET, req.body["h-captcha-response"]);
//console.log(verifyData);`

`//else if (! verifyData.success) {
//res.render("index", { content: null, txIds: null, image: null, error: "Captcha verification failed" });
//return;
//}`

and delete `, verifyData.success` from the line 70.

---

If you have questions join https://t.me/mazetokens