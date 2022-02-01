const fs = require("fs")
// コールバック形式
// fs.readFile("./resource/content.txt",(err,data)=>{
//   if(err) throw err;
//   // fileの中身を出す
//   console.log(data.toString())
// })

// promiseでラップする
const p = new Promise((resolve, reject) => {
  fs.readFile("./resource/content.txt", (err, data) => {
    if (err) {
      reject(err);
    }
    // fileの中身を出す
    resolve(data)
  })
})

p.then(
    (value) => {
      console.log(value.toString())
    },
    (reason) => {
      console.log(reason);
    }
)