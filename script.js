// Интеграция с Telegram Web App
const tg = window.Telegram?.WebApp;
if (tg) {
    tg.expand();
    if (tg.initDataUnsafe?.user) {
        const user = tg.initDataUnsafe.user;
        const nameElem = document.getElementById('username');
        if (nameElem) {
            nameElem.textContent = user.first_name + (user.last_name ? ` ${user.last_name}` : '');
        }
    }
}

// Глобальные переменные состояния
let balance = 1000.00;
let isSpinning = false;
let currentRotation = 0;

// Конфигурация секторов колеса
const sectors = [
    { label: 'x0', mult: 0, color: '#2a2a2a', icon: '💀' },
    { label: 'x1.5', mult: 1.5, color: '#ff7b00', icon: '🔥' },
    { label: 'x2', mult: 2, color: '#ffd51c', icon: '⚡' },
    { label: 'x0.5', mult: 0.5, color: '#e85b00', icon: '📉' },
    { label: 'x5', mult: 5, color: '#ff8a00', icon: '🎁' },
    { label: 'x10', mult: 10, color: '#ffb900', icon: '💎' },
    { label: 'x0', mult: 0, color: '#2a2a2a', icon: '💀' },
    { label: 'x3', mult: 3, color: '#ffca12', icon: '⭐' }
];

// Навигация по страницам
function goHome() {
    document.getElementById('homePage').classList.remove('hidden');
    document.getElementById('wheelPage').classList.add('hidden');
    setActiveNav(0);
}

function openWheel() {
    document.getElementById('homePage').classList.add('hidden');
    document.getElementById('wheelPage').classList.remove('hidden');
    setActiveNav(1);
    updateBalanceDisplay();
}

function setActiveNav(index) {
    const navItems = document.querySelectorAll('.bottom-nav .nav-item');
    navItems.forEach((item, i) => {
        if (i === index) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}

function showMessage(msg) {
    if (tg && tg.showAlert) {
        tg.showAlert(msg);
    } else {
        alert(msg);
    }
}

function openBalance(type) {
    showMessage(`Страница "${type === 'deposit' ? 'Пополнить' : 'Вывести'}" находится в разработке`);
}

function openBonus() {
    showMessage('Ежедневный бонус будет доступен позже!');
}

function openProfile() {
    showMessage('Профиль игрока находится в разработке');
}

// Отрисовка SVG-колеса и списка наград
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

        // Центр секторов для выравнивания подписей
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

// Балансы и их обновление
function updateBalanceDisplay() {
    const topBal = document.getElementById('topBalance');
    const betBal = document.getElementById('betBalanceText');

    const formatted = balance.toFixed(2) + ' $';

    if (topBal) topBal.textContent = formatted;
    if (betBal) betBal.textContent = `Баланс: ${formatted}`;
}

// Быстрые кнопки ставок
function adjustBet(type) {
    if (isSpinning) return;

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
            currentBet = Math.floor(balance);
            break;
    }

    if (currentBet > balance) currentBet = balance;
    if (currentBet < 1) currentBet = 1;

    input.value = currentBet;
}

// Вращение колеса
function spinWheel() {
    if (isSpinning) return;

    const input = document.getElementById('betInput');
    const betAmount = parseFloat(input.value);

    if (isNaN(betAmount) || betAmount < 1) {
        showMessage('Минимальная ставка: 1 $');
        return;
    }

    if (betAmount > balance) {
        showMessage('Недостаточно средств на балансе!');
        return;
    }

    // Списываем сумму
    balance -= betAmount;
    updateBalanceDisplay();

    isSpinning = true;

    const spinBtn = document.getElementById('spinButton');
    const wheelResult = document.getElementById('wheelResult');
    const resultValue = document.getElementById('resultValue');
    const wheelSvg = document.getElementById('wheelSvg');

    spinBtn.disabled = true;
    wheelResult.classList.remove('show');

    // Определяем случайный сектор
    const totalSectors = sectors.length;
    const sectorAngle = 360 / totalSectors;
    const winIndex = Math.floor(Math.random() * totalSectors);

    // Стрелка находится вверху (0 градусов в физической системе)
    const targetCenter = (winIndex * sectorAngle) + (sectorAngle / 2);
    const stopAngle = 360 - targetCenter;

    // 5 полных оборотов
    const extraRounds = 360 * 5;
    currentRotation += extraRounds + (stopAngle - (currentRotation % 360));

    wheelSvg.style.transform = `rotate(${currentRotation}deg)`;

    // По завершению вращения
    setTimeout(() => {
        isSpinning = false;
        spinBtn.disabled = false;

        const wonSector = sectors[winIndex];
        const winAmount = betAmount * wonSector.mult;

        balance += winAmount;
        updateBalanceDisplay();

        if (resultValue) {
            if (wonSector.mult > 0) {
                resultValue.textContent = `+${winAmount.toFixed(2)} $ (${wonSector.label})`;
            } else {
                resultValue.textContent = `0.00 $ (x0)`;
            }
        }

        wheelResult.classList.add('show');
    }, 4500);
}

// Запуск инициализации при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    drawWheel();
    updateBalanceDisplay();
});
