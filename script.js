const tg = window.Telegram?.WebApp;

if (tg) {
    tg.ready();
    tg.expand();
}

/* =========================
   ДАННЫЕ И БАЛАНС
========================= */

let currentBalance = 125.50;
let balanceMode = "deposit";

let selectedMethod = "CryptoBot";
let selectedMethodSub = "Криптовалюта";
let selectedMethodIcon = "🤖";

let selectedColors = new Set(['green']); 

// Начальный список последних транзакций
let transactions = [
    { type: 'deposit', method: 'CryptoBot', icon: '🤖', amount: 50.00, date: 'Сегодня, 14:20', status: 'success' },
    { type: 'withdraw', method: 'xRocket', icon: '🚀', amount: 20.00, date: 'Вчера, 18:05', status: 'success' },
    { type: 'deposit', method: 'CryptoBot', icon: '🤖', amount: 95.50, date: '21 Июля', status: 'success' }
];

const COLOR_CONFIG = {
    green:  { label: '1x',  mult: 1,  color: '#2ecc71', name: 'Зеленый' },
    red:    { label: '2x',  mult: 2,  color: '#e74c3c', name: 'Красный' },
    blue:   { label: '3x',  mult: 3,  color: '#3498db', name: 'Синий' },
    yellow: { label: '5x',  mult: 5,  color: '#f1c40f', name: 'Желтый' },
    gold:   { label: '50x', mult: 50, color: '#ffd700', name: 'Золото' }
};

const sectors = [
    { type: 'gold',   ...COLOR_CONFIG.gold },
    { type: 'green',  ...COLOR_CONFIG.green },
    { type: 'red',    ...COLOR_CONFIG.red },
    { type: 'green',  ...COLOR_CONFIG.green },
    { type: 'blue',   ...COLOR_CONFIG.blue },
    { type: 'green',  ...COLOR_CONFIG.green },
    { type: 'red',    ...COLOR_CONFIG.red },
    { type: 'yellow', ...COLOR_CONFIG.yellow },
    { type: 'green',  ...COLOR_CONFIG.green },
    { type: 'red',    ...COLOR_CONFIG.red },
    { type: 'green',  ...COLOR_CONFIG.green },
    { type: 'blue',   ...COLOR_CONFIG.blue },
    { type: 'green',  ...COLOR_CONFIG.green },
    { type: 'red',    ...COLOR_CONFIG.red },
    { type: 'green',  ...COLOR_CONFIG.green },
    { type: 'yellow', ...COLOR_CONFIG.yellow },
    { type: 'green',  ...COLOR_CONFIG.green },
    { type: 'red',    ...COLOR_CONFIG.red },
    { type: 'green',  ...COLOR_CONFIG.green },
    { type: 'blue',   ...COLOR_CONFIG.blue },
    { type: 'green',  ...COLOR_CONFIG.green },
    { type: 'red',    ...COLOR_CONFIG.red },
    { type: 'green',  ...COLOR_CONFIG.green },
    { type: 'yellow', ...COLOR_CONFIG.yellow },
    { type: 'green',  ...COLOR_CONFIG.green },
    { type: 'red',    ...COLOR_CONFIG.red },
    { type: 'green',  ...COLOR_CONFIG.green },
    { type: 'blue',   ...COLOR_CONFIG.blue },
    { type: 'green',  ...COLOR_CONFIG.green },
    { type: 'red',    ...COLOR_CONFIG.red },
    { type: 'green',  ...COLOR_CONFIG.green },
    { type: 'red',    ...COLOR_CONFIG.red }
];

let wheelRotation = 0;
let wheelSpinning = false;

/* =========================
   TELEGRAM USER & БАЛАНС
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

function updateBalance() {
    const value = currentBalance.toFixed(2) + " $";

    const topBalance = document.getElementById("topBalance");
    const balanceCardValue = document.getElementById("balanceCardValue");
    const profileBalance = document.getElementById("profileBalance");
    const betBalanceText = document.getElementById("betBalanceText");

    if (topBalance) topBalance.textContent = value;
    if (balanceCardValue) balanceCardValue.textContent = value;
    if (profileBalance) profileBalance.textContent = value;
    if (betBalanceText) betBalanceText.textContent = `Баланс: ${value}`;
    
    updateTotalBet();
}

/* =========================
   ТРАНЗАКЦИИ
========================= */

function renderTransactions() {
    const list = document.getElementById("historyList");
    const count = document.getElementById("txCount");
    if (!list) return;

    if (count) count.textContent = `${transactions.length} операций`;

    if (transactions.length === 0) {
        list.innerHTML = `<div style="text-align:center; color:#666; font-size:13px; padding:15px;">История пуста</div>`;
        return;
    }

    list.innerHTML = transactions.map(tx => {
        const isDep = tx.type === 'deposit';
        const sign = isDep ? '+' : '-';
        const title = isDep ? 'Пополнение' : 'Вывод средств';
        const statusText = tx.status === 'success' ? 'Успешно' : 'В обработке';

        return `
            <div class="history-item">
                <div class="tx-left">
                    <div class="tx-icon ${tx.type}">
                        ${isDep ? '↙' : '↗'}
                    </div>
                    <div class="tx-details">
                        <span class="tx-title">${title}</span>
                        <span class="tx-subtitle">${tx.icon} ${tx.method} • ${tx.date}</span>
                    </div>
                </div>
                <div class="tx-right">
                    <span class="tx-amount ${tx.type}">${sign}${tx.amount.toFixed(2)} $</span>
                    <span class="tx-status ${tx.status}">${statusText}</span>
                </div>
            </div>
        `;
    }).join('');
}

/* =========================
   НАВИГАЦИЯ
========================= */

function hideAllPages() {
    const pages = ["homePage", "wheelPage", "balancePage", "profilePage", "bonusPage"];
    pages.forEach(id => {
        const page = document.getElementById(id);
        if (page) page.classList.add("hidden");
    });
    closeMethodsDropdown();
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

function openGamesMenu() {
    showPage("homePage");
    updateNav("games");
    const gamesSection = document.getElementById("gamesListSection");
    if (gamesSection) {
        gamesSection.scrollIntoView({ behavior: "smooth" });
    }
}

function openWheel() {
    showPage("wheelPage");
    updateNav("games");
    updateBalance();
    drawWheel();
    renderColorButtons();
}

function openBalance(mode = "deposit") {
    showPage("balancePage");
    setBalanceMode(mode);
    updateNav("balance");
    updateBalance();
    renderTransactions();
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

    const map = { home: "homeNav", games: "gamesNav", balance: "balanceNav", bonus: "bonusNav", profile: "profileNav" };
    const activeElement = document.getElementById(map[active]);
    if (activeElement) activeElement.classList.add("active");
}

/* =========================
   ОТРИСОВКА SVG КОЛЕСА
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

    sectors.forEach((sector, i) => {
        const startAngle = i * sliceAngle - 90;
        const endAngle = startAngle + sliceAngle;

        const x1 = center + radius * Math.cos((Math.PI * startAngle) / 180);
        const y1 = center + radius * Math.sin((Math.PI * startAngle) / 180);
        const x2 = center + radius * Math.cos((Math.PI * endAngle) / 180);
        const y2 = center + radius * Math.sin((Math.PI * endAngle) / 180);

        const pathData = `M ${center} ${center} L ${x1} ${y1} A ${radius} ${radius} 0 0 1 ${x2} ${y2} Z`;

        const textAngle = startAngle + sliceAngle / 2;
        const textRadius = radius * 0.75;
        const textX = center + textRadius * Math.cos((Math.PI * textAngle) / 180);
        const textY = center + textRadius * Math.sin((Math.PI * textAngle) / 180);

        svgContent += `
            <path d="${pathData}" fill="${sector.color}" class="wheel-sector" />
            <text x="${textX}" y="${textY}" class="wheel-sector-text" style="font-size: 8px;" transform="rotate(${textAngle + 90}, ${textX}, ${textY})">
                ${sector.label}
            </text>
        `;
    });

    wheelSvg.innerHTML = svgContent;

    if (rewardList) {
        rewardList.innerHTML = Object.keys(COLOR_CONFIG).map(key => {
            const cfg = COLOR_CONFIG[key];
            return `
                <div style="background:#161616; border:1px solid #222; padding:10px; border-radius:12px; display:flex; align-items:center; gap:8px;">
                    <span style="background:${cfg.color}; width:16px; height:16px; border-radius:50%; display:inline-block;"></span>
                    <b style="font-size:12px;">${cfg.name} (${cfg.label})</b>
                </div>
            `;
        }).join('');
    }
}

/* =========================
   МУЛЬТИ-СТАВКИ И СТАВКА
========================= */

function toggleBetColor(color) {
    if (wheelSpinning) return;

    if (selectedColors.has(color)) {
        if (selectedColors.size > 1) selectedColors.delete(color);
    } else {
        selectedColors.add(color);
    }

    renderColorButtons();
    updateTotalBet();
}

function renderColorButtons() {
    const buttons = document.querySelectorAll('.color-btn');
    buttons.forEach(btn => {
        const c = btn.getAttribute('data-color');
        if (selectedColors.has(c)) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

function updateTotalBet() {
    const betInput = document.getElementById('betInput');
    const totalInfo = document.getElementById('totalBetInfo');
    if (!betInput || !totalInfo) return;

    const baseBet = parseFloat(betInput.value) || 0;
    const totalBet = baseBet * selectedColors.size;
    totalInfo.textContent = `Общая ставка (${selectedColors.size} цв.): ${totalBet.toFixed(2)} $`;
}

function adjustBet(type) {
    if (wheelSpinning) return;
    const input = document.getElementById('betInput');
    if (!input) return;

    let currentBet = parseFloat(input.value) || 0;

    switch(type) {
        case 'min': currentBet = 1; break;
        case 'half': currentBet = Math.max(1, Math.floor(currentBet / 2)); break;
        case 'x2': currentBet *= 2; break;
        case 'max': currentBet = Math.floor(currentBalance / selectedColors.size); break;
    }

    if (currentBet * selectedColors.size > currentBalance) {
        currentBet = Math.floor(currentBalance / selectedColors.size);
    }
    if (currentBet < 1) currentBet = 1;

    input.value = currentBet;
    updateTotalBet();
}

async function spinWheel() {
    if (wheelSpinning) return;

    const betInput = document.getElementById('betInput');
    const button = document.getElementById('spinButton');
    const result = document.getElementById('wheelResult');
    const resultValue = document.getElementById('resultValue');
    const wheelSvg = document.getElementById('wheelSvg');
    const wheelStage = document.querySelector('.wheel-stage');

    if (!betInput || !button || !wheelSvg) return;

    const baseBet = parseFloat(betInput.value);
    const totalBet = baseBet * selectedColors.size;

    if (isNaN(baseBet) || baseBet < 1) {
        showMessage("Минимальная ставка: 1 $");
        return;
    }

    if (totalBet > currentBalance) {
        showMessage("Недостаточно средств на балансе!");
        return;
    }

    button.disabled = true;
    currentBalance -= totalBet;
    updateBalance();

    wheelSpinning = true;
    button.innerHTML = '↻ Вращение...';

    if (result) result.classList.remove('show');
    if (resultValue) resultValue.textContent = '?';

    const rewardIndex = Math.floor(Math.random() * sectors.length);
    const totalSectors = sectors.length;
    const sectorAngle = 360 / totalSectors;

    const targetCenter = (rewardIndex * sectorAngle) + (sectorAngle / 2);
    const stopAngle = 360 - targetCenter;

    const fullSpins = 6;
    wheelRotation += fullSpins * 360 + (stopAngle - (wheelRotation % 360));

    wheelSvg.style.transform = `rotate(${wheelRotation}deg)`;

    setTimeout(() => {
        if (wheelStage) wheelStage.classList.add('zoomed');
    }, 3200);

    setTimeout(() => {
        wheelSpinning = false;
        button.disabled = false;
        button.innerHTML = '↻ Сделать ставку';

        if (wheelStage) wheelStage.classList.remove('zoomed');

        const wonSector = sectors[rewardIndex];
        
        let totalWin = 0;
        if (selectedColors.has(wonSector.type)) {
            totalWin = baseBet * wonSector.mult;
            currentBalance += totalWin;
            updateBalance();
        }

        if (resultValue) {
            if (totalWin > 0) {
                resultValue.textContent = `Победа +${totalWin.toFixed(2)} $ (${wonSector.label})`;
                resultValue.style.color = '#2ecc71';
            } else {
                resultValue.textContent = `Выпал ${wonSector.name} (${wonSector.label})`;
                resultValue.style.color = '#e74c3c';
            }
        }

        if (result) result.classList.add('show');

        if (tg?.HapticFeedback) {
            tg.HapticFeedback.notificationOccurred(totalWin > 0 ? "success" : "error");
        }

    }, 5000);
}

/* =========================
   ПОПОЛНЕНИЕ / ВЫВОД И МЕТОДЫ
========================= */

function closeMethodsDropdown() {
    const dropdown = document.getElementById("methodsDropdown");
    const arrow = document.getElementById("methodArrow");
    if (dropdown) dropdown.classList.remove("open");
    if (arrow) arrow.textContent = "▼";
}

function setBalanceMode(mode) {
    balanceMode = mode;
    closeMethodsDropdown();

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

function selectMethod(method, icon, sub) {
    selectedMethod = method;
    selectedMethodIcon = icon;
    selectedMethodSub = sub;

    const selected = document.getElementById("selectedMethod");
    const selectedSub = document.getElementById("selectedMethodSub");
    const iconElement = document.getElementById("selectedMethodIcon");

    if (selected) selected.textContent = method;
    if (selectedSub) selectedSub.textContent = sub;
    if (iconElement) iconElement.textContent = icon;

    closeMethodsDropdown();
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

        // Добавляем запись в историю транзакций
        transactions.unshift({
            type: 'deposit',
            method: selectedMethod,
            icon: selectedMethodIcon,
            amount: amount,
            date: 'Только что',
            status: 'success'
        });
        renderTransactions();

        showMessage(`Демо: пополнено ${amount.toFixed(2)} $ через ${selectedMethod}`);
        return;
    }

    if (amount > currentBalance) {
        showMessage("Недостаточно средств");
        return;
    }

    currentBalance -= amount;
    updateBalance();

    // Добавляем запись в историю транзакций
    transactions.unshift({
        type: 'withdraw',
        method: selectedMethod,
        icon: selectedMethodIcon,
        amount: amount,
        date: 'Только что',
        status: 'pending'
    });
    renderTransactions();

    showMessage(`Демо: отправлено на вывод ${amount.toFixed(2)} $ через ${selectedMethod}`);
}

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
    loadTelegramUser();
    updateBalance();
    renderTransactions();
    goHome();

    const betInput = document.getElementById('betInput');
    if (betInput) {
        betInput.addEventListener('input', updateTotalBet);
    }
});
