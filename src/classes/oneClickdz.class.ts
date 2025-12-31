import { Axios } from "axios";
import axios from "axios";
import { sleep } from "bun";
import { v4 as uuidV4 } from "uuid";

class OneClickDz {
    private apiKey: string;
    private baseUrl: string;
    private httpClient: Axios;

    constructor(apiKey: string, baseUrl: string) {
        this.apiKey = apiKey;
        this.baseUrl = baseUrl;
        this.httpClient = axios.create({
            baseURL: this.baseUrl,
            headers: {
                'Content-Type': 'application/json',
                "X-Access-Token": this.apiKey,
            },
        });
    }

    // send top up request
    async sendTopUp(planCode: string, phoneNumber: string, amount: number) {
        const ref = `${new Date().toUTCString}-${uuidV4()}`;
        try {
            const response = await this.httpClient.post('mobile/send', {
                "plan_code": planCode,
                "MSSIDN": phoneNumber,
                "amount": amount,
                "ref": ref,
            });
            return response.data;
        } catch (err) {
            return;
        }
        /* const success = {
             "success": true,
             "data": {
                 "topupId": "69537bd879b32384c0bfb932",
                 "topupRef": "API-+213658535537-ref-124"
             },
             "meta": {
                 "timestamp": "2025-12-30T07:14:32.960Z"
             }
         }
         const faile = {
             "success": false,
             "error": {
                 "code": "DUPLICATED-REF",
                 "message": "This reference ID is already in use."
             },
             "requestId": "req-fpg"
         }*/
    }
    async checkStatusById(id: string) {
        try {
            const response = await this.httpClient.get(`mobile/check-id/${id}`);
            return response.data;
        } catch (err) {
            return;
        }
    }

    async polling(id: string, maxAttempts = 60) {
        for (let i = 0; i < maxAttempts; i++) {
            const data = await this.checkStatusById(id);
            if (!data) {
                await sleep(5000);
                continue;
            }
            if (data.status === "FULFILLED") {
                return {
                    success: true,
                    msg: "Top up successful",
                };
            } else if (data.status === 'REFUNDED') {
                return {
                    success: false,
                    msg: data.refund_message as string,
                };
            } else if (data.status === "UNKNOWN_ERROR") {
                return {
                    success: false,
                    msg: "Something went wrong , contact the support",
                }
            } else {
                await sleep(5000);
            }
        }
    }

    async checkBalance() {
        try {
            const response = await this.httpClient.get(`account/balance`);
            return response.data.balance;
        } catch (err) {
            return;
        }
    }
}

export default OneClickDz;