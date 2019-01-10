import "mocha";
import app from "app";
import * as http from "http";

const server = http.createServer(app);
export const testURL = "http://localhost:3000/sample";

before(() => {
    server.listen(3000);
});

after(() => {
    server.close();
});
