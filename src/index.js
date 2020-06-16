#!/usr/bin/env node

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
let args = process.argv.slice(2);

if (!args[0]) args[0] = "Maketar";
let maketar;
try {
  maketar = fs.readFileSync(args[0], "utf8");
} catch {
  console.log("Can't read the Maketar. Does it exist? Do you have the proper privileges?");
  process.exit(1);
}

let name = "archived";
let tempDirCreated = false;

function addFile(src, dest) {
  if (!tempDirCreated) {
    fs.mkdirSync(".maketartemp");
    tempDirCreated = true;
    console.log("Created temp directory.");
  }
  if (!dest) dest = src;

  fs.copyFileSync(src, `.maketartemp/${dest}`);
  console.log(`Added file ${src} as ${dest}`);
}
function addDir(src, dest) {
  let dir = fs.readdirSync(src, {
    "withFileTypes": true
  });
  if (!dest) dest = src;

  console.log(`Adding files from ${src} to ${dest}`);
  if (dest != ".") fs.mkdirSync(`.maketartemp/${dest}`);
  dir.forEach((item) => {
    if (item.isFile()) {
      addFile(`${src}/${item.name}`, `${dest}/${item.name}`);
    }
  });
}

maketar = maketar.replaceAll("\r", "").split("\n");
let ptr = 0;
while (ptr <= maketar.length - 1) {
  const line = maketar[ptr];
  let src;
  let dest;

  switch (line) {
    case "setName":
      ptr++;
      name = maketar[ptr];
      console.log(`Set name to ${name}`);
      break;
    case "addFile":
      ptr++;
      src = maketar[ptr];
      addFile(src);
      break;
    case "addFileAs":
      ptr++;
      src = maketar[ptr];
      ptr++;
      dest = maketar[ptr];
      addFile(src, dest);
      break;
    case "addDir":
      ptr++;
      src = maketar[ptr];
      addDir(src);
      break;
    case "addDirAs":
      ptr++;
      src = maketar[ptr];
      ptr++;
      dest = maketar[ptr];
      addDir(src, dest);
      break;
  }

  ptr++;
}

if (tempDirCreated) {
  console.log("Archiving and compressing files.");
  cp.spawnSync("tar", ["-cJC", ".maketartemp", "-f", `${name}.tar.xz`, "."]);
  cp.spawnSync("rm", ["-rf", ".maketartemp"]); // WHY!?
  console.log("Removed temp directory.");
}

console.log("\nDone.");
