"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthFacade = void 0;
class AuthFacade {
    static set(userId, timestamp) {
        this.authBody = {
            userId,
            timestamp,
        };
    }
    static get() {
        return this.authBody;
    }
}
exports.AuthFacade = AuthFacade;
AuthFacade.authBody = null;
