//Модалка дисклеймера
const modalDis = `
  <h3>⚠️ Отказ от прав</h3>
  <br>
  <p>Данное приложение создано фанатом для фанатов настольной версии игры <strong>«Гвинт»</strong> из The Witcher 3: Wild Hunt.</p>

  <p>Я не претендую на права на интеллектуальную собственность, связанную с вселенной «Ведьмака» и игрой «Гвинт». Все права принадлежат их законным владельцам:</p>
  <br>
  CD Projekt Red
  <br>
  Andrzej Sapkowski (книги о Ведьмаке)
  <br>
  <br>
  <p>Приложение создано в некоммерческих целях, для удобства игроков в настольный Гвинт. Я не продаю контент и не получаю прибыль от распространения.</p>
  <br>
  <p>В приложении используются только названия фракций, имена персонажей и игровые механики, которые являются частью игровой вселенной и не нарушают авторские права при некоммерческом использовании.</p>
  <br>
  <p class="disclaimer-note">Если вы являетесь правообладателем и считаете, что ваши права нарушены — свяжитесь со мной, и я оперативно решу вопрос.</p>
      <button class="btn" onclick="openModal('fraction')">Понятно</button>

  `;
//Модалка фракций
const modalFractions = `
      <input type="text" class="card_name btn" id="name" placeholder="Введите имя...">
      <h3>Выберите фракцию</h3>
      <button class="btn fraction" onclick="closeAllModal(); selectFraction('Северные')">Северные</button>
      <button class="btn fraction" onclick="closeAllModal(); selectFraction('Нильфгаард')">Нильфгаард</button>
      <button class="btn fraction" onclick="closeAllModal(); selectFraction('Чудовища')">Чудовица</button>
      <button class="btn fraction" onclick="closeAllModal(); selectFraction('Скоятаэли')">Скоятаэли</button>
      <button class="btn fraction" onclick="closeAllModal(); selectFraction('Скеллиге')">Скеллиге</button>
  `;
//Модалка карт
const modalCards = `
<p>Фракция</p>
  <div class="filters fraction_btns">
    <button class="btn btn_filter" onclick="filterFraction('all')">Все</button>
    <button class="btn btn_filter" onclick="filterFraction('nothern')">Север</button>
    <button class="btn btn_filter" onclick="filterFraction('skellige')">Скеллиге</button>
    <button class="btn btn_filter" onclick="filterFraction('nilfgaard')">Нильфгаард</button>
    <button class="btn btn_filter" onclick="filterFraction('monster')">Чудовища</button>
    <button class="btn btn_filter" onclick="filterFraction('skoitael')">Скоятаели</button>
    <button class="btn btn_filter" onclick="filterFraction('neutral')">Нейтральные</button>
  </div>
  <br>
  <p>Ряд</p>
  <div class="filters row_btns">
    <button class="btn btn_filter" onclick="filterRow('all')">Все</button>
    <button class="btn btn_filter" onclick="filterRow('melee')">Ближний</button>
    <button class="btn btn_filter" onclick="filterRow('range')">Дальний</button>
    <button class="btn btn_filter" onclick="filterRow('siege')">Осадный</button></div>
<br>
<div class="card_container"></div>
<div>
<button class="btn gof" onclick="closeAllModal()">Закрыть</button></div>
</div>
`
