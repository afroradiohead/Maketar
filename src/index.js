require("cjse");
const fs = require("fs");
let args;
if (process.argv0 == "node") {
  args = process.argv.slice(2);
} else {
  args = process.argv.slice(1);
}
const lastArg = args[args.length - 1];

let maketar;
if (lastArg == undefined) {
  try {
    maketar = fs.readFileSync("Maketar", "utf8");
  } catch {
    console.log("Can't read the Maketar. Does it exist? Have you specified a custom filename?");
    process.exit(1);
  }
} else {
  try {
    maketar = fs.readFileSync(lastArg, "utf8");
  } catch {
    console.log("Can't read the Maketar. Are you sure the filename is correct?");
    process.exit(1);
  }
}

maketar = maketar.replaceAll("\r", "").split("\n");
let ptr = 0;

while (ptr <= maketar.length - 1) {
  const statement = maketar[ptr].split(" ");

  switch (statement[0]) {
    case "test":
      console.log("one");
      break;
    case "testtwo":
      console.log("two");
      break;
  }

  ptr++;
}

console.log("\nDone");
