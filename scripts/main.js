//#region Модалки

// Находим контейнер, куда будут вставляться модалки
const modalWindow = document.querySelector(".modal_window");

// Функция которая вставляет HTML конкретной модалки в контейнер
function renderModal(modalId) {
  if (modalId === "dis") {
    modalWindow.innerHTML = modalDis;           // вставляем дисклеймер
  } else if (modalId === "fraction") {
    modalWindow.innerHTML = modalFractions;     // вставляем выбор фракции
    } else if (modalId === "cards") {
    modalWindow.innerHTML = modalCards;         // вставляем список карт
    showFiltered();                             // сразу фильтруем карты
  }
}

// Открывает модалку по ID (получает тип, рендерит и показывает)
function openModal(modalId) {
  const modalType = modalId.replace("modal_", "");  // отрезаем "modal_"
  renderModal(modalType);                           // вставляем нужную
}

// При загрузке страницы открываем модалку с дисклеймером
window.addEventListener("load", function () {
  openModal("modal_dis");
});

// Закрываем все модалки (добавляем класс close)
function closeAllModal() {
  const modal = document.getElementById("modal");
  modal.classList.add("close");
}

// Открываем все модалки (убираем класс close)
function openAllModal() {
  const modal = document.getElementById("modal");
  modal.classList.remove("close");
}

//#endregion

// Вставляем имя игрока и выбранную фракцию в интерфейс
function selectFraction(fractionName) {
  const playerName = document.getElementById("name").value || "Безымянный";
  document.querySelector(".my_name").textContent = `${playerName}`;
  document.querySelector(".my_fraction").textContent = `${fractionName}`;
  closeAllModal();  // закрываем модалку после выбора
}

//#region Фильтр карт

// Состояние рогов для каждого ряда
let meleeHornActive = false;
let rangeHornActive = false;
let siegeHornActive = false;

// Массивы карт в каждом ряду
let meleeRow = [];
let rangeRow = [];
let siegeRow = [];

// Текущая погода (по умолчанию ясно)
let currentWeather = "clear";

// Текущие значения фильтров
let selectedFraction = "all";
let selectedRow = "all";

// Фильтр по фракции
function filterFraction(fraction) {
  selectedFraction = fraction;
  showFiltered();  // показываем отфильтрованные карты
}

// Фильтр по ряду
function filterRow(row) {
  selectedRow = row;
  showFiltered();  // показываем отфильтрованные карты
}

// Показывает отфильтрованные карты в модалке
function showFiltered() {
  let result = document.querySelector(".card_container");
  result.innerHTML = "";  // очищаем контейнер

  for (let i = 0; i < cards.length; i++) {
    let card = cards[i];

    // Проверяем подходит ли карта под фильтры
    let fractionOk = selectedFraction === "all" || card.fraction === selectedFraction;
    let rowOk = selectedRow === "all" || card.row === selectedRow;

    if (fractionOk && rowOk) {
      // Если подходит — добавляем кнопку с картой
      result.innerHTML += `<p class="btn btn_cards" onclick="addToRow('${card.id}'); closeAllModal()"><span class="remove_btn"> ${card.power}</span> ${card.name} <span class="remove_btn"></span></p>`;
    }
  }

  // Подсвечиваем активную кнопку фильтра фракций
  const fractionBtns = document.querySelector(".fraction_btns");
  if (fractionBtns) {
    fractionBtns.addEventListener("click", function (e) {
      const btn = e.target.closest(".btn");
      fractionBtns.querySelectorAll(".btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
    });
  }

  // Подсвечиваем активную кнопку фильтра рядов
  const rowBtns = document.querySelector(".row_btns");
  if (rowBtns) {
    rowBtns.addEventListener("click", function (e) {
      const btn = e.target.closest(".btn");
      rowBtns.querySelectorAll(".btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
    });
  }
}

//#endregion

// Добавляет карту в нужный ряд по ID
function addToRow(cardId) {
  let card = cards.find((c) => c.id == cardId);  // ищем карту в общем массиве

  // Кладём в соответствующий массив
  if (card.row === "melee") {
    meleeRow.push(card);
  } else if (card.row === "range") {
    rangeRow.push(card);
  } else if (card.row === "siege") {
    siegeRow.push(card);
  }

  renderRows();  // перерисовываем ряды
  sumPonts();    // пересчитываем общую сумму
}

// Включает/выключает рог в указанном ряду
function toggleHorn(rowType) {
  const hornM = document.querySelector(".melee_horn");
  const hornR = document.querySelector(".range_horn");
  const hornS = document.querySelector(".siege_horn");
  if (rowType === "melee") {
    meleeHornActive = !meleeHornActive;
    if (meleeHornActive) {
      hornM.classList.add("active");
    } else {
      hornM.classList.remove("active");
    }
  } else if (rowType === "range") {
    rangeHornActive = !rangeHornActive;
    if (rangeHornActive) {
      hornR.classList.add("active");
    } else {
      hornR.classList.remove("active");
    }
  } else if (rowType === "siege") {
    siegeHornActive = !siegeHornActive;
    if (siegeHornActive) {
      hornS.classList.add("active");
    } else {
      hornS.classList.remove("active");
    }
  }
  renderRows();
  sumPonts();
}

// ГЛАВНАЯ ФУНКЦИЯ РАСЧЁТА — применяет все модификаторы к ряду
function calculateRowPower(rowArray, rowType) {

  // ===== ШАГ 1: ПОГОДА =====
  let afterWeather = [];
  for (let i = 0; i < rowArray.length; i++) {
    let card = rowArray[i];
    let power = card.power;  // берём базовую силу

    // Если не герой и сила > 0 — проверяем погоду
    if (!card.hero && card.power > 0) {
      if (rowType === "melee" && currentWeather === "frost") {
        power = 1;  // мороз валит ближних
      } else if (rowType === "range" && (currentWeather === "fog" || currentWeather === "storm")) {
        power = 1;  // туман/шторм валят дальних
      } else if (rowType === "siege" && (currentWeather === "rain" || currentWeather === "storm")) {
        power = 1;  // дождь/шторм валят осадных
      }
    }

    afterWeather.push({ ...card, power: power });  // сохраняем карту с новой силой
  }

  // ===== ШАГ 2: МОРАЛЬ =====
  // Считаем сколько карт с моралью
  let moraleCount = 0;
  for (let i = 0; i < afterWeather.length; i++) {
    if (afterWeather[i].skill === "morale") moraleCount++;
  }

  let afterMorale = [];
  if (moraleCount === 0) {
    afterMorale = [...afterWeather];  // если морали нет — копируем как есть
  } else {
    for (let i = 0; i < afterWeather.length; i++) {
      let card = afterWeather[i];
      let newPower = card.power;

      // Сколько других моральных карт (не считая себя)
      let otherMoraleCount = moraleCount - (card.skill === "morale" ? 1 : 0);

      // Герои не получают мораль
      if (card.hero !== "hero") {
        newPower = newPower + otherMoraleCount;  // +1 за каждую другую моральную
      }

      afterMorale.push({ ...card, power: newPower });
    }
  }

  // ===== ШАГ 3: СВЯЗЬ (BOND) =====
  // Считаем сколько карт каждого имени (только со связью)
  let nameCount = {};
  for (let i = 0; i < afterMorale.length; i++) {
    let card = afterMorale[i];
    if (card.skill === "bond") {
      nameCount[card.name] = (nameCount[card.name] || 0) + 1;
    }
  }

  let afterBond = [];
  for (let i = 0; i < afterMorale.length; i++) {
    let card = afterMorale[i];
    let newPower = card.power;

    // Если карта со связью
    if (card.skill === "bond") {
      let count = nameCount[card.name] || 1;
      if (count > 1) {
        newPower = newPower * count;  // умножаем на количество таких карт
      }
    }

    afterBond.push({ ...card, power: newPower });
  }

// ===== ШАГ 4: РОГ =====
let hornFromButton = false;  // рог от кнопки
let hornFromCard = false;    // есть карта с рогом

if (rowType === "melee" && meleeHornActive) hornFromButton = true;
if (rowType === "range" && rangeHornActive) hornFromButton = true;
if (rowType === "siege" && siegeHornActive) hornFromButton = true;

for (let i = 0; i < afterBond.length; i++) {
  if (afterBond[i].skill === "horn") {
    hornFromCard = true;
    break;
  }
}

let afterHorn = [];
for (let i = 0; i < afterBond.length; i++) {
  let card = afterBond[i];
  let newPower = card.power;

  // Определяем, должна ли карта получить рог
  let shouldGetHorn = false;

  if (card.hero !== "hero") {  // не герой
    if (card.skill === "horn") {
      // Карта с рогом получает рог ТОЛЬКО от кнопки
      shouldGetHorn = hornFromButton;
    } else {
      // Обычная карта получает рог если есть кнопка ИЛИ карта с рогом
      shouldGetHorn = hornFromButton || hornFromCard;
    }
  }

  if (shouldGetHorn) {
    newPower = newPower * 2;
  }

  afterHorn.push({ ...card, power: newPower });
}

  // ===== ФОРМИРУЕМ РЕЗУЛЬТАТ =====
  let result = {
    total: 0,                 // общая сила ряда
    cardsWithPower: []        // карты с итоговой силой
  };

  for (let i = 0; i < afterHorn.length; i++) {
    let card = afterHorn[i];
    result.total = result.total + card.power;
    result.cardsWithPower.push({
      card: card,
      power: card.power
    });
  }

  return result;  // возвращаем объект с суммой и картами
}

// Отрисовывает все ряды на странице
function renderRows() {
  // Ближний ряд
  let meleeData = calculateRowPower(meleeRow, "melee");
  document.getElementById("melee_points").textContent = meleeData.total;  // обновляем сумму

  let meleeContainer = document.getElementById("melee");
  meleeContainer.innerHTML = meleeData.cardsWithPower
    .map((item) => `<p class="btn btn_cards"> <span class="remove_btn">${item.power}</span> ${item.card.name} <span class="remove_btn" onclick="removeCard('${item.card.id}', 'melee')">✖</span></p>`)
    .join("");  // рисуем карточки

  // Дальний ряд
  let rangeData = calculateRowPower(rangeRow, "range");
  document.getElementById("range_points").textContent = rangeData.total;

  let rangeContainer = document.getElementById("range");
  rangeContainer.innerHTML = rangeData.cardsWithPower
    .map((item) => `<p class="btn btn_cards"> <span class="remove_btn">${item.power}</span> ${item.card.name} <span class="remove_btn" onclick="removeCard('${item.card.id}', 'melee')">✖</span></p>`)
    .join("");

  // Осадный ряд
  let siegeData = calculateRowPower(siegeRow, "siege");
  document.getElementById("siege_points").textContent = siegeData.total;

  let siegeContainer = document.getElementById("siege");
  siegeContainer.innerHTML = siegeData.cardsWithPower
    .map((item) => `<p class="btn btn_cards"> <span class="remove_btn">${item.power}</span> ${item.card.name} <span class="remove_btn" onclick="removeCard('${item.card.id}', 'melee')">✖</span></p>`)
    .join("");
}

// Открывает/закрывает блок с картами в ряду
function toggleRow(rowId) {
  let cardsDiv = document.getElementById(rowId);
  cardsDiv.classList.toggle("open");  // переключаем класс open
}

// Считает общую силу всех рядов
function sumPonts() {
  let sumid = document.getElementById("my_power");

  let melee = Number(document.getElementById("melee_points").textContent);
  let range = Number(document.getElementById("range_points").textContent);
  let siege = Number(document.getElementById("siege_points").textContent);

  let sumPoints = melee + range + siege;  // складываем

  sumid.textContent = sumPoints;  // показываем
}

// Слушаем изменение погоды
document.querySelector(".weather").addEventListener("change", function (e) {
  currentWeather = e.target.value;  // запоминаем новую погоду
  renderRows();  // пересчитываем ряды
  sumPonts();    // пересчитываем общую сумму
});

function removeCard(cardId, rowType) {
  // Находим ИНДЕКС первой карты с таким id
  let index = -1;

  if (rowType === "melee") {
    index = meleeRow.findIndex(card => card.id == cardId);
    if (index !== -1) meleeRow.splice(index, 1);
  } else if (rowType === "range") {
    index = rangeRow.findIndex(card => card.id == cardId);
    if (index !== -1) rangeRow.splice(index, 1);
  } else if (rowType === "siege") {
    index = siegeRow.findIndex(card => card.id == cardId);
    if (index !== -1) siegeRow.splice(index, 1);
  }

  renderRows();
  sumPonts();
}
