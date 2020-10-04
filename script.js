"use strict";

window.onload = async function () {
  const filterCheckboxes = document.querySelectorAll(".input-default_checkbox");
  const sortRadios = document.querySelectorAll(".input-default_radio");

  try {
    let ticketsModule = await import("./test-response.js"); // заменить на: "./get-tickets.js"
    const tickets = await ticketsModule.getTickets();

    let filters = getFilters(filterCheckboxes);
    let sortValue = getSortValue(sortRadios);
    let filteredTickets = getFilteredTickets(tickets, ...filters);
    sortTickets(filteredTickets, sortValue);
    renderTickets(filteredTickets);

    // отрисовываем билеты после изменения фильтров
    filterCheckboxes.forEach((checkbox) => {
      checkbox.addEventListener("change", function () {
        clearTickets();
        filters = getFilters(filterCheckboxes);
        sortValue = getSortValue(sortRadios);
        filteredTickets = getFilteredTickets(tickets, ...filters);
        sortTickets(filteredTickets, sortValue);
        renderTickets(filteredTickets);
      });
    });

    // отрисовываем билеты после изменения сортировки
    sortRadios.forEach((radio) => {
      radio.addEventListener("change", () => {
        clearTickets();
        sortValue = getSortValue(sortRadios);
        sortTickets(filteredTickets, sortValue);
        renderTickets(filteredTickets);
      });
    });
  } catch (error) {
    console.log(error.message);
  }
};

// отрисовываем массив билетов
function renderTickets(ticketsArray) {
  ticketsArray.forEach((element) => {
    renderOneTicket(element);
  });
}

// отрисовываем один билет, ticketData - объект билета
function renderOneTicket(ticketData) {
  const ticketTemplate = document.querySelector("#ticket-template").content; // получаем template
  const ticket = ticketTemplate.cloneNode(true); // создаем новый экзепляр template
  const ticketPrice = ticket.querySelector(".ticket__price");
  const ticketLogo = ticket.querySelector("[data-item='carrier-logo']");

  ticketPrice.innerHTML = new Intl.NumberFormat("ru-RU", {
    //используем объект Intl для форматирования с учетом локали
    style: "currency",
    currency: "RUB",
    currencyDisplay: "symbol",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(ticketData.price);
  
  ticketLogo.src = `//pics.avs.io/99/36/${ticketData.carrier}.png`; // получаем logo.png авиакомпании из CDN

  // формируем и заполняем маршруты билета
  ticketData.segments.forEach((element) => {
    const routeTemplate = ticket.querySelector("#route-template").content;
    const ticketRoute = routeTemplate.cloneNode(true);
    const routeTitle = ticketRoute.querySelector(".route-title");
    const routeTime = ticketRoute.querySelector(".route-time");
    const routeLenght = ticketRoute.querySelector(".route-lenght");
    const routeSstopsCount = ticketRoute.querySelector(".route-stops-count");
    const routeStops = ticketRoute.querySelector(".route-stops");

    let routeDuration = {};
    routeDuration.mins = element.duration % 60;
    routeDuration.hours = (element.duration - routeDuration.mins) / 60;

    // получаем дату и времы вылета из строки и вычисляем время прилета использую продолжительность полета (без учета часовых поясов)
    let timeFormatOptions = { hour: "numeric", minute: "numeric" };
    let departureDate = new Date(element.date);
    let departureTime = departureDate.toLocaleTimeString(
      "ru-RU",
      timeFormatOptions
    );
    let arrivalDate = new Date(departureDate);
    arrivalDate.setMinutes(arrivalDate.getMinutes() + element.duration);
    let arrivalTime = arrivalDate.toLocaleTimeString(
      "ru-RU",
      timeFormatOptions
    );

    // заполняем маршрут
    routeTitle.textContent = `${element.origin} – ${element.destination}`;
    routeTime.textContent = `${departureTime} – ${arrivalTime}`;
    routeLenght.textContent = `${routeDuration.hours}ч ${routeDuration.mins}м`;
    routeSstopsCount.textContent = defineQuantityStops(element.stops.length);
    routeStops.textContent = element.stops.join(", ");

    ticket.children[0].append(ticketRoute); // добавляем в потомка DocumentFragment HTMLCollection
  });

  document.querySelector("#tickets-section").append(ticket); // добавляем заполненный экзепляр template в документ
}

// склоняем пересадку
function defineQuantityStops(number) {
  const words = ["без пересадок", "пересадка", "пересадки", "пересадок"];
  let n =
    (number >= 5 && number <= 20) ||
    (number % 10 >= 5 && number % 10 <= 20) ||
    (number != 0 && number % 10 == 0)
      ? 3
      : number % 10 == 1
      ? 1
      : number % 10 >= 2 && number % 10 <= 4
      ? 2
      : 0;
  if (number == 0) {
    return words[n];
  } else {
    return `${number} ${words[n]}`;
  }
}

//удаляем все билеты
function clearTickets() {
  let ticketsSection = document.querySelector("#tickets-section");
  while (ticketsSection.children.length > 1) {
    ticketsSection.lastElementChild.remove();
  }
}

// выбираем билеты по количеству пересадок
function getFilteredTickets(ticketsArray, ...filters) {
  if (filters.includes(-1)) {
    return ticketsArray; //если выбран фильтр "все" - возвращаем весь массив билетов
  }
  let result = ticketsArray.filter((ticket) => {
    let stopsQuantity = [];
    ticket.segments.forEach((element) => {
      stopsQuantity.push(element.stops.length);
    });

    //использовал .find() чтобы не "придумывать" прерывание цикла
    let findedFilter = filters.find(
      (filter) =>
        (stopsQuantity[0] == filter && stopsQuantity[1] <= filter) ||
        (stopsQuantity[0] <= filter && stopsQuantity[1] == filter)
    );

    if (findedFilter !== undefined) {
      return true;
    }
  });
  return result;
}

//получаем массив фильтров из чекбоксов
function getFilters(filterCheckboxes) {
  let result = [];
  filterCheckboxes.forEach((checkbox) => {
    if (checkbox.checked) {
      result.push(+checkbox.value);
    }
  });
  return result;
}

//получаем значение для сортировки билетов
function getSortValue(sortRadios) {
  for (let radio of sortRadios) {
    if (radio.checked) {
      return radio.value;
    }
  }
}

// сортировка массива билетов
function sortTickets(ticketsArray, sortValue) {
  if (sortValue == "cheapest") {
    return ticketsArray.sort((a, b) => a.price - b.price);
  } else {
    return ticketsArray.sort((a, b) => {
      let aSumDuration = a.segments.reduce((sumDuration, segment) => sumDuration + segment.duration, 0);
      let bSumDuration = b.segments.reduce((sumDuration, segment) => sumDuration + segment.duration, 0);
      return aSumDuration - bSumDuration; //сравниваем суммарные значения duration из каждого билета
    });
  }
}
