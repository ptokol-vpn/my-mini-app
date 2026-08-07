const tg = window.Telegram.WebApp;

tg.ready();
tg.expand();

const user = tg.initDataUnsafe?.user;

if (user) {
    document.getElementById("user").textContent =
        `Привет, ${user.first_name}!`;
} else {
    document.getElementById("user").textContent =
        "Открой приложение через Telegram";
}

document.getElementById("button").addEventListener("click", () => {
    tg.showAlert("Работает!");
});
