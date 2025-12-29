import { ADMIN_CHAT_ID } from "../config/env";

function isAdmin(chatId : number) {
    return chatId === ADMIN_CHAT_ID;
}

export default isAdmin;