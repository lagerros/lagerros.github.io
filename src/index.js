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
var roam_client_1 = require("roam-client");
var user_event_1 = require("@testing-library/user-event");
var config = roam_client_1.getConfigFromPage("roam/js/GPT3-token");
var auth = (_a = config["API"]) === null || _a === void 0 ? void 0 : _a.trim();
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
var request = function (query) { return __awaiter(void 0, void 0, void 0, function () {
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
// This is really ugly and probably breaks a lot of stuff! #TODO
// let window: any
// const getCurrContext = () => {
//   const currBlockId = document.activeElement.id.slice(-9)
//   const currContext = window.roamAlphaAPI.q('[:find (pull ?a [*]) :in $ ?id :where [?a :block/uid ?id]]', currBlockId)
//   return currContext[0][0].string
// }
var getAllTags = function () {
    var tagPages = window.roamAlphaAPI.q('[ :find (pull ?e [*]) :where [?e :node/title] ] ');
    var tags = tagPages.map(function (page) { return page[0].title; });
    return tags;
};
var semSearch = function (documents, query) { return __awaiter(void 0, void 0, void 0, function () {
    var params, response, data;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                params = ({
                    "documents": documents,
                    "query": query
                });
                return [4 /*yield*/, request(params).then(function (r) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, r.json()];
                            case 1: return [2 /*return*/, _a.sent()];
                        }
                    }); }); })];
            case 1:
                response = _a.sent();
                data = response.data;
                return [2 /*return*/, data];
        }
    });
}); };
var complete = function (prompt) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/];
    });
}); };
var formatTag = function (s) {
    var tag = / /.test(s) ? "[[" + s + "]]" : "#" + s;
    return tag;
};
// Roam integration
var keydownEventListener = function (e) { return __awaiter(void 0, void 0, void 0, function () {
    var prompt_1, q;
    return __generator(this, function (_a) {
        if (e.key === "G" && e.shiftKey && e.ctrlKey && document.activeElement.tagName === "TEXTAREA") {
            console.log("that stuff from in here?");
            prompt_1 = document.activeElement.value;
            q = ({
                "prompt": prompt_1,
                "max_tokens": 50
            });
            request(q).then(function (r) { return __awaiter(void 0, void 0, void 0, function () {
                var _a, _b, _c;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            _b = (_a = user_event_1.default).type;
                            _c = [e.target];
                            return [4 /*yield*/, r.json().then(function (s) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, s.choices[0].text];
                                        case 1: return [2 /*return*/, _a.sent()];
                                    }
                                }); }); })];
                        case 1: return [2 /*return*/, _b.apply(_a, _c.concat([_d.sent()]))];
                    }
                });
            }); });
        }
        return [2 /*return*/];
    });
}); };
var autoTagListener = function (e) { return __awaiter(void 0, void 0, void 0, function () {
    var tags;
    return __generator(this, function (_a) {
        if (e.shiftKey && e.ctrlKey && document.activeElement.tagName === "TEXTAREA") {
            console.log("update!!");
            tags = getAllTags();
            console.log(tags);
            // const context:string = getCurrContext()
            // const data = await semSearch(tags, context)
            // console.log(await data)
            // const sortedTags = data.sort( (a, b) => a.score - b.score )
            // const topTags = sortedTags.slice(-3).map( obj => tags[obj.document])
            // const tagString = topTags.map( tag => formatTag(tag) ).join(" ")
            // userEvent.type(
            //   e.target as HTMLTextAreaElement,
            //   tagString
            // )
        }
        return [2 /*return*/];
    });
}); };
document.addEventListener("keydown", keydownEventListener);
document.addEventListener("keydown", autoTagListener);
//# sourceMappingURL=index.js.map