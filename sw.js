// 앱 파일을 저장해 두어 인터넷이 약해도 화면이 열리게 함 (말하기 인식은 인터넷 필요)
var CACHE = "travel-english-v38";
var FILES = ["./", "index.html", "app.js", "sentences.js", "words.js", "words-app.js", "story.js", "story-app.js", "story-hanoi.js", "words2.js", "phonics2.js", "etym.js", "game.js", "explain.js", "phonics.js", "idioms.js", "connect.js", "phonics-ui.js", "dialog.js", "dialog-app.js", "sreview.js", "manifest.webmanifest", "plane-192.png", "plane-512.png"];
self.addEventListener("install", function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(FILES); }));
  self.skipWaiting();
});
self.addEventListener("activate", function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
  }));
  self.clients.claim();
});
// no-cache: 폰 브라우저에 저장된 옛 파일 대신 항상 서버에 새 버전이 있는지 확인
// 새 버전을 먼저 받아오고, 인터넷이 안 되면 저장된 것 사용
self.addEventListener("fetch", function (e) {
  if (e.request.method !== "GET") return;
  e.respondWith(
    fetch(e.request, { cache: "no-cache" }).then(function (r) {
      var copy = r.clone();
      caches.open(CACHE).then(function (c) { c.put(e.request, copy); });
      return r;
    }).catch(function () { return caches.match(e.request); })
  );
});
