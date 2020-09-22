"use strict";

const url = "https://front-test.beta.aviasales.ru";

window.onload = async function () {
  try {
    let searchId = await getSearchId(url);
    // console.log(searchId);
    let isRepeatTicketsRequest = true;
    do {
      let tickets = await getTickets(url, searchId);
      console.log(tickets);
      if (tickets.stop) isRepeatTicketsRequest = false;
    } while (isRepeatTicketsRequest);
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
    throw new Error(json.error);
  }
}
