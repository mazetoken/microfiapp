# Microfi Free Flow CashTokens Distribution Application on Bitcoin Cash

The app can distribute CashTokens (this is neither a smart contratc nor a DEX or swap application). Claiming CashTokens can be free for users, but token distributor will have to send CashTokens and Bitcoin Cash to the app wallet address (to pay blockchain transaction fee). Alternatively users can pay transactinion fee (1800 satoshi) if the app wallet address has 0 BCH.

Try it:

https://microfi.onrender.com

If you have questions join https://t.me/mazetokens

Donate Bitcoin Cash to: bitcoincash:qr8j9fzlmsdfy52n37pg2frqaddsjs99qyat9nwf88

---

To try the app with your CashTokens, you need to download the repository, change the wallet details in the "example_env.txt" and rename it to ".env". Change `views/index.ejs`, `server.js` for your needs (token and website details, etc.) in e.g. Visual Studio Code. You can use a wallet seed phrase instead of WIF (in .env: remove comment `#` next to SEED and add `#` next to WIF). If you like and use the app, consider keeping Microfi website url (https://microfi.eu) in credits. You can use e.g. [Electron Cash wallet](https://electroncash.org) to distribute tokens, [Microfi wallet](https://microfi.eu/wallet) or even [Microfi paper wallet](https://microfi.eu/paperwallet). Use separate wallet (for distribution only).

`#SEED="wallet seed phrase"`
`WIF="wallet private key"`
`PORT=3000`

You need nodejs installed on your system. Open a command line (e.g. PowerShell), navigate to the app directory and run:

`npm i`
`npm start`

Open browser and type: localhost:3000

---

You can host the app on e.g. https://cyclic.sh (1000 API requests/month, no sleep time) or https://onrender.com (sleeps after 30 minutes of inactivity).

Render tutorial:

Create an account on Render.
Create a new web service, connect Git repository, set Environment variables (copy/paste `Key` and `Value`  from .env, without " " and without PORT) and in settings use:

Build command `npm i`

Start command `npm start`

---
v. 1.0.6

- minor updates (packages, website - removed PWA, added a simple custom captcha)

- distribute DARK CashTokens

v. 1.0.5

- minor updates (packages, website - Progressive Web App (PWA))

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