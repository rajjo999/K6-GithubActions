/*
  Stress Testing is a type of load testing used to determine the limits of the system. 
  The purpose of this test is to verify the stability and reliability of the system under extreme conditions.

  Run a stress test to:
  - Determine how your system will behave under extreme conditions
  - Determine what is the maximum capacity of your system in terms of users or throughput
  - Determine the breaking point of your system and its failure mode
  - Determine if your system will recover without manual intervention after the stress test is over

  More of a load test than a spike test
*/

import http from "k6/http";
import { sleep } from 'k6';

export let options = {
    insecureSkipTLSVerify: true,
    noConnectionReuse: false,
    stages: [
      { duration: '2m', target: 100 }, // below normal load
      { duration: '5m', target: 100 },
      { duration: '2m', target: 200 }, // normal load
      { duration: '5m', target: 200 },
      { duration: '2m', target: 300 }, // around the breaking point
      { duration: '5m', target: 300 },
      { duration: '2m', target: 400 }, // beyond the breaking point
      { duration: '5m', target: 400 },
      { duration: '10m', target: 0 }, // scale down. Recovery stage.
    ],
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