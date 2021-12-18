import http from 'k6/http';
import { sleep } from 'k6';
import { check } from 'k6';
import { SharedArray } from "k6/data";
import { Trend, Rate } from 'k6/metrics';
import papaparse from 'https://jslib.k6.io/papaparse/5.1.1/index.js';

export const GetAddressDuration = new Trend('get_address_duration');
export const GetAddressFailRate = new Rate('get_address_fail_rate');
export const GetAddressSuccessRate = new Rate('get_address_success_rate');
export const GetAddressReqs = new Rate('get_address_reqs');

const csvData = new SharedArray("another data name", function () {
    return papaparse.parse(open('../csv/cep.csv'), { header: true }).data;
});

export default function () {
    const randomObj = csvData[Math.floor(Math.random() * csvData.length)];
    const cep = randomObj.cep;
    console.log('[CEP] ', `[${cep}]`);

    const response = http.get(`https://localhost:5001/api/v1/Cep/${cep}`);

    GetAddressDuration.add(response.timings.duration);
    GetAddressReqs.add(1);
    GetAddressFailRate.add(response.status == 0 || response.status > 399);
    GetAddressSuccessRate.add(response.status < 399);

    check(response, { 'status was 200': (r) => r.status === 200 });
    sleep(1);
}
