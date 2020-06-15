/*
circl Software License version 1 revision 1 (CSLv1.1)

Definitions:
"Software" - This software and its associated documentation files.
"Redistrbution" - A change of the medium that the Software is initially released on.
"Developer" - The person(s) or organization(s) which has/have authored the Software. (circl Software)
"User" - Any person or organization who has obtained the Software.

Copyright of the Developer 2020.

1. Permission is granted, free of charge, to the User, to use and modify the Software in any way.
 1.1. The User MAY NOT sell the Software, without direct consent from the Developer.
 1.2. If Redistributed, the User MUST make it obvious that the Redistribution is a "mirror", or "copy".
  1.2.1 If any changes have been made to the Software in the Redistribution, they must be noted below the license, or in the source code.

2. THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE AND NON-INFRINGEMENT.

3. IN NO EVENT SHALL THE DEVELOPER OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

4. This license is to be included in all copies or substantial portions of the Software.
*/

require("cjse");
const fs = require("fs");
const cp = require("child_process");
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

let name = "archived";
let tempDirCreated = false;

maketar = maketar.replaceAll("\r", "").split("\n");
let ptr = 0;

while (ptr <= maketar.length - 1) {
  const statement = maketar[ptr].split(" ");

  switch (statement[0]) {
    case "config":
      switch (statement[1]) {
        case "name":
          ptr++;
          name = maketar[ptr];
          console.log(`Set name to ${name}`);
          break;
      }
      break;
    case "add":
      if (!tempDirCreated) {
        fs.mkdirSync(".maketartemp");
        tempDirCreated = true;
      }

      let src;
      let dest;
      let files;
      switch (statement[1]) {
        case "file":
          ptr++;
          src = maketar[ptr];
          fs.copyFileSync(src, `.maketartemp/${src}`);
          console.log(`Added file ${src}`);
          break;
        case "fileAs":
          ptr++;
          src = maketar[ptr];
          ptr++
          dest = maketar[ptr];
          fs.copyFileSync(src, `.maketartemp/${dest}`);
          console.log(`Added file ${src} as ${dest}`);
          break;
        case "dir":
          files = [];
          ptr++;
          src = maketar[ptr];
          fs.readdirSync(src, {
            "withFileTypes": true
          }).forEach((item) => {
            if (item.isFile()) {
              files.push(item.name);
            }
          });
          console.log(`Adding files from directory ${src}`);
          fs.mkdirSync(`.maketartemp/${src}`);
          files.forEach((item) => {
            fs.copyFileSync(`${src}/${item}`, `.maketartemp/${src}/${item}`);
            console.log(`Added file ${src}/${item}`);
          });
          break;
        case "dirAs":
          files = [];
          ptr++;
          src = maketar[ptr];
          ptr++;
          dest = maketar[ptr];
          fs.readdirSync(src, {
            "withFileTypes": true
          }).forEach((item) => {
            if (item.isFile()) {
              files.push(item.name);
            }
          });
          console.log(`Adding files from directory ${src} to ${dest}`);
          if (dest != ".") {
            fs.mkdirSync(`.maketartemp/${dest}`);
          }
          files.forEach((item) => {
            fs.copyFileSync(`${src}/${item}`, `.maketartemp/${dest}/${item}`);
            console.log(`Added file ${src}/${item} as ${dest}/${item}`);
          });
          break;
      }
      break;
  }

  ptr++;
}

console.log("Archiving and compressing files.");
cp.spawnSync("tar", ["-cJC", ".maketartemp", "-f", `${name}.tar.xz`, "."]);
cp.spawnSync("rm", ["-rf", ".maketartemp"]); // WHY!?

console.log("\nDone.");
