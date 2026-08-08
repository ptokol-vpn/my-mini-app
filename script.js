/* =========================================
   TELEGRAM MINI APP
========================================= */

const tg = window.Telegram?.WebApp;

if (tg) {
    tg.ready();
    tg.expand();
}


/* =========================================
   ДАННЫЕ
========================================= */

let currentBalance = 125.50;

let balanceMode = "deposit";

let selectedMethod = "CryptoBot";
let selectedMethodIcon = "🤖";


/* =========================================
   TELEGRAM ПОЛЬЗОВАТЕЛЬ
========================================= */

function loadTelegramUser() {

    if (!tg) return;

    const user = tg.initDataUnsafe?.user;

    if (!user) return;

    const usernameElement =
        document.getElementById("username");

    const avatarElement =
        document.getElementById("avatar");


    usernameElement.textContent =
        user.first_name ||
        user.username ||
        "Игрок";


    if (user.photo_url) {

        avatarElement.innerHTML = `
            <img
                src="${user.photo_url}"
                alt="avatar">
        `;
    }
}


/* =========================================
   БАЛАНС
========================================= */

function updateBalance() {

    const value =
        currentBalance.toFixed(2) + " $";


    const topBalance =
        document.getElementById("topBalance");

    const bigBalance =
        document.getElementById("bigBalance");


    if (topBalance) {
        topBalance.textContent = value;
    }

    if (bigBalance) {
        bigBalance.textContent = value;
    }
}


/* =========================================
   ОТКРЫТЬ БАЛАНС
========================================= */

function openBalance(mode = "deposit") {

    const home =
        document.getElementById("homePage");

    const balance =
        document.getElementById("balancePage");


    home.classList.add("hidden");

    balance.classList.remove("hidden");


    setBalanceMode(mode);


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });


    updateNav("balance");
}


/* =========================================
   ДОМОЙ
========================================= */

function goHome() {

    const home =
        document.getElementById("homePage");

    const balance =
        document.getElementById("balancePage");


    balance.classList.add("hidden");

    home.classList.remove("hidden");


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });


    updateNav("home");
}


/* =========================================
   НИЖНЕЕ МЕНЮ
========================================= */

function updateNav(active) {

    const homeNav =
        document.getElementById("homeNav");

    const balanceNav =
        document.getElementById("balanceNav");


    homeNav.classList.remove("active");

    balanceNav.classList.remove("active");


    if (active === "home") {
        homeNav.classList.add("active");
    }

    if (active === "balance") {
        balanceNav.classList.add("active");
    }
}


/* =========================================
   ПОПОЛНИТЬ / ВЫВЕСТИ
========================================= */

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


/* =========================================
   ВЫБОР МЕТОДА
========================================= */

function toggleMethods() {

    const dropdown =
        document.getElementById("methodsDropdown");

    const arrow =
        document.getElementById("methodArrow");


    dropdown.classList.toggle("open");


    if (dropdown.classList.contains("open")) {

        arrow.textContent = "▲";

    } else {

        arrow.textContent = "▼";
    }
}


function selectMethod(method, icon) {

    selectedMethod = method;

    selectedMethodIcon = icon;


    document.getElementById(
        "selectedMethod"
    ).textContent = method;


    document.getElementById(
        "selectedMethodIcon"
    ).textContent = icon;


    document
        .getElementById("methodsDropdown")
        .classList.remove("open");


    document.getElementById(
        "methodArrow"
    ).textContent = "▼";
}


/* =========================================
   ДЕМО КНОПКА
========================================= */

function demoBalanceAction() {

    const input =
        document.getElementById("amountInput");

    const amount =
        parseFloat(input.value);


    if (!amount || amount <= 0) {

        showMessage(
            "Введите сумму"
        );

        return;
    }


    if (balanceMode === "deposit") {

        showMessage(
            `Демо: пополнение ${amount.toFixed(2)} $ через ${selectedMethod}`
        );

    } else {

        if (amount > currentBalance) {

            showMessage(
                "Недостаточно средств"
            );

            return;
        }


        showMessage(
            `Демо: вывод ${amount.toFixed(2)} $ через ${selectedMethod}`
        );
    }
}


/* =========================================
   УВЕДОМЛЕНИЕ
========================================= */

function showMessage(text) {

    if (tg?.showAlert) {

        tg.showAlert(text);

        return;
    }


    alert(text);
}


/* =========================================
   БОНУС
========================================= */

function openBonus() {

    showMessage(
        "Раздел бонусов пока в разработке"
    );
}


/* =========================================
   ЗАПУСК
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        loadTelegramUser();

        updateBalance();

    }
);
