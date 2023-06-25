# Microfi Free Flow on Bitcoin Cash

Claim 100 Microfi Free Flow (XMI) CashToken every two hours

https://microfi.onrender.com

(the server goes to sleep after 30 minutes of inactivity, so you may need to wait a few seconds for the page to load)

Try it with MAZEy wallet https://mazetoken.github.io/mazey/

---

To try the app with your CashToken, you need to download the repository, change the wallet and token details in the "example_env.txt" and rename it to ".env"

Open a command line and run:

`npm i`
`npm start`

Open browser: localhost:3000

to disable hCaptcha open `server.js` (eg. in Visual Studio Code or in notepad if you are a hardcore) and add a comment `//` in lines 60-61 and 75-78, like this:

`//const verifyData = await verify(process.env.HCAPTCHA_SECRET, req.body["h-captcha-response"]);`
//console.log(verifyData);`

`//else if (! verifyData.success) {
//res.render("index", { content: null, txIds: null, image: null, error: "Captcha verification failed" });
//return;
//}`

---

If you have questions join https://t.me/mazetokens