const tg = window.Telegram?.WebApp;

if (tg) {
    tg.ready();
    tg.expand();
}


/* =========================
   ДАННЫЕ
========================= */

let currentBalance = 125.50;

let balanceMode = "deposit";

let selectedMethod = "CryptoBot";
let selectedMethodIcon = "🤖";


/* =========================
   TELEGRAM USER
========================= */

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


/* =========================
   БАЛАНС
========================= */

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


/* =========================
   СТРАНИЦЫ
========================= */

function hideAllPages() {

    const pages = [
        "homePage",
        "wheelPage",
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


/* =========================
   ГЛАВНАЯ
========================= */

function goHome() {

    showPage("homePage");

    updateNav("home");

}


/* =========================
   КОЛЕСО
========================= */

function openWheel() {

    showPage("wheelPage");

    updateNav("games");

}


/*
    Сектора колеса.

    Это обычные игровые результаты,
    без денежных ставок.
*/

const wheelRewards = [
    "⭐ Большая награда",
    "🔥 Супер награда",
    "⚡ Буст",
    "🎁 Бонус",
    "💎 Редкая награда",
    "✨ Маленькая награда"
];


let wheelRotation = 0;

let wheelSpinning = false;


/*
    Вращение колеса.

    Стрелка находится отдельно сверху
    и НЕ вращается.
*/

function spinWheel() {

    if (wheelSpinning) return;


    const wheel =
        document.getElementById("wheel");

    const button =
        document.getElementById("spinButton");

    const result =
        document.getElementById("wheelResult");

    const resultValue =
        document.getElementById("resultValue");


    if (!wheel || !button) return;


    wheelSpinning = true;


    button.disabled = true;

    button.innerHTML =
        '<span class="spin-icon">↻</span> Вращение...';


    if (result) {
        result.classList.remove("show");
    }

    if (resultValue) {
        resultValue.textContent = "?";
    }


    /*
        Случайный сектор.
    */

    const rewardIndex =
        Math.floor(
            Math.random() * wheelRewards.length
        );


    /*
        Каждый сектор = 60 градусов.

        Добавляем несколько полных оборотов,
        чтобы вращение выглядело красиво.
    */

    const sectorSize = 60;

    const fullSpins =
        5 + Math.floor(Math.random() * 3);


    /*
        Центр выбранного сектора.

        Из-за того, что стрелка сверху,
        колесо доводим соответствующим образом.
    */

    const targetAngle =
        360 -
        (
            rewardIndex * sectorSize +
            sectorSize / 2
        );


    wheelRotation +=
        fullSpins * 360 +
        targetAngle;


    wheel.style.transition =
        "transform 5s cubic-bezier(.12,.78,.18,1)";

    wheel.style.transform =
        `rotate(${wheelRotation}deg)`;


    setTimeout(() => {

        wheelSpinning = false;

        button.disabled = false;

        button.innerHTML =
            '<span class="spin-icon">↻</span> Крутить колесо';


        if (resultValue) {
            resultValue.textContent =
                wheelRewards[rewardIndex];
        }


        if (result) {
            result.classList.add("show");
        }


        /*
            Небольшая вибрация Telegram
            при наличии этой функции.
        */

        if (
            tg &&
            tg.HapticFeedback
        ) {

            tg.HapticFeedback.notificationOccurred(
                "success"
            );

        }

    }, 5100);

}


/* =========================
   ИГРЫ
========================= */

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


/* =========================
   БАЛАНС
========================= */

function openBalance(mode = "deposit") {

    showPage("balancePage");

    setBalanceMode(mode);

    updateNav("balance");

    updateBalance();

}


/* =========================
   ПРОФИЛЬ
========================= */

function openProfile() {

    showPage("profilePage");

    updateNav("profile");

    updateBalance();

    loadTelegramUser();

}


/* =========================
   БОНУС
========================= */

function openBonus() {

    showPage("bonusPage");

    updateNav("bonus");

}


/* =========================
   НИЖНЕЕ МЕНЮ
========================= */

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
        document.getElementById(
            map[active]
        );


    if (activeElement) {
        activeElement.classList.add("active");
    }

}


/* =========================
   ПОПОЛНЕНИЕ / ВЫВОД
========================= */

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


/* =========================
   МЕТОДЫ
========================= */

function toggleMethods() {

    const dropdown =
        document.getElementById(
            "methodsDropdown"
        );

    const arrow =
        document.getElementById(
            "methodArrow"
        );


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
        document.getElementById(
            "selectedMethod"
        );

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
        document.getElementById(
            "methodsDropdown"
        );

    const arrow =
        document.getElementById(
            "methodArrow"
        );


    if (dropdown) {
        dropdown.classList.remove("open");
    }

    if (arrow) {
        arrow.textContent = "▼";
    }

}


/* =========================
   ДЕМО БАЛАНС
========================= */

function demoBalanceAction() {

    const input =
        document.getElementById(
            "amountInput"
        );


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


/* =========================
   БОНУС
========================= */

function claimBonus() {

    showMessage(
        "Демо: ежедневный бонус пока не подключён"
    );

}


/* =========================
   УВЕДОМЛЕНИЯ
========================= */

function showMessage(text) {

    if (tg?.showAlert) {

        tg.showAlert(text);

        return;

    }


    alert(text);

}


/* =========================
   ЗАПУСК
========================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        loadTelegramUser();

        updateBalance();

        goHome();

    }
);
