/*
  Load Testing is primarily concerned with assessing the current performance of your system in terms of concurrent users or requests per second.
  When you want to understand if your system is meeting the performance goals, this is the type of test you'll run.

  Run a load test to:
  - Assess the current performance of your system under typical and peak load
  - Make sure you are continuously meeting the performance standards as you make changes to your system

  Can be used to simulate a normal day in your business
*/

import http from "k6/http";
import { sleep } from 'k6';

export let options = {
    insecureSkipTLSVerify: true,
    noConnectionReuse: false,
    stages: [
      { duration: '5m', target: 100 }, // simulate ramp-up of traffic from 1 to 100 users over 5 minutes.
      { duration: '10m', target: 100 }, // stay at 100 users for 10 minutes
      { duration: '5m', target: 0 }, // ramp-down to 0 users
    ],
    thresholds: {
      http_req_duration: ['p(99)<2000'], // 99% of requests must complete below 2000ms
    },
  };

const BASE_URL = 'https://fakerestapi.azurewebsites.net/api/v1';

export default () => {

  let req1 = {
    method: 'GET',
    url: BASE_URL+'/Activities',
  };

  let req2 = {
    method: 'POST',
    url: BASE_URL+'/Activities',
    body: {
      "id": 31,
      "title": "Activit 31",
      "dueDate": "2034-11-25T22:06:47.906Z",
      "completed": true
    },
    params: {
      headers: { 'Content-Type': 'application/json; charset=utf-8; v=1.0' },
    },
  };
  
  let req3 = {
    method: 'GET',
    url: BASE_URL+'/Activities/20',
  };

  let req4 = {
    method: 'PUT',
    url: BASE_URL+'/Activities/31',
    body: {
      "id": 31,
      "title": "Activit 31",
      "dueDate": "2030-11-25T22:06:47.906Z",
      "completed": true
    },
    params: {
      headers: { 'Content-Type': 'application/json; charset=utf-8; v=1.0' },
    },
  };

  let req5 = {
    method: 'DELETE',
    url: BASE_URL+'/Activities/31',
  };

  let response = http.batch([req1, req2, req3, req4, req5]);

  sleep(1);
};