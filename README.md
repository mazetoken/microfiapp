# Microfi CashTokens Distribution App (aka faucet)

---

v. 1.0.1

- added helmet.js

- added WIF in .env

- updated the frontend

- distribute MESH CRC20 CashToken

If you like and use the app, consider keeping Microfi website URL in credits

Donate Bitcoin Cash to bitcoincash:qz2ajh3pcp06rqrjgw5df0a02yrg2jypeywg34pafc

--- 
v. 1.0.0

Microfi Free Flow (XMI) Bitcoin Cash CashTokens.

The total supply of 1 million XMI was distributed for free.

Distribution ran from May 25, 2023 to June 28, 2023 (https://microfi.onrender.com)

Anyone could claim 100 Microfi Free Flow (XMI) CashTokens every hour.

---

Microfi Free Flow website: https://microfi.eu

---

To try the app with your CashTokens, you need to download the repository, change the wallet and token details in the "example_env.txt" and rename it to ".env".

`#SEED="wallet seed phrase"`
`WIF="wallet private key"`
`TOKENAMOUNT= (with decimal places)`
`TOKENID="fungible token category"`
`#HCAPTCHA_SECRET=`
`PORT=3000`

Open a command line and run:

`npm i`
`npm start`

Open browser: localhost:3000

---

Change `index.ejs` and `server.js` for your needs (e.g. token details, hCaptcha, etc.)

---

You can host the app on e.g. https://onrender.com

Create a new web service, connect Git repository, set Environment variables (copy/paste `Key` and `Value`  from .env, without PORT) and in settings use:

Build command `npm i`

Start command `npm start`

---

You can use e.g. [Electron Cash wallet](https://electroncash.org) to distribute tokens

You will need Bitcoin Cash for transactions fee

---

You can use [hCaptcha](https://hCaptcha.com/?r=913a126f378f) if you want (need to modify the code a bit: index.ejs, server.js and .env)

---

If you have questions join https://t.me/mazetokens