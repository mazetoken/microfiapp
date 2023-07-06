# Microfi Free Flow on Bitcoin Cash

https://microfi.onrender.com

The total supply of 1 million XMI has been distributed for free

Distribution run from May 25, 2023 to June 28, 2023

You could claim 100 Microfi Free Flow (XMI) CashToken every hour

(the server goes to sleep after 30 minutes of inactivity, so you may need to wait a few seconds for the page to load)

Check MAZEy Botcoin Cash CashTokens mini wallet https://mazetoken.github.io/mazey/

---

To try the app with your CashToken, you need to download the repository, change the wallet and token details in the "example_env.txt" and rename it to ".env"

Open a command line and run:

`npm i`
`npm start`

Open browser: localhost:3000

---

open `index.ejs` (eg. in Visual Studio Code or in notepad if you are a hardcore) in views directory and remove comment from lines 71 and 81

to disable hCaptcha open `server.js` and add a comment `//` in lines 60-61 and 75-78, like this: 

`//const verifyData = await verify(process.env.HCAPTCHA_SECRET, req.body["h-captcha-response"]);
//console.log(verifyData);`

`//else if (! verifyData.success) {
//res.render("index", { content: null, txIds: null, image: null, error: "Captcha verification failed" });
//return;
//}`

and delete `verifyData.success` from the line 61

---

If you have questions join https://t.me/mazetokens