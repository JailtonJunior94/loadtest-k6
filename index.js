import { group, sleep } from 'k6';

import getAddress from './scenarios/get-address.js';

export const options = {
    stages: [
        { duration: '1m', target: 15 },
        { duration: '2m', target: 30 },
        { duration: '30s', target: 0 },
    ],
    thresholds: {
        http_req_failed: ['rate<0.01'], // http errors should be less than 1%
        http_req_duration: ['p(75)<500'], // 75% of requests should be below 500ms
    },
};

export default () => {
    group('[Endpoint] Get Address by CEP', () => {
        getAddress()
    });
    sleep(1);
}