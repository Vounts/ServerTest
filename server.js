const http = require('http');
const web = require('websocket').server;

const server = http.createServer().listen(3300);
const websocket = new web({
    httpServer: server
});


const CoinGecko = require('coingecko-api');
const CoinGeckoClient = new CoinGecko();


var clients = new Array();

websocket.on("request", req => {
    const cli = req.accept(null, req.origin);
    clients.push(cli);

    console.log("Client connected");
    //cli.sendUTF("Welcome to the clubhouse!");

    cli.on("close", () => {
        clients.splice(clients.indexOf(cli), 1);
        console.log("Client Left!");

    });

    var func = async() => {
        try {
        let data = await CoinGeckoClient.simple.price({
            ids: ['vigorus'],
            vs_currencies: ['php'],
        });
        json = data;
        }catch(err) {
            console.log(err);
        
        }

        cli.on("message", msga => {
            const msg = msga.utf8Data;
            if(msg) {
                console.log(json);
                websocket.broadcastUTF(JSON.stringify(json));
            }
        });

    };

 

func();

});

console.log("Server started");