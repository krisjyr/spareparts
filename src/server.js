const { parse } = require("csv-parse");
const fs = require("fs");

// specify the path of the CSV file
const path = "./LE.txt";

search(
  "http://localhost:5500/src/thing.json?search=Own.handbook&page=2&limit=30"
);

async function search(endpoint) {
  const request = await fetch(endpoint);
  const response = await request.json();

  if (!request.ok) {
    console.error("An error occurred", request.status);
    return;
  }

  const url = new URL(endpoint);
  const params = new URLSearchParams(url.search);

  let items = [];
  let currentPage = params.get("page");
  const itemsPerPage = params.get("limit");
  const dataSearch = params.get("search");

  if (dataSearch !== undefined) {
    searchLoop(response, dataSearch);
  } else {
    console.log("No valid search parameters provided");
  }

  function searchLoop(response, data) {
    for (let item in response) {
      if (response[item].name === data || response[item].ID === data) {
        items.push(response[item]);
      }
    }
  }

  function getItemsForCurrentPage() {
    const start = (currentPage - 1) * itemsPerPage;
    const end = currentPage * itemsPerPage;
    return items.slice(start, end);
  }

  console.log(getItemsForCurrentPage());
}

function generateJson() {
const parser = fs.createReadStream(path).pipe(
  parse({
    delimiter: "/n",
    rowdelimiter: " ",
    from_line: 1,
    relax_quotes: true,
    escape: "\\",
  })
);

  const records = [];
  let JSONrecords = [];

  parser.on("readable", function () {
    let record;

    while ((record = parser.read()) !== null) {
      record[0] = record[0].replaceAll("\t", "ˇ");
      record[0] = record[0].split("ˇ");

      for (let i = 0; i < record[0].length; i++) {
        record[0][i] = record[0][i].substring(1, record[0][i].length - 1);
      }

      record[0] = {
        ID: record[0][0],
        name: record[0][1],
        something1: record[0][2],
        something2: record[0][3],
        something3: record[0][4],
        something4: record[0][5],
        something5: record[0][6],
        something6: record[0][7],
        something7: record[0][8],
        something8: record[0][9],
        something9: record[0][10],
      };
      records.push(record[0]);
    }
  });

  parser.on("error", function (error) {
    // Handle the errors
    console.log(error.message);
  });
  parser.on("end", function () {
    // executed when parsing is complete

    JSONrecords = JSON.stringify(records);

    fs.writeFile("thing.json", JSONrecords, function (err, result) {
      if (err) console.log("error", err);
    });

    console.log("done");
  });
}
