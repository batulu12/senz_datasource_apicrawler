// 在 Cloud code 里初始化 Express 框架
var express = require('express');
var app = express();

// App 全局配置
app.set('views', 'cloud/views');   // 设置模板目录
app.set('view engine', 'ejs');    // 设置 template 引擎
app.use(express.bodyParser());    // 读取请求 body 的中间件

// 使用 Express 路由 API 服务 /hello 的 HTTP GET 请求

var _ = require('underscore');
var Models = require('cloud/model')

var Database = require('cloud/database')();
var Kr = require('cloud/source/kr')();

var updateItem = function (itemId, newItemFetcher, dbItemFetcher, ItemClass) {
    var promise = new AV.Promise(),
        dbItem, newItem;
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
                    return founder.save();
                } else {
                    var tmpFounder = new ItemClass(newItem);
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
            promise.resolve(founder);
        }, function (err) {
            console.log(err);
            promise.reject(err);
        })
    return promise;
}

var updateCompaniesByUser = function (userId) {
    var promise = new AV.Promise(),
        user, companies, userCompanies;
    updateItem(userId, Kr.getFounderBasic, Database.getLatestKrFounder, Models.KrFounder)
        .then(function (founder) {
            user = founder;
            return Kr.getFounderCompany(founder.get('itemId'));
        }).then(function (founderCompanies) {
            var promises = [];
            founderCompanies.expList.forEach(function (company) {
                var promise = updateItem(company.groupId, Kr.getCompanyInfo, Database.getLatestKrCompany, Models.KrCompany)
                promises.push(promise);
            })
            return AV.Promise.all(promises);
        }).then(function (cs) {
            companies = cs;
            //console.log('companies');
            //console.log(companies.length);
            return Database.getLatestKrUserCompany(user.id);
        }).then(function (userCompany) {
            if (!userCompany) {
                userCompany = new Models.KrUserCompany();
                userCompany.set('user', user);
            }
            var uCompanies = userCompany.relation('companies');
            companies.forEach(function (c) {
                uCompanies.add(c);
            });
            return userCompany.save();
        }).then(function (userCompany) {
            promise.resolve(userCompany);
        }, function (err) {
            promise.reject(err);
        })
    return promise;
}

app.post('/user/:userId/updateAll', function (req, res) {
    var userId = req.params['userId'];
    console.log('userId,%s', userId);
    updateCompaniesByUser(userId)
        .then(function (userCompany) {
            res.send(userCompany);
            console.log('updateCompaniesByUser success,%s', userCompany.id);
        }, function (err) {
            console.log('updateCompaniesByUser failed');
            res.status(500).send(err);
        })
});

//updateItem(9733, Kr.getFounderBasic, Database.getLatestKrFounder, Models.KrFounder)
//updateItem(133592, Kr.getCompanyInfo, Database.getLatestKrCompany, Models.KrCompany)

//fetchAndStoreCompanyByUser(13644);

//updateCompanyByUser(9733);

//updateUser(9733);

app.listen();