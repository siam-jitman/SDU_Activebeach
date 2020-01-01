const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const path = require("path")
const FormData = require('form-data');


const fileUpload = require('express-fileupload');

const ProxyCtrl = require('./controller/ProxyCtrl')

const app = express();

app.use('/', express.static(__dirname + "/public/webpage/"));
app.get("/", (req, res) => {
    res.sendFile(path.join(path.resolve(__dirname) + '/public/webpage/'));
});


// blog author
app.use('/th/blog/author/:param1?/', express.static(__dirname + "/public/webpage/"));
app.get("/th/blog/author/:param1?/", (req, res) => {
    res.sendFile(path.join(path.resolve(__dirname) + '/public/webpage/'));
});
app.get("/th/blog/author/:param1?/:param2?/*", (req, res) => {
    res.sendFile(path.join(path.resolve(__dirname) + '/public/webpage/th/blogger.html'));
});

app.use('/en/blog/author/:param1?/', express.static(__dirname + "/public/webpage/"));
app.get("/en/blog/author/:param1?/", (req, res) => {
    res.sendFile(path.join(path.resolve(__dirname) + '/public/webpage/'));
});
app.get("/en/blog/author/:param1?/:param2?/*", (req, res) => {
    res.sendFile(path.join(path.resolve(__dirname) + '/public/webpage/en/blogger.html'));
});



// blog post
app.use('/th/blog/post/:param1?/', express.static(__dirname + "/public/webpage/"));
app.get("/th/blog/post/:param1?/", (req, res) => {
    res.sendFile(path.join(path.resolve(__dirname) + '/public/webpage/'));
});
app.use('/th/blog/post/:param1?/', express.static(__dirname + "/public/webpage/"));
app.get("/th/blog/post/:param1?/", (req, res) => {
    res.sendFile(path.join(path.resolve(__dirname) + '/public/webpage/'));
});
app.get("/th/blog/post/:param1?/:param2?/*", (req, res) => {
    res.sendFile(path.join(path.resolve(__dirname) + '/public/webpage/th/blog.html'));
});

app.use('/en/blog/post/:param1?/', express.static(__dirname + "/public/webpage/"));
app.get("/en/blog/post/:param1?/", (req, res) => {
    res.sendFile(path.join(path.resolve(__dirname) + '/public/webpage/'));
});
app.get("/en/blog/post/:param1?/:param2?/*", (req, res) => {
    res.sendFile(path.join(path.resolve(__dirname) + '/public/webpage/en/blog.html'));
});

// more
// app.use('/th/more/:param1?/', express.static(__dirname + "/public/webpage/"));
// app.get("/th/more/:param1?/", (req, res) => {
//     res.sendFile(path.join(path.resolve(__dirname) + '/public/webpage/'));
// });
// app.use('/th/more/:param1?/', express.static(__dirname + "/public/webpage/"));
// app.get("/th/more/:param1?/", (req, res) => {
//     res.sendFile(path.join(path.resolve(__dirname) + '/public/webpage/'));
// });
// app.get("/th/more/:param1?/:param2?/*", (req, res) => {
//     res.sendFile(path.join(path.resolve(__dirname) + '/public/webpage/th/more.html'));
// });

// app.use('/en/more/:param1?/', express.static(__dirname + "/public/webpage/"));
// app.get("/en/more/:param1?/", (req, res) => {
//     res.sendFile(path.join(path.resolve(__dirname) + '/public/webpage/'));
// });
// app.get("/en/more/:param1?/:param2?/*", (req, res) => {
//     res.sendFile(path.join(path.resolve(__dirname) + '/public/webpage/en/more.html'));
// });

app.use(cors());
// app.use(bodyParser.json({
//     limit: '50mb'
// }));
// app.use(bodyParser.urlencoded({
//     extended: true
// }));


app.use(bodyParser.json({
    limit: '50mb'
}));
// default options
app.use(fileUpload());
app.use(bodyParser.urlencoded({
    limit: '50mb',
    extended: true
}));

// app.use((req, res, next) => {
//     res.setHeader('Content-Type', 'application/json');
//     res.statusCode = 200;
//     next();
// });


app.get('/proxy/*', async (req, res, next) => {
    let TAG = "[/proxy/*]"
    // console.log(req);
    // console.log(TAG, "======== start request proxy ========", JSON.stringify(req.originalUrl, null, 3), new Date());
    // console.log(TAG, "GET param", JSON.stringify(req.query, null, 3));
    let serviceContext = req.originalUrl.substring(6);
    console.log(serviceContext);

    let proxy = new ProxyCtrl();
    let serviceResponse = await proxy.get(serviceContext, req.headers.authorization ? req.headers.authorization : "")
    proxy.proxyResponse(res, serviceResponse);
});

// app.post('/proxy/*', async (req, res, next) => {
//     let TAG = "[/proxy/*]"
//     // console.log(req);
//     console.log(TAG, "======== start request proxy ========", req.originalUrl, new Date());
//     console.log(TAG, "GET param", req.query);
//     let serviceContext = req.originalUrl.substring(6);
//     console.log(serviceContext);

//     let proxy = new ProxyCtrl();
//     let serviceResponse = await proxy.post(serviceContext)
//     proxy.proxyResponse(res, serviceResponse);
// });

app.post('/formdata/*', async (req, res, next) => {
    let TAG = "[/formdata*]";
    // console.log(TAG, "======== start request proxy formdata ========", req, new Date());
    // console.log(TAG, "POST body", JSON.stringify(req.body, null, 3));
    let serviceContext = req.originalUrl.substring(9);
    let header = {}
    if (req.headers.authorization) {
        header.Authorization = req.headers.authorization;
    }
    console.log(TAG, "serviceContext", serviceContext);
    let form = new FormData();
    Object.keys(req.body).forEach(key => {
        form.append(key, req.body[key]);
    });
    if (req.files) {

        Object.keys(req.files).forEach(key => {
            form.append(key, Buffer.from(req.files[key].data), {
                filename: req.files[key].name
            });
            // form.append(key, req.files[key]);
        });
    }

    let proxy = new ProxyCtrl();
    let serviceResponse = await proxy.post(serviceContext, form, {
        ...form.getHeaders(),
        header
    })
    proxy.proxyResponse(res, serviceResponse);
});

app.post('/formbody/*', async (req, res, next) => {
    let TAG = "[/formbody*]";
    // console.log(TAG, "======== start request proxy formdata ========", req, new Date());
    // console.log(TAG, "POST body", req.body);
    let serviceContext = req.originalUrl.substring(9);
    let header = {
        "Content-Type": "application/x-www-form-urlencoded"
    }
    if (req.headers.authorization) {
        header.Authorization = req.headers.authorization;
    }
    // console.log(TAG, "serviceContext", serviceContext);
    let proxy = new ProxyCtrl();
    let body = await proxy.convertJsonToParameterURL(req.body);
    console.log(TAG, "POST body", body);
    let serviceResponse = await proxy.post(serviceContext, body, header)
    proxy.proxyResponse(res, serviceResponse);
});
app.listen(3001, () => console.log('Started server listening on port 3001!', 'http://localhost:3001'))