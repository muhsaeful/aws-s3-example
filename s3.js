const fs = require("fs");
const S3 = require("aws-sdk/clients/S3");

require("dotenv").config();

const bucket_name = process.env.AWS_BUCKET_NAME
const bucket_region = process.env.AWS_BUCKET_REGION
const access_key = process.env.AWS_ACCESS_KEY
const secret_key = process.env.AWS_SECRET_KEY

const s3 = new S3({
    region: bucket_region,
    accessKeyId: access_key,
    secretAccessKey: secret_key,
})

//upload
exports.uploadFile = function (file) {
    const file_stream = fs.createReadStream(file.path);
    const upload_params = {
        Bucket: bucket_name,
        Body: file_stream,
        Key: file.filename
    };

    return s3.upload(upload_params).promise();
}

//download
exports.downloadFile = function (image) {
    const download_params = {
        Key: image,
        Bucket: bucket_name,
    };
    return s3.getObject(download_params).createReadStream();
}

//update
exports.updateFile = function(){
return s3.putObject()
}