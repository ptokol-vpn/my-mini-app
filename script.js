const tg = window.Telegram?.WebApp;

if (tg) {
    tg.ready();
    tg.expand();
}


/* =========================
   ДАННЫЕ И БАЛАНС
========================= */

let currentBalance = 1000.00;
let balanceMode = "deposit";

let selectedMethod = "CryptoBot";
let selectedMethodIcon = "🤖";


/* =========================
   МАТЕМАТИКА КОЛЕСА (RTP ~92%)
========================= */

// Сектора с коэффициентами, цветами и весами (чем выше weight, тем чаще шанс выпадения)
const sectors = [
    { label: '0.0x', mult: 0.0, color: '#1e1e1e', icon: '💀', weight: 35 },
    { label: '0.2x', mult: 0.2, color: '#322514', icon: '📉', weight: 25 },
    { label: '0.5x', mult: 0.5, color: '#4a3311', icon: '🔸', weight: 18 },
    { label: '1.2x', mult: 1.2, color: '#7a4e06', icon: '🔥', weight: 10 },
    { label: '2.0x', mult: 2.0, color: '#a86800', icon: '⚡', weight: 6 },
    { label: '5.0x', mult: 5.0, color: '#d48200', icon: '🎁', weight: 3.5 },
    { label: '10.0x', mult: 10.0, color: '#ff9d00', icon: '💎', weight: 2 },
    { label: '50.0x', mult: 50.0, color: '#ffd700', icon: '⭐', weight: 0.5 }
];

let wheelRotation = 0;
let wheelSpinning = false;


/* =========================
   TELEGRAM USER
========================= */

function loadTelegramUser() {
    if (!tg) return;

    const user = tg.initDataUnsafe?.user;
    if (!user) return;

    const usernameElement = document.getElementById("username");
    const avatarElement = document.getElementById("avatar");
    const profileName = document.getElementById("profileName");
    const profileUsername = document.getElementById("profileUsername");
    const profileAvatar = document.getElementById("profileAvatar");

    const name = user.first_name || user.username || "Игрок";

    if (usernameElement) usernameElement.textContent = name;
    if (profileName) profileName.textContent = name;

    if (profileUsername) {
        profileUsername.textContent = user.username ? "@" + user.username : "Telegram пользователь";
    }

    if (user.photo_url) {
        const imageHTML = `<img src="${user.photo_url}" alt="avatar">`;
        if (avatarElement) avatarElement.innerHTML = imageHTML;
        if (profileAvatar) profileAvatar.innerHTML = imageHTML;
    }
}


/* =========================
   ОБНОВЛЕНИЕ БАЛАНСА
========================= */

function updateBalance() {
    const value = currentBalance.toFixed(2) + " $";

    const topBalance = document.getElementById("topBalance");
    const bigBalance = document.getElementById("bigBalance");
    const profileBalance = document.getElementById("profileBalance");
    const betBalanceText = document.getElementById("betBalanceText");

    if (topBalance) topBalance.textContent = value;
    if (bigBalance) bigBalance.textContent = value;
    if (profileBalance) profileBalance.textContent = value;
    if (betBalanceText) betBalanceText.textContent = `Баланс: ${value}`;
}


/* =========================
   СТРАНИЦЫ И НАВИГАЦИЯ
========================= */

function hideAllPages() {
    const pages = ["homePage", "wheelPage", "balancePage", "profilePage", "bonusPage"];
    pages.forEach(id => {
        const page = document.getElementById(id);
        if (page) page.classList.add("hidden");
    });
}

function showPage(id) {
    hideAllPages();
    const page = document.getElementById(id);
    if (page) page.classList.remove("hidden");

    window.scrollTo({ top: 0, behavior: "smooth" });
}

function goHome() {
    showPage("homePage");
    updateNav("home");
}

function openWheel() {
    showPage("wheelPage");
    updateNav("games");
    updateBalance();
}

function openGames() {
    showPage("homePage");
    updateNav("games");
    setTimeout(() => {
        const games = document.querySelector(".games-section");
        if (games) games.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
}

function openBalance(mode = "deposit") {
    showPage("balancePage");
    setBalanceMode(mode);
    updateNav("balance");
    updateBalance();
}

function openProfile() {
    showPage("profilePage");
    updateNav("profile");
    updateBalance();
    loadTelegramUser();
}

function openBonus() {
    showPage("bonusPage");
    updateNav("bonus");
}

function updateNav(active) {
    const navItems = document.querySelectorAll(".nav-item");
    navItems.forEach(item => item.classList.remove("active"));

    const map = {
        home: "homeNav",
        games: "gamesNav",
        balance: "balanceNav",
        bonus: "bonusNav",
        profile: "profileNav"
    };

    const activeElement = document.getElementById(map[active]);
    if (activeElement) activeElement.classList.add("active");
}


/* =========================
   ОТРИСОВКА SVG-КОЛЕСА
========================= */

function drawWheel() {
    const wheelSvg = document.getElementById('wheelSvg');
    const rewardList = document.getElementById('rewardList');

    if (!wheelSvg) return;

    const total = sectors.length;
    const sliceAngle = 360 / total;
    const radius = 150;
    const center = 150;

    let svgContent = '';
    let rewardsHtml = '';

    sectors.forEach((sector, i) => {
        const startAngle = i * sliceAngle - 90;
        const endAngle = startAngle + sliceAngle;

        const x1 = center + radius * Math.cos((Math.PI * startAngle) / 180);
        const y1 = center + radius * Math.sin((Math.PI * startAngle) / 180);
        const x2 = center + radius * Math.cos((Math.PI * endAngle) / 180);
        const y2 = center + radius * Math.sin((Math.PI * endAngle) / 180);

        const pathData = `M ${center} ${center} L ${x1} ${y1} A ${radius} ${radius} 0 0 1 ${x2} ${y2} Z`;

        const textAngle = startAngle + sliceAngle / 2;
        const textRadius = radius * 0.68;
        const textX = center + textRadius * Math.cos((Math.PI * textAngle) / 180);
        const textY = center + textRadius * Math.sin((Math.PI * textAngle) / 180);

        svgContent += `
            <path d="${pathData}" fill="${sector.color}" class="wheel-sector" />
            <text x="${textX}" y="${textY}" class="wheel-sector-text" transform="rotate(${textAngle + 90}, ${textX}, ${textY})">
                ${sector.label}
            </text>
        `;

        rewardsHtml += `
            <div class="reward-item">
                <span>${sector.icon}</span>
                <b>Множитель ${sector.label}</b>
            </div>
        `;
    });

    wheelSvg.innerHTML = svgContent;
    if (rewardList) rewardList.innerHTML = rewardsHtml;
}


/* =========================
   ПАНЕЛЬ СТАВОК
========================= */

function adjustBet(type) {
    if (wheelSpinning) return;

    const input = document.getElementById('betInput');
    if (!input) return;

    let currentBet = parseFloat(input.value) || 0;

    switch(type) {
        case 'min':
            currentBet = 1;
            break;
        case 'half':
            currentBet = Math.max(1, Math.floor(currentBet / 2));
            break;
        case 'x2':
            currentBet = currentBet * 2;
            break;
        case 'max':
            currentBet = Math.floor(currentBalance);
            break;
    }

    if (currentBet > currentBalance) currentBet = currentBalance;
    if (currentBet < 1) currentBet = 1;

    input.value = currentBet;
}


/* =========================
   ВРАЩЕНИЕ КОЛЕСА
========================= */

function getRandomSectorIndex() {
    const totalWeight = sectors.reduce((sum, sector) => sum + sector.weight, 0);
    let randomNum = Math.random() * totalWeight;

    for (let i = 0; i < sectors.length; i++) {
        if (randomNum < sectors[i].weight) {
            return i;
        }
        randomNum -= sectors[i].weight;
    }
    return 0;
}

function spinWheel() {
    if (wheelSpinning) return;

    const betInput = document.getElementById('betInput');
    const button = document.getElementById('spinButton');
    const result = document.getElementById('wheelResult');
    const resultValue = document.getElementById('resultValue');
    const wheelSvg = document.getElementById('wheelSvg');

    if (!betInput || !button || !wheelSvg) return;

    const betAmount = parseFloat(betInput.value);

    if (isNaN(betAmount) || betAmount < 1) {
        showMessage("Минимальная ставка: 1 $");
        return;
    }

    if (betAmount > currentBalance) {
        showMessage("Недостаточно средств на балансе!");
        return;
    }

    // Списание ставки
    currentBalance -= betAmount;
    updateBalance();

    wheelSpinning = true;
    button.disabled = true;
    button.innerHTML = '<span class="spin-icon">↻</span> Вращение...';

    if (result) result.classList.remove('show');
    if (resultValue) resultValue.textContent = '?';

    // Случайный сектор по вероятности
    const rewardIndex = getRandomSectorIndex();
    const totalSectors = sectors.length;
    const sectorAngle = 360 / totalSectors;

    // Расчет угла остановки под стрелку вверху
    const targetCenter = (rewardIndex * sectorAngle) + (sectorAngle / 2);
    const stopAngle = 360 - targetCenter;

    const fullSpins = 5 + Math.floor(Math.random() * 2);
    wheelRotation += fullSpins * 360 + (stopAngle - (wheelRotation % 360));

    wheelSvg.style.transform = `rotate(${wheelRotation}deg)`;

    setTimeout(() => {
        wheelSpinning = false;
        button.disabled = false;
        button.innerHTML = '<span class="spin-icon">↻</span> Крутить колесо';

        const wonSector = sectors[rewardIndex];
        const winAmount = betAmount * wonSector.mult;

        // Зачисление выигрыша
        currentBalance += winAmount;
        updateBalance();

        if (resultValue) {
            resultValue.textContent = `${winAmount.toFixed(2)} $ (${wonSector.label})`;
        }

        if (result) result.classList.add('show');

        // Виброотклик Telegram
        if (tg?.HapticFeedback) {
            tg.HapticFeedback.notificationOccurred(wonSector.mult > 0 ? "success" : "warning");
        }

    }, 4500);
}


/* =========================
   ПОПОЛНЕНИЕ / ВЫВОД
========================= */

function setBalanceMode(mode) {
    balanceMode = mode;

    const depositTab = document.getElementById("depositTab");
    const withdrawTab = document.getElementById("withdrawTab");
    const title = document.getElementById("formTitle");
    const subtitle = document.getElementById("formSubtitle");
    const action = document.getElementById("balanceAction");

    if (!depositTab || !withdrawTab || !title || !subtitle || !action) return;

    depositTab.classList.remove("active");
    withdrawTab.classList.remove("active");

    if (mode === "deposit") {
        depositTab.classList.add("active");
        title.textContent = "Пополнение баланса";
        subtitle.textContent = "Выберите удобный способ пополнения";
        action.textContent = "Пополнить";
    }

    if (mode === "withdraw") {
        withdrawTab.classList.add("active");
        title.textContent = "Вывод средств";
        subtitle.textContent = "Выберите способ вывода средств";
        action.textContent = "Вывести";
    }
}

function toggleMethods() {
    const dropdown = document.getElementById("methodsDropdown");
    const arrow = document.getElementById("methodArrow");

    if (!dropdown) return;
    dropdown.classList.toggle("open");

    if (arrow) {
        arrow.textContent = dropdown.classList.contains("open") ? "▲" : "▼";
    }
}

function selectMethod(method, icon) {
    selectedMethod = method;
    selectedMethodIcon = icon;

    const selected = document.getElementById("selectedMethod");
    const iconElement = document.getElementById("selectedMethodIcon");
    const dropdown = document.getElementById("methodsDropdown");
    const arrow = document.getElementById("methodArrow");

    if (selected) selected.textContent = method;
    if (iconElement) iconElement.textContent = icon;
    if (dropdown) dropdown.classList.remove("open");
    if (arrow) arrow.textContent = "▼";
}

function demoBalanceAction() {
    const input = document.getElementById("amountInput");
    if (!input) return;

    const amount = parseFloat(input.value);

    if (!amount || amount <= 0) {
        showMessage("Введите сумму");
        return;
    }

    if (balanceMode === "deposit") {
        currentBalance += amount;
        updateBalance();
        showMessage(`Демо: пополнено ${amount.toFixed(2)} $ через ${selectedMethod}`);
        return;
    }

    if (amount > currentBalance) {
        showMessage("Недостаточно средств");
        return;
    }

    currentBalance -= amount;
    updateBalance();
    showMessage(`Демо: отправлено на вывод ${amount.toFixed(2)} $ через ${selectedMethod}`);
}


/* =========================
   БОНУС И УВЕДОМЛЕНИЯ
========================= */

function claimBonus() {
    showMessage("Демо: ежедневный бонус пока не подключён");
}

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

document.addEventListener("DOMContentLoaded", () => {
    drawWheel();
    loadTelegramUser();
    updateBalance();
    goHome();
});
