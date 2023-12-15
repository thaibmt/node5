const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const mongodbStore = require("connect-mongodb-session")(session);
const rootController = require('./controllers/rootController');
const app = express();
const HOST = 'localhost';
const PORT = process.env.PORT || 3000;
const CONNECTION_STRING = 'mongodb://127.0.0.1:27017/bag_database';
// Khai báo store
const store = new mongodbStore({
    uri: CONNECTION_STRING,
    collection: "sessions",
});
app.use(
    session({
        secret: "CHUOI_BI_MAT",
        resave: false,
        saveUninitialized: false,
        store: store,
    })
);
// view template
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
// Static file
app.use('/css', express.static(__dirname + '/css'));
app.use(bodyParser.urlencoded({ extended: true }));
// Kết nối với CSDL 
mongoose.connect(CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
// xử lý tất cả request
app.use('', rootController);
// Chạy ứng dụng
app.listen(PORT, () => {
    console.log(`Server is running at: http://${HOST}:${PORT}`);
});
