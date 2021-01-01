var http = require('http');
var https = require('https');
var HTMLParser = require('node-html-parser');

var plates = [
    "/rogue-hg-2-0-bumper-plates-eu",
    "/rogue-color-echo-bumper-plate-eu",
    "/rogue-black-training-kg-striped-plates-eu",
    "/rogue-color-kg-training-2-0-plates-iwf-eu",
    "/rogue-rr-bumper-plates-eu",
    "/rogue-echo-bumper-plates-with-white-text-eu",
    "/rogue-kg-training-2-0-plates-eu",
    "/rogue-friction-grip-kg-change-plates-iwf-eu",
    "/rogue-kg-change-plates-iwf-eu"
];

http.createServer(function (req, res) {
    console.log("Welcome to 14 Brooke Hall Close Gym.")
    console.log("Starting Rogue Stock Bot...")
    plates.forEach(plate => {
        var options = {
            host: 'www.rogueeurope.eu',
            path: plate,
            port: 443,
            method: 'GET'
        };

        const roguecall = https.request(options, result => {    
            result.on('data', d => {
                var root = HTMLParser.parse(d);
                var qtylist = root.querySelectorAll(".item-qty").forEach(item => {                               
                    console.log(item.parentNode.querySelector(".item-name").innerText);
                    console.log(item.parentNode.querySelector(".price-including-tax").querySelector(".price").innerText);
                  });
            })
        })

        roguecall.on('error', error => {
            console.error(error)
        })
    
        roguecall.end()
    
        
    }); 

    

}).listen(8080);



