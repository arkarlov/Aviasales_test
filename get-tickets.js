"use strict";

export async function getTickets() {
    const searchId = await getSearchId();
    const tickets = await searchTickets(searchId);
    return tickets;
}

// отправляем запрос на сервер, получаем saercID
async function getSearchId() {
  const searchUrl = "https://front-test.beta.aviasales.ru/search";
  // let searchUrl = new URL("search", url);
  const response = await fetch(searchUrl);
  if (response.ok) {
    const json = await response.json();
    return json.searchId;
  } else {
    throw new Error(json.error);
  }
}

// отправляем запрос на сервер, получаем пачку билетов
async function getTicketsBundle(params) {
  const url = "https://front-test.beta.aviasales.ru/tickets";
  const ticketsUrl = new URL(url);
  ticketsUrl.searchParams.append("searchId", params);
  const response = await fetch(ticketsUrl);
  if (response.ok) {
    const json = await response.json();
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
    const ticketsBundle = await searchTickets(searchId);
    tickets.push(...ticketsBundle);
  }
  return tickets;
}
