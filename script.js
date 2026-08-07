const tg = window.Telegram.WebApp;

tg.ready();
tg.expand();


// ============================
// ВРЕМЕННЫЕ ДАННЫЕ
// ============================

let user = {
    name: "Игрок",
    balance: 0
};


// ============================
// TELEGRAM USER
// ============================

const telegramUser = tg.initDataUnsafe?.user;

if (telegramUser) {

    user.name =
        telegramUser.first_name ||
        "Игрок";

    document.getElementById("username").textContent =
        user.name;


    if (telegramUser.photo_url) {

        document.getElementById("avatar").innerHTML =

            `<img src="${telegramUser.photo_url}">`;

    }

}


// ============================
// БАЛАНС
// ============================

function updateBalance() {

    document.getElementById("balance").textContent =
        user.balance.toFixed(2) + " $";
}

updateBalance();


// ============================
// КНОПКИ
// ============================

function deposit() {

    tg.showAlert(
        "Пополнение будет доступно после подключения бота и базы данных."
    );
}


function withdraw() {

    tg.showAlert(
        "Вывод будет доступен после подключения бота и базы данных."
    );
}


function openVip() {

    tg.showAlert(
        "VIP-раздел находится в разработке."
    );
}


function openTasks() {

    tg.showAlert(
        "Задания скоро появятся."
    );
}


function openBonus() {

    tg.showAlert(
        "Ежедневный бонус пока недоступен."
    );
}


function openProfile() {

    tg.showAlert(
        "Профиль находится в разработке."
    );
}


function openBalance() {

    tg.showAlert(
        "Баланс: " +
        user.balance.toFixed(2) +
        " $"
    );
}


function openAllGames() {

    document.querySelector(".games-section")
        .scrollIntoView({
            behavior: "smooth"
        });
}


function openGame(game) {

    const names = {

        cube: "Куб",

        mines: "Мины",

        wheel: "Колесо",

        crash: "Краш"

    };

    tg.showAlert(
        names[game] +
        " пока находится в разработке."
    );
}


function goHome() {

    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });
}
