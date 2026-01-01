import OneClickDz from "../classes/oneClickdz.class";
import { API_BASE_URL, NODE_ENV, PRODUCTION_API_KEY, SANDBOX_API_KEY } from "../config/env";
const apiKey = (NODE_ENV === "development")?SANDBOX_API_KEY : PRODUCTION_API_KEY;
const oneClickDzClient = new OneClickDz(apiKey,API_BASE_URL);

export default oneClickDzClient;