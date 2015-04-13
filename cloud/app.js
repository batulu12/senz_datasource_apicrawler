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

var _ = require('underscore');
var Models = require('cloud/module')

var Database = require('cloud/database')();
var Kr = require('cloud/source/kr')();

var updateItem = function (itemId, newItemFetcher, dbItemFetcher, ItemClass) {
    var promise = new AV.Promise(),
        dbItem, newItem;
    console.log('update item ,%s', itemId);
    newItemFetcher(itemId)
        .then(function (item) {
            newItem = item;
            newItem.itemId = itemId;
            newItem = _.omit(newItem, 'id');
            return dbItemFetcher(itemId);
        })
        .then(function (founder) {
            dbItem = founder;
            if (dbItem) {
                if (_.isEqual(_.omit(dbItem.get('raw')), newItem)) {
                    console.log('cached,%s', itemId);
                    return new AV.Promise.as(founder);
                } else {
                    console.log('changed,%s', itemId);
                    var tmpFounder = new ItemClass(newItem);
                    //tmpFounder.id = dbFounder.id;
                    tmpFounder.set('raw', newItem);
                    return tmpFounder.save();
                }
            } else {
                newItem.raw = _.clone(newItem);
                console.log('new item,%s', itemId);
                return new ItemClass(_.extend(newItem, {itemId: itemId})).save();
            }
        })
        .then(function (founder) {
            //founderBasic = founder;
            //console.log(JSON.stringify(founder.get('raw')));
            console.log('update completed,%s', itemId);
            promise.resolve(founder);
        }, function (err) {
            console.log(err);
            promise.reject(err);
        })
    return promise;
}

//updateItem(9733, Kr.getFounderBasic, Database.getLatestKrFounder, Models.KrFounder)
updateItem(133592, Kr.getCompanyInfo, Database.getLatestKrCompany, Models.KrCompany)

//fetchAndStoreCompanyByUser(13644);

//updateCompanyByUser(9733);

//updateUser(9733);

app.listen();