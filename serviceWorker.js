const staticMicrofiApp = "microfi-app-v1"
const assets = [
  "./server.js",
  "./views/index.ejs",
  "./app.js",
  "./public/img/bitcoin-cash-logo.png",
  "./public/img/dark.png",
  "./public/img/lollipop.png",
  "./public/img/mesh.png",
  "./public/img/microfi.png",
  "./public/img/microfi_app.png",
  "./public/img/microfi_icon.png",
  "./public/img/qrcode1.png",
  "./public/img/qrcode2.png",
  "./public/img/icons/",
]

self.addEventListener("install", installEvent => {
  installEvent.waitUntil(
    caches.open(staticMicrofiApp).then(cache => {
      cache.addAll(assets)
    })
  )
})

self.addEventListener("fetch", fetchEvent => {
    fetchEvent.respondWith(
      caches.match(fetchEvent.request).then(res => {
        return res || fetch(fetchEvent.request)
      })
    )
})