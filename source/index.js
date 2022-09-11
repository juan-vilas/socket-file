"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.receiveImage = void 0;
const fs = __importStar(require("fs"));
function receiveImage(socket) {
    return __awaiter(this, void 0, void 0, function* () {
        socket.on("image2.0", (data, response1) => {
            console.log(`Receiving image: ${JSON.stringify(data, null, 4)}`);
            let chunks = Array.from({ length: data.size });
            let i = 0;
            socket.on(data.id, (data2, response2) => {
                console.log("Receiving data", data2.pos);
                chunks[data2.pos] = data2.base64;
                i++;
                if (i >= data.size) {
                    console.log("FIN");
                    let filename = Date.now().toString() + ".png";
                    var buf = Buffer.from(chunks.join(""), "base64");
                    fs.writeFileSync("./img/" + filename, buf);
                    socket.removeAllListeners(data.id);
                }
            });
            response1(data);
        });
    });
}
exports.receiveImage = receiveImage;
// const server = createServerSocket("localhost", 4747, {});
// const onConnection = (socket: Socket) => {
//   console.log(`New connection ${socket.id}`);
// };
// server.on("connection", onConnection);
