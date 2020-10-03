"use strict";

export async function getTickets() {
    let searchId = await getSearchId();
    let tickets = await searchTickets(searchId);
    return tickets;
}

// отправляем запрос на сервер, получаем saercID
async function getSearchId() {
  const searchUrl = "https://front-test.beta.aviasales.ru/search";
  // let searchUrl = new URL("search", url);
  let response = await fetch(searchUrl);
  if (response.ok) {
    let json = await response.json();
    return json;
  } else {
    throw new Error(json.error);
  }
}

// отправляем запрос на сервер, получаем пачку билетов
async function getTicketsBundle(params) {
  const url = "https://front-test.beta.aviasales.ru/tickets";
  let ticketsUrl = new URL(url);
  ticketsUrl.searchParams.append("searchId", params.searchId);
  let response = await fetch(ticketsUrl);
  if (response.ok) {
    let json = await response.json();
    return json;
  } else {
    console.log("getTicketsBundle error");
    // throw new Error(json.error);
  }
}

// ищем билеты, пока не получим responce.stop == true
async function searchTickets(searchId) {
  const response = await getTicketsBundle(searchId);
  const tickets = [];
  tickets.push(...response.tickets);
  if (!response.stop) {
    const response = await searchTickets(searchId);
    tickets.push(...response.tickets);
  }
  return tickets;
}
