const fs = require("fs");
const util = require("util");
const mineReadFile = util.promisify(fs.readFile);
// callback 関数で実現
// fs.readFile("./resource/1.html", (err, data1) => {
//   if (!err) {
//     fs.readFile("./resource/2.html", (err, data2) => {
//       if (!err) {
//         fs.readFile("./resource/3.html", (err, data3) => {
//           if (!err) {
//             console.log(data1 + data2 + data3);
//           }
//         });
//       }
//     });
//   }
// });

// async とawait
async function main() {
  // 最初のファイルを読む
  let result1 = await mineReadFile("./resource/1.html");
  console.log(result1 instanceof Promise);
  let result2 = await mineReadFile("./resource/2.html");
  let result3 = await mineReadFile("./resource/3.html");

  console.log(result1 + result2 + result3);
}
main()