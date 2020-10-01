"use strict";

const testResponce = {
  tickets: [
    {
      price: 13400,
      carrier: "S7",
      segments: [
        {
          origin: "MOW",
          destination: "HKT",
          date: "2020-09-25T10:45:00.417",
          stops: ["HKG", "JNB"],
          duration: 1275,
        },
        {
          origin: "MOW",
          destination: "HKT",
          date: "2020-09-25T11:20:00.417",
          stops: ["HKG"],
          duration: 810,
        },
      ],
    },
    {
      price: 134000,
      carrier: "7J",
      segments: [
        {
          origin: "KUF",
          destination: "LHR",
          date: "2020-09-25T10:45:00.417",
          stops: ["HKG", "SVO"],
          duration: 1275,
        },
        {
          origin: "LHR",
          destination: "KUF",
          date: "2020-09-25T10:45:00.417",
          stops: ["JNB", "HKG"],
          duration: 1275,
        },
      ],
    },
    {
      price: 1340,
      carrier: "JP",
      segments: [
        {
          origin: "AGV",
          destination: "WAM",
          date: "2020-09-25T10:45:00.417",
          stops: ["HKG", "JNB", "KSM"],
          duration: 5275,
        },
        {
          origin: "WAM",
          destination: "AGV",
          date: "2020-09-25T10:45:00.417",
          stops: ["HKG", "JNB", "KSM", "SVO"],
          duration: 6275,
        },
      ],
    },
    {
      price: 234000,
      carrier: "EK",
      segments: [
        {
          origin: "BML",
          destination: "SDY",
          date: "2020-09-25T10:45:00.417",
          stops: ["HKG"],
          duration: 275,
        },
        {
          origin: "SDY",
          destination: "BML",
          date: "2020-09-25T10:45:00.417",
          stops: [],
          duration: 175,
        },
      ],
    },
    {
      price: 19600,
      carrier: "TK",
      segments: [
        {
          origin: "KUF",
          destination: "LHR",
          date: "2020-09-25T10:45:00.417",
          stops: ["HKG", "JNB", "KSM"],
          duration: 1075,
        },
        {
          origin: "LHR",
          destination: "KUF",
          date: "2020-09-25T10:45:00.417",
          stops: ["JNB", "HKG"],
          duration: 875,
        },
      ],
    },
    {
      price: 24000,
      carrier: "QR",
      segments: [
        {
          origin: "JNB",
          destination: "HKG",
          date: "2020-09-25T10:45:00.417",
          stops: ["HKG", "SVO"],
          duration: 1200,
        },
        {
          origin: "HKG",
          destination: "JNB",
          date: "2020-09-25T10:45:00.417",
          stops: ["JNB"],
          duration: 1275,
        },
      ],
    },
    {
      price: 21364,
      carrier: "SU",
      segments: [
        {
          origin: "JNB",
          destination: "HKG",
          date: "2020-09-25T10:45:00.417",
          stops: ["HKG"],
          duration: 1200,
        },
        {
          origin: "HKG",
          destination: "JNB",
          date: "2020-09-25T10:45:00.417",
          stops: ["JNB"],
          duration: 1275,
        },
      ],
    },
    {
      price: 350364,
      carrier: "BA",
      segments: [
        {
          origin: "JNB",
          destination: "HKG",
          date: "2020-09-25T10:45:00.417",
          stops: [],
          duration: 845,
        },
        {
          origin: "HKG",
          destination: "JNB",
          date: "2020-09-25T10:45:00.417",
          stops: [],
          duration: 450,
        },
      ],
    },
  ],
  stop: true,
};

const url = "https://front-test.beta.aviasales.ru";
const filterCheckboxes = document.querySelectorAll(".input-default_checkbox");
const tickets = testResponce.tickets;

window.onload = async function () {
  try {
    // let searchId = await getSearchId(url);
    // let tickets = await search(url, searchId);
    let filters = getFilters(filterCheckboxes);
    renderAllTickets(getFilteredTickets(tickets, ...filters));
  } catch (error) {
    console.log(error.message);
  }
};

filterCheckboxes.forEach((element) => {
  element.addEventListener("change", function () {
    clearTickets();
    renderAllTickets(
      getFilteredTickets(tickets, ...getFilters(filterCheckboxes))
    );
  });
});

// отправляем запрос на сервер, получаем saercID
async function getSearchId(url) {
  let searchUrl = new URL("search", url);
  let response = await fetch(searchUrl);
  if (response.ok) {
    let json = await response.json();
    return json;
  } else {
    throw new Error(json.error);
  }
}

// отправляем запрос на сервер, получаем пачку билетов
async function getTickets(url, params) {
  let ticketsUrl = new URL("tickets", url);
  ticketsUrl.searchParams.append("searchId", params.searchId);
  let response = await fetch(ticketsUrl);
  if (response.ok) {
    let json = await response.json();
    return json;
  } else {
    console.log("getTickets error");
    // throw new Error(json.error);
  }
}

// ищем билеты, пока не получим responce.stop == true
async function search(url, searchId) {
  const response = await getTickets(url, searchId);
  const tickets = [];
  tickets.push(...response.tickets);
  if (!response.stop) {
    const response = await search(url, searchId);
    tickets.push(...response.tickets);
  }
  return tickets;
}

// отрисовываем один билет, ticketData - объект билета
function renderOneTicket(ticketData) {
  const carrierLogoUrl = `//pics.avs.io/99/36/${ticketData.carrier}.png`; // получаем logo.png авиакомпании из CDN

  const ticketTemplate = document.querySelector("#ticket-template").content;
  const ticket = ticketTemplate.cloneNode(true);
  const ticketPrice = ticket.querySelector(".ticket__price");
  const ticketLogo = ticket.querySelector(".ticket__logo");

  ticketPrice.innerHTML = new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    currencyDisplay: "symbol",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(ticketData.price);
  ticketLogo.src = carrierLogoUrl;

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

  document.querySelector("#tickets-section").append(ticket);
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

// отрисовываем массив билетов
function renderAllTickets(ticketsArray) {
  ticketsArray.forEach((element) => {
    renderOneTicket(element);
  });
}

//удаляем все билеты
function clearTickets() {
  let ticketsSection = document.querySelector("#tickets-section");
  while (ticketsSection.children.length > 1) {
    console.log(ticketsSection.children);
    console.log(ticketsSection);
    console.log("length: " + ticketsSection.children.length);
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
