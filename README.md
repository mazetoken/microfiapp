# Microfi Free Flow CashTokens Distribution Application on Bitcoin Cash

The app can distribute CashTokens (this is not a DEX or swap application). Claiming CashTokens can be free for users, but you will have to send CashTokens and Bitcoin Cash to the app wallet address (you pay blockchain transaction fee). Alternatively users can pay transactinion fee (about 2000 satoshi) if your app wallet address has 0 BCH.

Try it:

https://microfi.cyclic.cloud

If you have questions join https://t.me/mazetokens

Donate Bitcoin Cash to: bitcoincash:qr8j9fzlmsdfy52n37pg2frqaddsjs99qyat9nwf88

---

To try the app with your CashTokens, you need to download the repository, change the wallet details in the "example_env.txt" and rename it to ".env". Change `views/index.ejs` and `server.js` for your needs (e.g. token details, hCaptcha, etc.). You can use a wallet seed phrese instead of WIF. If you like and use the app, consider keeping Microfi website url (https://microfi.eu) in credits. You can use e.g. [Electron Cash wallet](https://electroncash.org) to distribute tokens or [Microfi wallet](https://microfi.eu/wallet). Use separate wallet (for distribution only). You can use [hCaptcha](https://hCaptcha.com/?r=913a126f378f) if you want (you need to modify the code a bit: index.ejs, server.js and .env and run `npm i hcaptcha`)

`#SEED="wallet seed phrase"`
`WIF="wallet private key"`
`#HCAPTCHA_SECRET=`
`PORT=3000`

You need nodejs installed on your system. Open a command line (e.g. PowerShell), navigate to the app directory and run:

`npm i`
`npm start`

Open browser and type: localhost:3000

---

You can host the app on e.g. https://cyclic.sh or  https://onrender.com for free

Render tutorial:

Create an account on Render.
Create a new web service, connect Git repository, set Environment variables (copy/paste `Key` and `Value`  from .env, without " " and without PORT) and in settings use:

Build command `npm i`

Start command `npm start`

---

v. 1.0.4

- support for Big Integer for fungible CashTokens (mainnet.js 2.3.0)

v. 1.0.3

- npm packages update, minor fixes

v. 1.0.2

- removed token amount and tokenId from env (it is in server.js now)

- updated frontend to collect a small amount of BCH if there are no funds in the app wallet

v. 1.0.1

- added [helmet](https://www.npmjs.com/package/helmet) npm

- added WIF in .env

- updated frontend

- distribute MESH CRC20 CashToken

- hCaptcha is optional (add/remove comments `//` in server.js and `<!-- -->` in index.ejs and remove comment `#` in .env)

v. 1.0.0

Microfi Free Flow (XMI) Bitcoin Cash CashTokens.

The total supply of 1 million XMI was distributed for free.

Distribution ran from May 25, 2023 to June 28, 2023 (https://microfi.onrender.com)

Anyone could claim 100 Microfi Free Flow (XMI) CashTokens every hour.