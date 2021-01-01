const request = require("request");
const cheerio = require("cheerio");
const async = require("async");
const fs = require("fs");
const wantedList = JSON.parse(fs.readFileSync("wanted.json"));
const plates = 
[
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

function main()
{
    let parsedItems = [];
    async.eachSeries(plates, (plate, nextPlate) =>
    {
        console.log("Parsing item:", plate);

        request("https://www.rogueeurope.eu" + plate, (err, response, body) => 
        {
            if(err)
            {
                nextPlate();
            }
            else
            {
                let $ = cheerio.load(body);
                let htmlItems = $(".grouped-item");

                for(let htmlItem of htmlItems)
                {
                    let parsedItem =
                    { 
                        name: $(htmlItem).find(".item-name").text(),
                        price: $(htmlItem).find(".price-including-tax .price").text().trim(),
                        inStock: $(htmlItem).find(".bin-out-of-stock").length === 0
                    };

                    parsedItems.push(parsedItem);
                }

                nextPlate();
            }
        });
    }, () =>
    {
        //Check parsed items against wanted list.
        parsedItems.forEach(i =>
        {
            if(i.inStock && wantedList.includes(i.name))
            {
                //Wanted item found in stock. Send an SMS?
            }
        });

        setTimeout(main, 60000);
    });
}

console.log("Welcome to 14 Brooke Hall Close Gym.");
console.log("Starting Rogue Stock Bot...");
main();