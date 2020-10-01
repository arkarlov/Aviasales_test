"use strict";

const url = "https://front-test.beta.aviasales.ru";

export async function getTickets() {
    let searchId = await getSearchId(url);
    let tickets = await searchTickets(url, searchId);
    return tickets;
}

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
async function getTicketsBundle(url, params) {
  let ticketsUrl = new URL("tickets", url);
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
async function searchTickets(url, searchId) {
  const response = await getTicketsBundle(url, searchId);
  const tickets = [];
  tickets.push(...response.tickets);
  if (!response.stop) {
    const response = await searchTickets(url, searchId);
    tickets.push(...response.tickets);
  }
  return tickets;
}
