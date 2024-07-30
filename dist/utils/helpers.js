"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = wait;
exports.addTime = addTime;
function wait(time) {
    return __awaiter(this, void 0, void 0, function* () {
        yield new Promise((r) => setTimeout(r, time));
    });
}
function addTime(value, unit, start) {
    let addedValue = value;
    switch (unit) {
        case 's':
            addedValue *= 1000;
            break;
        case 'm':
            addedValue *= 60 * 1000;
            break;
        case 'h':
            addedValue *= 60 * 60 * 1000;
            break;
        case 'd':
            addedValue *= 24 * 60 * 60 * 1000;
            break;
    }
    const initValue = start ? start.getTime() : Date.now();
    return new Date(initValue + addedValue);
}
