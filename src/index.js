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

const fs = require("fs");
const argv = require('yargs')
.option('file', {
  alias: 'f',
  type: 'string',
  description: 'Run with verbose logging'
}).argv;
const path = require('path');
// const cp = require("child_process");
// let args = process.argv.slice(2);
// const lastArg = args[args.length - 1];
exports.ERRORS = {
  FILE_NAME_DOESNT_EXIST: (fileName) => {
    return `{${fileName}} does not exist. Please choose a file that exists`;
  }
};

exports.run = (config) => {
  const fileName = path.resolve(process.cwd(), config.file);

  if(!fs.existsSync(fileName)){
    console.error(this.ERRORS.FILE_NAME_DOESNT_EXIST(config.file));
    return;
  }

  const maketarFile = fs.readFileSync(fileName, "utf8");
  const commandList = maketarFile.split("\r").join("").split("\n\n");


  commandList.forEach(command => {
    const miniCommands = command.split("\n").filter(c => c != '');
    // const starterCommand = miniCommands.pop();
    const [commandAction, commandActionParam] = miniCommands[0].split(' ');

    
    if(commandAction === "config"){
      if(commandActionParam == "name"){
        console.log(`Set name to ${miniCommands[1]}`);
      }
    }
    if(commandAction === "add"){
      if (!fs.existsSync(".maketartemp")) {
        fs.mkdirSync(".maketartemp");
      }

      let src;
      let dest;
      if(commandActionParam === "file"){
        src = miniCommands[1];
        dest = miniCommands[1];
        if(fs.existsSync(src)){
          fs.copyFileSync(src, `.maketartemp/${dest}`);
        }
      }else if(commandActionParam === "fileAs"){
        src = miniCommands[1];
        dest = miniCommands[2];
        if(fs.existsSync(src)){
          fs.copyFileSync(src, `.maketartemp/${dest}`);
        }
      }
  
      
      // else if(commandActionParam === "dir"){
      //   const files = [];
      //   ptr++;
      //   const src = commandList[ptr];
      //   fs.readdirSync(src, {
      //     "withFileTypes": true
      //   }).forEach((item) => {
      //     if (item.isFile()) {
      //       files.push(item.name);
      //     }
      //   });
      //   console.log(`Adding files from directory ${src}`);
      //   fs.mkdirSync(`.maketartemp/${src}`);
      //   files.forEach((item) => {
      //     fs.copyFileSync(`${src}/${item}`, `.maketartemp/${src}/${item}`);
      //     console.log(`Added file ${src}/${item}`);
      //   });
      // } 
      // else if(commandActionParam === "dirAs"){
      //   const files = [];
      //   ptr++;
      //   const src = commandList[ptr];
      //   ptr++;
      //   const dest = commandList[ptr];
      //   fs.readdirSync(src, {
      //     "withFileTypes": true
      //   }).forEach((item) => {
      //     if (item.isFile()) {
      //       files.push(item.name);
      //     }
      //   });
      //   console.log(`Adding files from directory ${src} to ${dest}`);
      //   if (dest != ".") {
      //     fs.mkdirSync(`.maketartemp/${dest}`);
      //   }
      //   files.forEach((item) => {
      //     fs.copyFileSync(`${src}/${item}`, `.maketartemp/${dest}/${item}`);
      //     console.log(`Added file ${src}/${item} as ${dest}/${item}`);
      //   });
      // }
    }
  
  });
}

if(argv.autorun){
  this.run({
    file: argv.file
  });
}




// console.log('aa', commandList);

// let name = "archived";
// let tempDirCreated = false;

// let ptr = 0;


// const make

// while (ptr <= commandList.length - 1) {
//   const statement = commandList[ptr].split(" ");

//   switch (statement[0]) {

//     case "add":
//       if (!tempDirCreated) {
//         fs.mkdirSync(".maketartemp");
//         tempDirCreated = true;
//       }

//       switch (statement[1]) {
//         case "file":
//           ptr++;
//           const src = commandList[ptr];
//           fs.copyFileSync(src, `.maketartemp/${src}`);
//           console.log(`Added file ${src}`);
//           break;
//         case "fileAs":
//           ptr++;
//           const src = commandList[ptr];
//           ptr++
//           const dest = commandList[ptr];
//           fs.copyFileSync(src, `.maketartemp/${dest}`);
//           console.log(`Added file ${src} as ${dest}`);
//           break;
//         case "dir":
//           const files = [];
//           ptr++;
//           const src = commandList[ptr];
//           fs.readdirSync(src, {
//             "withFileTypes": true
//           }).forEach((item) => {
//             if (item.isFile()) {
//               files.push(item.name);
//             }
//           });
//           console.log(`Adding files from directory ${src}`);
//           fs.mkdirSync(`.maketartemp/${src}`);
//           files.forEach((item) => {
//             fs.copyFileSync(`${src}/${item}`, `.maketartemp/${src}/${item}`);
//             console.log(`Added file ${src}/${item}`);
//           });
//           break;
//         case "dirAs":
//           const files = [];
//           ptr++;
//           const src = commandList[ptr];
//           ptr++;
//           const dest = commandList[ptr];
//           fs.readdirSync(src, {
//             "withFileTypes": true
//           }).forEach((item) => {
//             if (item.isFile()) {
//               files.push(item.name);
//             }
//           });
//           console.log(`Adding files from directory ${src} to ${dest}`);
//           if (dest != ".") {
//             fs.mkdirSync(`.maketartemp/${dest}`);
//           }
//           files.forEach((item) => {
//             fs.copyFileSync(`${src}/${item}`, `.maketartemp/${dest}/${item}`);
//             console.log(`Added file ${src}/${item} as ${dest}/${item}`);
//           });
//           break;
//       }
//       break;
//   }

//   ptr++;
// }

// console.log("Archiving and compressing files.");
// cp.spawnSync("tar", ["-cJC", ".maketartemp", "-f", `${name}.tar.xz`, "."]);
// cp.spawnSync("rm", ["-rf", ".maketartemp"]); // WHY!?

// console.log("\nDone.");
