import { Axios } from "axios";
import axios from "axios";

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
                "X-Access-Token" : this.apiKey,
            },
        });
    }

    // load availble plans
    loadPlans(){
        this.httpClient.get('mobile/planes')
        .then((response) => console.log(response.data))
        .catch((error) => console.log("Error loading plans"));
    }
}

export default OneClickDz;