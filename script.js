"use strict";

//
// Response: {tickets: [], stop: true}
//
// interface Ticket {
//   // Цена в рублях
//   price: number
//   // Код авиакомпании (iata)
//   carrier: string
//   // Массив перелётов.
//   // В тестовом задании это всегда поиск "туда-обратно" значит состоит из двух элементов
//   segments: [
//     {
//       // Код города (iata)
//       origin: string
//       // Код города (iata)
//       destination: string
//       // Дата и время вылета туда
//       date: string
//       // Массив кодов (iata) городов с пересадками
//       stops: string[]
//       // Общее время перелёта в минутах
//       duration: number
//     },
//     {
//       // Код города (iata)
//       origin: string
//       // Код города (iata)
//       destination: string
//       // Дата и время вылета обратно
//       date: string
//       // Массив кодов (iata) городов с пересадками
//       stops: string[]
//       // Общее время перелёта в минутах
//       duration: number
//     }
//   ]
// }
// P.S.: Картинки авиакомпаний можешь брать с нашего 
//  CDN: //pics.avs.io/99/36/{IATA_CODE_HERE}.png
//

const testResponce = {
  tickets: [
      {   price: 134000,
          carrier: '7J',
          segments: [
            {
              origin: 'KUF',
              destination: 'LHR',
              date: '10:45 – 08:00',
              stops: ['HKG', 'SVO'],
              duration: 1275,
            },
            {
              origin: 'LHR',
              destination: 'KUF',
              date: '08:00 – 10:45',
              stops: ['JNB', 'HKG'],
              duration: 1275,
            }
          ]
      },
      {   price: 13400,
          carrier: 'S7',
          segments: [
            {
              origin: 'AHJ',
              destination: 'JNB',
              date: '10:45 – 08:00',
              stops: ['HKG', 'JNB', 'DHF'],
              duration: 1275,
            },
            {
              origin: 'JNB',
              destination: 'AHJ',
              date: '08:00 – 10:45',
              stops: ['AUE'],
              duration: 2275,
            }
          ]
      },
      {   price: 1340,
          carrier: 'JP',
          segments: [
            {
              origin: 'AGV',
              destination: 'WAM',
              date: '10:45 – 08:00',
              stops: ['HKG'],
              duration: 5275,
            },
            {
              origin: 'WAM',
              destination: 'AGV',
              date: '08:00 – 10:45',
              stops: ['HKG'],
              duration: 6275,
            }
          ]
      },
      {   price: 234000,
          carrier: 'QU',
          segments: [
            {
              origin: 'BML',
              destination: 'SDY',
              date: '10:45 – 08:00',
              stops: ['HKG', 'JNB', 'SVO'],
              duration: 275,
            },
            {
              origin: 'SDY',
              destination: 'BML',
              date: '08:00 – 10:45',
              stops: ['JNB', 'HKG', 'KSM'],
              duration: 175,
            }
          ]
      },
      {   price: 13000,
          carrier: 'TK',
          segments: [
            {
              origin: 'KUF',
              destination: 'LHR',
              date: '10:45 – 08:00',
              stops: ['HKG', 'JNB', 'KSM'],
              duration: 1075,
            },
            {
              origin: 'LHR',
              destination: 'KUF',
              date: '08:00 – 10:45',
              stops: ['JNB', 'HKG'],
              duration: 875,
            }
          ]
      },
      {   price: 4000,
          carrier: 'QR',
          segments: [
            {
              origin: 'JNB',
              destination: 'HKG',
              date: '10:45 – 08:00',
              stops: ['HKG', 'SVO'],
              duration: 3275,
            },
            {
              origin: 'HKG',
              destination: 'JNB',
              date: '08:00 – 10:45',
              stops: ['JNB'],
              duration: 1275,
            }
          ]
      },
  ], 
  stop: true,
};




const url = "https://front-test.beta.aviasales.ru";

window.onload = async function () {
  try {
    renderOneTicket(testResponce.tickets[0]);
    renderOneTicket(testResponce.tickets[1]);
    renderOneTicket(testResponce.tickets[2]);
    renderOneTicket(testResponce.tickets[3]);
    // let searchId = await getSearchId(url);
    // let tickets = await search(url, searchId);
    // console.log(tickets);
  } catch (error) {
    console.log(error.message);
  }
};

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
  const carrierLogoUrl = `//pics.avs.io/99/36/${ticketData.carrier}.png` // получаем logo.png авиакомпании из CDN

  const ticketTemplate = document.querySelector('#ticket-template').content;  
  const ticket = ticketTemplate.cloneNode(true);
  const ticketPrice = ticket.querySelector('.ticket__price');
  const ticketLogo = ticket.querySelector('.ticket__logo');

  ticketPrice.innerHTML = ticketData.price + "&nbsp;&#8381;";
  ticketLogo.src = carrierLogoUrl;

  ticketData.segments.forEach(element => {
    const routeTemplate = ticket.querySelector('#route-template').content;
    const ticketRoute = routeTemplate.cloneNode(true);
    const routeTitle = ticketRoute.querySelector('.route-title');
    const routeTime = ticketRoute.querySelector('.route-time');
    const routeLenght = ticketRoute.querySelector('.route-lenght');
    const routeSstopsCount = ticketRoute.querySelector('.route-stops-count');
    const routeStops = ticketRoute.querySelector('.route-stops');

    let routeDuration = {};
    routeDuration.mins = element.duration % 60;
    routeDuration.hours = (element.duration - routeDuration.mins) / 60;

    routeTitle.textContent = `${element.origin} – ${element.destination}`;
    routeTime.textContent = element.date;
    routeLenght.textContent = `${routeDuration.hours}ч ${routeDuration.mins}м`;
    routeSstopsCount.textContent = element.stops.length;
    routeStops.textContent = element.stops.join(', ');

    ticket.children[0].append(ticketRoute);   // добавляем в потомка DocumentFragment
  });

  document.querySelector('#tickets-section').append(ticket);
};

function renderAllTickets() {

}
