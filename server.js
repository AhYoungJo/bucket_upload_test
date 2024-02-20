const express = require("express");
const aws = require("aws-sdk"); //aws 설정 모듈
const multer = require("multer");
const multerS3 = require("multer-s3"); // aws multer-s3의 파일 업로드하기 위한 multer 설정

require("dotenv").config();

const app = express();
const PORT = 8080;

// aws 설정
aws.config.update({
    accessKeyId: process.env.ACCESSKEYID, //엑세스 키
    secretAccessKey: process.env.SECRETACCESSKEY, //엑세스 비밀번호
    region: process.env.REGION, //버킷 생성 국가: 아시아 태평양(서울) ap-northeast-2
});
//aws s3 인스턴스 생성
const s3 = new aws.S3();

//multer 설정
const upload = multer({
    //storage multers3설정
    storage: multerS3({
        s3, //s3 : s3
        bucket: "aymybucket",
        acl: "public-read", //파일 접근 권한: 업로드된 파일 공개하기
        metadata: function (req, file, cb) {
            cb(null, { fieldName: file.fieldname });
        },
        key: function (req, file, cb) {
            cb(null, Date.now().toString() + "-" + file.originalname);
        },
    }),
});

app.set("view engine", "ejs");
app.use(express.json());

app.get("/", (req, res) => {
    res.render("index");
});

// 여러가지 파일 업로드
app.post("/upload", upload.array("files"), (req, res) => {
    console.log(req.files);
    res.json(req.files);
});

app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
});
