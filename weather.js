const http = require("http");
const fs = require("fs");
var requests = require("requests");

const Homefile = fs.readFileSync("weather.html", "utf-8");
const Replaceval = (Tempval, Orgdata) => {
  let temperature = Tempval.replace("{%tempval%}", Orgdata.main.temp);
  temperature = temperature.replace("{%tempmax%}", Orgdata.main.temp_max);
  temperature = temperature.replace(" {%tempmin%}", Orgdata.main.temp_min);
  temperature = temperature.replace("{%Location%}", Orgdata.name);
  temperature = temperature.replace("{%country%}", Orgdata.sys.country);
  return temperature;
};

const server = http.createServer((req, res) => {
  if (req.url == "/") {
    requests(
      "https://api.openweathermap.org/data/2.5/weather?q=sirohi&appid=5ea20c34427b9975a24ca2c9d4b64486"
    )
      .on("data", (chunk) => {
        const objdata = JSON.parse(chunk);
        let arrData = [objdata];

        const Realtimedata = arrData
          .map((val) => Replaceval(Homefile, val))
          .join("");

        res.write(Realtimedata);
      })
      .on("end", (err) => {
        if (err) return console.log("connection closed due to errors", err);
        res.end();
      });
  }
});
server.listen(7400, "127.0.0.1", () => {
  console.log("server connected success");
});
