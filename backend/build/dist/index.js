"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
// Initialize express app object
var app = (0, express_1.default)();
// The host address of this server (TODO !! .env) 
var HOST = 'localhost';
// The port associated with this server
var PORT = 4000;
app.get('/', function (req, res) {
    res.send('Hello World!');
});
// Start the server
app.listen(PORT, function () {
    console.log("Server is running on http://".concat(HOST, ":").concat(PORT));
});
//# sourceMappingURL=index.js.map