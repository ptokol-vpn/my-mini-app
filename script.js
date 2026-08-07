const tg = window.Telegram.WebApp;

tg.ready();
tg.expand();

let user = {
    name: "Игрок",
    balance: 0
};

const telegramUser = tg.initDataUnsafe?.user;

if (telegramUser) {

    user.name = telegramUser.first_name || "Игрок";

    document.getElementById("username").textContent =
        user.name;

    if (telegramUser.photo_url) {
        document.getElementById("avatar").innerHTML =
            `<img src="${telegramUser.photo_url}"
            style="width:100%;height:100%;object-fit:cover;">`;
    }
}

function updateBalance() {
    document.getElementById("balance").textContent =
        user.balance.toFixed(2) + " ₽";
}

updateBalance();

function deposit() {
    tg.showAlert("Пополнение пока недоступно.");
}

function withdraw() {
    tg.showAlert("Вывод пока недоступен.");
}

function openGame(game) {

    if (game === "cube") {
        tg.showAlert("Куб пока в разработке.");
    }

    if (game === "mines") {
        tg.showAlert("Мины пока в разработке.");
    }
}

function openBet() {
    tg.showAlert("Раздел ставок пока в разработке.");
}

function openBonus() {
    tg.showAlert("Бонус пока недоступен.");
}

function openProfile() {
    tg.showAlert("Профиль пока в разработке.");
}

function goHome() {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}
