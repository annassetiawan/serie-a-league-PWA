import { getSchedulesById,getTeamsById,getSavedClubs } from "./api.js";
import { dbDeleteClub,dbInsertClub } from "./db.js";

if (!('serviceWorker' in navigator)) {
  console.log("Service worker tidak didukung browser ini.");
} else {
  registerServiceWorker();
  requestPermission();
}

function registerServiceWorker() {
  return navigator.serviceWorker
    .register("service-worker.js")
    .then(function (registration) {
      console.log("Registrasi service worker berhasil.");
      return registration;
    })
    .catch(function (err) {
      console.error("Registrasi service worker gagal.", err);
    });
}

function requestPermission() {
  if ("Notification" in window) {
    Notification.requestPermission().then(function (result) {
      if (result === "denied") {
        console.log("Fitur notifikasi tidak diijinkan.");
        return;
      } else if (result === "default") {
        console.error("Pengguna menutup kotak dialog permintaan ijin.");
        return;
      }

      navigator.serviceWorker.getRegistration().then(function (reg) {
        reg.showNotification("Notifikasi diijinkan!");
      });
    });
  }
}

navigator.serviceWorker.ready.then(() =>{
  if ("PushManager" in window) {
  navigator.serviceWorker.getRegistration().then(function (registration) {
    registration.pushManager
      .subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(
          "BNgjNLTH6YyBXZa5PuuAAGa6lpLFHukJdz4aznYoQejlLN8Hm23fqBVQ8rc6jHOZIm5y9IytCbXavHjOQC3ytL8"
        ),
      })
      .then(function (subscribe) {
        console.log(
          "Berhasil melakukan subscribe dengan endpoint: ",
          subscribe.endpoint
        );
        console.log(
          "Berhasil melakukan subscribe dengan p256dh key: ",
          btoa(
            String.fromCharCode.apply(
              null,
              new Uint8Array(subscribe.getKey("p256dh"))
            )
          )
        );
        console.log(
          "Berhasil melakukan subscribe dengan auth key: ",
          btoa(
            String.fromCharCode.apply(
              null,
              new Uint8Array(subscribe.getKey("auth"))
            )
          )
        );
      })
      .catch(function (e) {
        console.error("Tidak dapat melakukan subscribe ", e.message);
      });
  });
}
})


function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

document.addEventListener("DOMContentLoaded", function () {
  var elems = document.querySelectorAll(".tabs");
  M.Tabs.init(elems);
});

document.addEventListener("click", (e) => {
  if (e.target.closest("button")) {
    getSchedulesById(e);
  } else if (e.target.closest("span")) {
    const span = e.target.closest("span");
    const clubId = span.dataset.id;
    const item = getTeamsById(clubId);
    const isFromSaved = window.location.toString().includes("saved");

    if (isFromSaved) {
      item.then(function (clubId) {
        dbDeleteClub(clubId).then(() => {
          getSavedClubs();

          let teammatchHTML = `<div class="col s12 favourite" style="padding-bottom: 0;"></div>
     
            <div class="row">
              <div class="col s5 home"></div>
      
              <div class="col s2 matches white-text center"></div>
      
              <div class="col s5 away"></div>`;
          document.querySelector(".teammatch").innerHTML = teammatchHTML;
        });
      });
      M.toast({ html: "Remove From favourites" });
    } else {
      item.then(function (club) {
        dbInsertClub(club);
      });
      M.toast({ html: "Added To favourites" });
    }
  }
});
