"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsonPlaceholderUsersGateway = void 0;
const axios_1 = __importDefault(require("axios"));
class JsonPlaceholderUsersGateway {
    async fetchAll() {
        console.log('JSONPLACEHOLDER GATEWAY');
        const { data } = await axios_1.default.get('https://jsonplaceholder.typicode.com/users');
        return data;
    }
    async fetchById(id) {
        const { data } = await axios_1.default.get(`https://jsonplaceholder.typicode.com/users/${id}`);
        return data;
    }
}
exports.JsonPlaceholderUsersGateway = JsonPlaceholderUsersGateway;
//# sourceMappingURL=jsonplaceholder-users.gateway.js.map