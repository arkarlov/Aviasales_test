"use strict";

const TestTicket = {
  // Цена в рублях
  price: 13400,
  // Код авиакомпании (iata)
  carrier: "S7",
  // Массив перелётов.
  // В тестовом задании это всегда поиск "туда-обратно" значит состоит из двух элементов
  segments: [
    {
      // Код города (iata)
      origin: "MOW",
      // Код города (iata)
      destination: "HKT",
      // Дата и время вылета туда
      date: "10:45 – 08:00",
      // Массив кодов (iata) городов с пересадками
      stops: ["HKG", "JNB"],
      // Общее время перелёта в минутах
      duration: 1275,
    },
    {
      // Код города (iata)
      origin: "MOW",
      // Код города (iata)
      destination: "HKT",
      // Дата и время вылета обратно
      date: "11:20 – 00:50",
      // Массив кодов (iata) городов с пересадками
      stops: ["HKG"],
      // Общее время перелёта в минутах
      duration: 810,
    },
  ],
};

const testResponce = {
  tickets: [
    {
      price: 13400,
      carrier: "S7",
      segments: [
        {
          origin: "MOW",
          destination: "HKT",
          date: "2020-09-25T10:45:00.417Z",
          stops: ["HKG", "JNB"],
          duration: 1275,
        },
        {
          origin: "MOW",
          destination: "HKT",
          date: "2020-09-25T11:20:00.417Z",
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
          date: "2020-09-25T10:45:00.417Z",
          stops: ["HKG", "SVO"],
          duration: 1275,
        },
        {
          origin: "LHR",
          destination: "KUF",
          date: "2020-09-25T10:45:00.417Z",
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
          date: "2020-09-25T10:45:00.417Z",
          stops: ["HKG", "JNB", "KSM"],
          duration: 5275,
        },
        {
          origin: "WAM",
          destination: "AGV",
          date: "2020-09-25T10:45:00.417Z",
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
          date: "2020-09-25T10:45:00.417Z",
          stops: ["HKG"],
          duration: 275,
        },
        {
          origin: "SDY",
          destination: "BML",
          date: "2020-09-25T10:45:00.417Z",
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
          date: "2020-09-25T10:45:00.417Z",
          stops: ["HKG", "JNB", "KSM"],
          duration: 1075,
        },
        {
          origin: "LHR",
          destination: "KUF",
          date: "2020-09-25T10:45:00.417Z",
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
          date: "2020-09-25T10:45:00.417Z",
          stops: ["HKG", "SVO"],
          duration: 1200,
        },
        {
          origin: "HKG",
          destination: "JNB",
          date: "2020-09-25T10:45:00.417Z",
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
          date: "2020-09-25T10:45:00.417Z",
          stops: ["HKG"],
          duration: 1200,
        },
        {
          origin: "HKG",
          destination: "JNB",
          date: "2020-09-25T10:45:00.417Z",
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
          date: "2020-09-25T10:45:00.417Z",
          stops: [],
          duration: 270,
        },
        {
          origin: "HKG",
          destination: "JNB",
          date: "2020-09-25T10:45:00.417Z",
          stops: [],
          duration: 450,
        },
      ],
    },
  ],
  stop: true,
};

// export const tickets = testResponce.tickets;

export async function getTickets() {
  let tickets = testResponce.tickets;
  return tickets;
}
