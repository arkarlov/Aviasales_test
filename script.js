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


const TestTicket = {
    // Цена в рублях
    price: 134000,
    // Код авиакомпании (iata)
    carrier: '7J',
    // Массив перелётов.
    // В тестовом задании это всегда поиск "туда-обратно" значит состоит из двух элементов
    segments: [
      {
        // Код города (iata)
        origin: 'KUF',
        // Код города (iata)
        destination: 'LHR',
        // Дата и время вылета туда
        date: '10:45 – 08:00',
        // Массив кодов (iata) городов с пересадками
        stops: ['HKG', 'JNB', 'SVO'],
        // Общее время перелёта в минутах
        duration: 1275,
      },
      {
        // Код города (iata)
        origin: 'LHR',
        // Код города (iata)
        destination: 'KUF',
        // Дата и время вылета обратно
        date: '08:00 – 10:45',
        // Массив кодов (iata) городов с пересадками
        stops: ['JNB', 'HKG'],
        // Общее время перелёта в минутах
        duration: 1275,
      }
    ]
  }



const url = "https://front-test.beta.aviasales.ru";

window.onload = async function () {
  try {
    renderTicket(TestTicket);
    // let searchId = await getSearchId(url);
    // let tickets = await search(url, searchId);
    // console.log(tickets);
  } catch (error) {
    console.log(error.message);
  }
};

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

function renderTicket(ticketData) {
  const carrierLogoUrl = `//pics.avs.io/99/36/${ticketData.carrier}.png`
  const flight = ticketData.segments[0];
  const returnFlite = ticketData.segments[1];

  const ticketsSection = document.querySelector('#tickets-section');
  const ticketTemplate = document.querySelector('#ticket-template').content;  
  const ticket = ticketTemplate.cloneNode(true);
  const ticketPrice = ticket.querySelector('.ticket__price');
  const ticketLogo = ticket.querySelector('.ticket__logo');

  ticketData.segments.forEach(element => {
    const routeTemplate = ticket.querySelector('#route-template').content;
    const ticketRoute = routeTemplate.cloneNode(true);
    const routeTitle = ticketRoute.querySelector('.route-title');
    const routeTime = ticketRoute.querySelector('.route-time');
    const routeLenght = ticketRoute.querySelector('.route-lenght');
    const routeSstopsCount = ticketRoute.querySelector('.route-stops-count');
    const routeStops = ticketRoute.querySelector('.route-stops');

    routeTitle.textContent = `${element.origin} – ${element.destination}`;
    routeTime.textContent = element.date;
    routeLenght.textContent = element.duration;
    routeSstopsCount.textContent = element.stops.length;
    routeStops.textContent = element.stops.join(', ');

    ticket.append(ticketRoute);   
  });

  ticketPrice.innerHTML = ticketData.price + "&nbsp;&#8381;";
  ticketLogo.src = carrierLogoUrl;

  console.log(ticket);

  ticketsSection.append(ticket);
}
