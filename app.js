const express = require("express");
const fs = require("fs");
const multer = require("multer");
const path = require("path");
const { uploadFile, downloadFile } = require("./s3");

require("dotenv").config();

const app = express();

const upload1 = multer({
    storage: multer.diskStorage({
        // Membuat konfigurasi destination storage
        destination: function (req, file, callback) {
            callback(null, path.join(__dirname, "/uploads"));
        },

        // Konfigurasi Filename storage multer
        filename: function (req, file, callback) {
            // callback(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname));
            callback(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
        }
    })
});

const upload2 = multer({ dest: path.join(__dirname, "/uploads") });

const port = process.env.PORT || 3100;
const url = new URL("/", process.env.URL || "http://localhost:" + port);


app.post("/image", upload2.single("image"), async (req, res) => {
    const file = req.file;
    if (!file) {
        res.send("upload failed");
    };

    const result = await uploadFile(file);
    const remove = await fs.unlinkSync(file.path);
    console.log(file);
    console.log(result);
    res.send(file);
});

app.get("/image/(:image)", async (req, res) => {
    const image = req.params.image;
    const read_stream = downloadFile(image);
    read_stream.pipe(res);
});

app.listen(port, function () {
    console.log(`example AWS S3 running ${url.origin}`);
});