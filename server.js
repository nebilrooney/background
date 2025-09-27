// simple express server 
const express = require("express");
const fs = require("fs").promises;

const app = express();
const PORT = 3000;

// small helper 
function wait(ms) {
  return new Promise((done) => setTimeout(done, ms));
}

//CALLBACK 
function getDataWithCallback(cb) {
  setTimeout(() => {
    // some fake data
    const info = { id: 1, name: "Jhon" };
    cb(null, info); // error is null
  }, 1000);
}

//PROMISE STYLE
function getDataWithPromise() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const info = { id: 2, name: "Jhon" };
      resolve(info);
    }, 1000);
  });
}

//ASYNC/AWAIT STYLE
async function getDataWithAsync() {
  let info = await getDataWithPromise();
  return info;
}

// ---------------- ROUTES ----------------

// test callback
app.get("/callback", (req, res) => {
  getDataWithCallback((err, result) => {
    if (err) {
      return res.status(500).json({ error: "something went wrong (callback)" });
    }
    res.json({ msg: "got data using callback", result });
  });
});

// test promise
app.get("/promise", (req, res) => {
  getDataWithPromise()
    .then((result) => res.json({ msg: "got data using promise", result }))
    .catch(() =>
      res.status(500).json({ error: "something went wrong (promise)" })
    );
});

// test async/await
app.get("/async", async (req, res) => {
  try {
    const result = await getDataWithAsync();
    res.json({ msg: "got data using async/await", result });
  } catch (e) {
    res.status(500).json({ error: "something went wrong (async/await)" });
  }
});

// read a file using fs.promises
app.get("/file", async (req, res) => {
  try {
    const filePath = "./demo.txt";
    // create a file (overwrite every time just for demo)
    await fs.writeFile(filePath, "hello, this file was written then read!");
    const data = await fs.readFile(filePath, "utf-8");
    res.json({ msg: "file read successfully", data });
  } catch (e) {
    res.status(500).json({ error: "couldn't read file" });
  }
});

// chain steps with delays
app.get("/chain", async (req, res) => {
  try {
    await wait(500);
    console.log("1) logged in");

    await wait(500);
    console.log("2) fetched data");

    await wait(500);
    console.log("3) rendered page");

    res.json({
      steps: ["1) logged in", "2) fetched data", "3) rendered page"],
    });
  } catch (e) {
    res.status(500).json({ error: "error during chain steps" });
  }
});

// start server
app.listen(PORT, () => {
  console.log(`server is running on http://localhost:${PORT}`);
});
