import { Socket } from "socket.io";
import * as fs from "fs";

export async function receiveImage(socket: Socket) {
  return new Promise((resolve) => {
    socket.on("image2.0", (data: { id: string; size: number }, response1) => {
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
          resolve(filename);
        }
      });
      response1(data);
    });
  });
}

// const server = createServerSocket("localhost", 4747, {});

// const onConnection = (socket: Socket) => {
//   console.log(`New connection ${socket.id}`);
// };

// server.on("connection", onConnection);
