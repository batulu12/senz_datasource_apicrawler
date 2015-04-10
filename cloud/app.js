// 在 Cloud code 里初始化 Express 框架
var express = require('express');
var app = express();

// App 全局配置
app.set('views', 'cloud/views');   // 设置模板目录
app.set('view engine', 'ejs');    // 设置 template 引擎
app.use(express.bodyParser());    // 读取请求 body 的中间件

// 使用 Express 路由 API 服务 /hello 的 HTTP GET 请求
app.get('/hello', function (req, res) {
    res.render('hello', {message: 'Congrats, you just set up your app!'});
});

var Url = require('url');
var _ = require('underscore');

var ApiEndpoint = AV.Object.extend('ApiEndpoint'),
    CrawlResult = AV.Object.extend('CrawlResult');
app.post('/apis/:api_id/fetch_and_store', function (req, res) {
    var options,
        api;
    new AV.Query(ApiEndpoint).get(req.params['api_id'])
        .then(function (apiEndpoint) {
            var api = apiEndpoint;
            options = {
                method: req.body['method'] || api.get('method') || "GET",
                url: Url.format({
                    protocol: api.get('protocol'),
                    hostname: api.get('hostname'),
                    pathname: api.get('path')
                }),
                params: _.defaults(req.body['query'] || {}, api.get('query')),
                body: _.defaults(req.body['data'] || {}, api.get('query'))
            };
            return AV.Cloud.httpRequest(_.clone(options));
        }).then(function (body) {
            var result = {
                options: options,
                api: api,
                result: JSON.parse(body.text)
            };
            _.extend(result, options);
            (new CrawlResult(result).save());
        }).then(function (result) {
            res.send(result);
        }, function (err) {
            res.error(err);
        })
});

app.listen();