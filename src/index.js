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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
console.log("and, a new test33333");
var roam_client_1 = require("roam-client");
var user_event_1 = require("@testing-library/user-event");
var config = roam_client_1.getConfigFromPage("roam/js/GPT3-token");
var auth = (_a = config["API"]) === null || _a === void 0 ? void 0 : _a.trim();
console.log("auth", auth);
// GPT3 integration
var main_url = "https://api.openai.com/v1/engines/davinci/completions";
var HEADERS = {
    'Content-Type': 'application/json',
    'Authorization': auth
};
var options = function (query) { return ({
    method: "POST",
    headers: HEADERS,
    body: JSON.stringify(query)
}); };
var q = ({
    "prompt": "Today, we will learn about tigers -- these fascinating beasts of the great open wild.",
    "max_tokens": 50
});
// Roam operation
var searchText = "";
var emojiOn = false;
var menuItemIndex = 0;
var currentTarget = document.createElement("textarea");
var insertEmoji = function (target, emojiCode) {
    console.log("this guy is inside insertEmoji");
    var initialValue = target.value;
    var preValue = initialValue.substring(0, initialValue.length - searchText.length);
    target.setSelectionRange(preValue.length, initialValue.length);
    user_event_1.default.type(target, "{backspace}");
    user_event_1.default.type(target, emojiCode);
};
// function getSelectionText() {
//   var text = "";
//   if (window.getSelection) {
//       text = window.getSelection().toString();
//   } else if (document.selection && document.selection.type != "Control") {
//       text = document.selection.createRange().text;
//   }
//   return text;
// }
var keydownEventListener = function (e) { return __awaiter(void 0, void 0, void 0, function () {
    var request;
    return __generator(this, function (_a) {
        if (e.key === "G" && e.shiftKey && e.ctrlKey && document.activeElement.tagName === "TEXTAREA") {
            request = function (query) { return __awaiter(void 0, void 0, void 0, function () {
                var response;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, fetch(main_url, options(query))];
                        case 1:
                            response = _a.sent();
                            return [2 /*return*/, response];
                    }
                });
            }); };
            request(q).then(function (r) { return __awaiter(void 0, void 0, void 0, function () { var _a, _b; return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _a = insertEmoji;
                        _b = [e.target];
                        return [4 /*yield*/, r.json().then(function (s) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, s.choices[0].text];
                                    case 1: return [2 /*return*/, _a.sent()];
                                }
                            }); }); })];
                    case 1: return [2 /*return*/, _a.apply(void 0, _b.concat([_c.sent()]))];
                }
            }); }); });
        }
        return [2 /*return*/];
    });
}); };
document.addEventListener("keydown", keydownEventListener);
//# sourceMappingURL=index.js.map