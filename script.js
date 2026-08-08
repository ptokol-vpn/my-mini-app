const tg = window.Telegram?.WebApp;

if (tg) {
    tg.ready();
    tg.expand();
    tg.BackButton.hide();
}

/* ДАННЫЕ */

let currentBalance = 125.50;
let balanceMode = "deposit";

let selectedMethod = "CryptoBot";
let selectedMethodIcon = "🤖";

/* TELEGRAM USER */

function loadTelegramUser() {

if (!tg) return;

const user = tg.initDataUnsafe?.user;

if (!user) return;

const usernameElement =
    document.getElementById("username");

const avatarElement =
    document.getElementById("avatar");

const profileName =
    document.getElementById("profileName");

const profileUsername =
    document.getElementById("profileUsername");

const profileAvatar =
    document.getElementById("profileAvatar");


const name =
    user.first_name ||
    user.username ||
    "Игрок";


if (usernameElement) {
    usernameElement.textContent = name;
}

if (profileName) {
    profileName.textContent = name;
}


if (profileUsername) {

    if (user.username) {

        profileUsername.textContent =
            "@" + user.username;

    } else {

        profileUsername.textContent =
            "Telegram пользователь";

    }
}


if (user.photo_url) {

    const imageHTML = `
        <img
            src="${user.photo_url}"
            alt="avatar">
    `;

    if (avatarElement) {
        avatarElement.innerHTML = imageHTML;
    }

    if (profileAvatar) {
        profileAvatar.innerHTML = imageHTML;
    }
}

}

/* БАЛАНС */

function updateBalance() {

const value =
    currentBalance.toFixed(2) + " $";


const topBalance =
    document.getElementById("topBalance");

const bigBalance =
    document.getElementById("bigBalance");

const profileBalance =
    document.getElementById("profileBalance");


if (topBalance) {
    topBalance.textContent = value;
}

if (bigBalance) {
    bigBalance.textContent = value;
}

if (profileBalance) {
    profileBalance.textContent = value;
}

}

/* СКРЫТЬ ВСЕ СТРАНИЦЫ */

function hideAllPages() {

const pages = [
    "homePage",
    "balancePage",
    "profilePage",
    "bonusPage"
];


pages.forEach(id => {

    const page =
        document.getElementById(id);

    if (page) {
        page.classList.add("hidden");
    }

});

}

/* ПОКАЗАТЬ СТРАНИЦУ */

function showPage(id) {

hideAllPages();


const page =
    document.getElementById(id);


if (page) {
    page.classList.remove("hidden");
}


window.scrollTo({
    top: 0,
    behavior: "smooth"
});

}

/* ДОМОЙ */

function goHome() {

showPage("homePage");

updateNav("home");

}

/* БАЛАНС */

function openBalance(mode = "deposit") {

showPage("balancePage");

setBalanceMode(mode);

updateNav("balance");

updateBalance();

}

/* ПРОФИЛЬ */

function openProfile() {

showPage("profilePage");

updateNav("profile");

updateBalance();

loadTelegramUser();

}

/* БОНУСЫ */

function openBonus() {

showPage("bonusPage");

updateNav("bonus");

}

/* ИГРЫ */

function openGames() {

showPage("homePage");

updateNav("games");


setTimeout(() => {

    const games =
        document.querySelector(".games-section");


    if (games) {

        games.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    }

}, 50);

}

/* НИЖНЕЕ МЕНЮ */

function updateNav(active) {

const navItems =
    document.querySelectorAll(".nav-item");


navItems.forEach(item => {
    item.classList.remove("active");
});


const map = {

    home: "homeNav",
    games: "gamesNav",
    balance: "balanceNav",
    bonus: "bonusNav",
    profile: "profileNav"

};


const activeElement =
    document.getElementById(map[active]);


if (activeElement) {
    activeElement.classList.add("active");
}

}

/* БАЛАНС: ПОПОЛНЕНИЕ / ВЫВОД */

function setBalanceMode(mode) {

balanceMode = mode;


const depositTab =
    document.getElementById("depositTab");

const withdrawTab =
    document.getElementById("withdrawTab");

const title =
    document.getElementById("formTitle");

const subtitle =
    document.getElementById("formSubtitle");

const action =
    document.getElementById("balanceAction");


if (
    !depositTab ||
    !withdrawTab ||
    !title ||
    !subtitle ||
    !action
) {
    return;
}


depositTab.classList.remove("active");
withdrawTab.classList.remove("active");


if (mode === "deposit") {

    depositTab.classList.add("active");

    title.textContent =
        "Пополнение баланса";

    subtitle.textContent =
        "Выберите удобный способ пополнения";

    action.textContent =
        "Пополнить";
}


if (mode === "withdraw") {

    withdrawTab.classList.add("active");

    title.textContent =
        "Вывод средств";

    subtitle.textContent =
        "Выберите способ вывода средств";

    action.textContent =
        "Вывести";
}

}

/* МЕТОДЫ ОПЛАТЫ */

function toggleMethods() {

const dropdown =
    document.getElementById("methodsDropdown");

const arrow =
    document.getElementById("methodArrow");


if (!dropdown) return;


dropdown.classList.toggle("open");


if (dropdown.classList.contains("open")) {

    if (arrow) {
        arrow.textContent = "▲";
    }

} else {

    if (arrow) {
        arrow.textContent = "▼";
    }
}

}

function selectMethod(method, icon) {

selectedMethod = method;
selectedMethodIcon = icon;


const selected =
    document.getElementById("selectedMethod");

const iconElement =
    document.getElementById(
        "selectedMethodIcon"
    );


if (selected) {
    selected.textContent = method;
}

if (iconElement) {
    iconElement.textContent = icon;
}


const dropdown =
    document.getElementById("methodsDropdown");

const arrow =
    document.getElementById("methodArrow");


if (dropdown) {
    dropdown.classList.remove("open");
}

if (arrow) {
    arrow.textContent = "▼";
}

}

/* ДЕМО БАЛАНСА */

function demoBalanceAction() {

const input =
    document.getElementById("amountInput");


if (!input) return;


const amount =
    parseFloat(input.value);


if (!amount || amount <= 0) {

    showMessage("Введите сумму");

    return;
}


if (balanceMode === "deposit") {

    showMessage(
        `Демо: пополнение ${amount.toFixed(2)} $ через ${selectedMethod}`
    );

    return;
}


if (amount > currentBalance) {

    showMessage("Недостаточно средств");

    return;
}


showMessage(
    `Демо: вывод ${amount.toFixed(2)} $ через ${selectedMethod}`
);

}

/* БОНУС */

function claimBonus() {

showMessage(
    "Демо: ежедневный бонус пока не подключён"
);

}

/* УВЕДОМЛЕНИЯ */

function showMessage(text) {

if (tg?.showAlert) {

    tg.showAlert(text);

    return;
}


alert(text);

}

/* ЗАПУСК */

document.addEventListener(
"DOMContentLoaded",
() => {

    loadTelegramUser();

    updateBalance();

    goHome();

}

);
