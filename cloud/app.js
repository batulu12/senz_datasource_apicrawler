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
var Dbmovie = require('cloud/source/dbmovie')();
var DbCity = require('cloud/source/dbcity')();
var Damai = require('cloud/source/damai')();
var Wdj = require('cloud/source/wdj')();
var Dzdp = require('cloud/source/dzdpinfo')();
var AppStore = require('cloud/source/appstore')();

// important

var updateItem = function (itemId, newItemFetcher, dbItemFetcher, ItemClass) {
    var promise = new AV.Promise(),
        dbItem, newItem;
    newItemFetcher(itemId)
        .then(function (item) {
            console.log('hshy new item,%s', item.country);
            newItem = item;
            newItem.itemId = itemId;
            newItem = _.omit(newItem, 'id');
            return dbItemFetcher(itemId);
        })
        .then(function (founder) {
            dbItem = founder;
            if (dbItem) {
                if (_.isEqual(_.omit(dbItem.get('raw')), newItem)) {
                    console.log('hshy new item,%s', newItem.name);
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

/*new Models.KrFounder().save()
    .then(function (founder) {
        founder.set('name', founder.get('name') + '1');
        return founder.save();
    }).then(function (founder) {
        console.log(founder);
    })

founder
var promise = new AV.Promise(),
    founder = new founder()
founder.save()
    .then(function (founder))
{
    founder
    promise.resolve(founder)
}
,
function (err) {

}*/


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

//豆瓣电影
var getMovieName = function (movieId,ItemClass) {
    var promise = new AV.Promise(),
        dbItem, newItem;
    Dbmovie.getMovieInfo(movieId).then(function (item) {
        newItem = item;
        newItem.movieId = movieId;
        return Database.getLatestMovie(movieId);
    }).then(function (founder) {
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
            return new ItemClass(newItem).save();
            //return new ItemClass(_.extend(newItem, {title: newItem.title})).save();
        }
    }).then(function (founder) {
        promise.resolve(founder);
    }, function (err) {
        promise.reject(err);
    })
}

//豆瓣同城
var getActivityName = function (activityId,ItemClass) {
    var promise = new AV.Promise();
    DbCity.getActivityInfo(activityId).then(function (item) {
        newItem = item;
        newItem.activityId = activityId;
        return Database.getLatestActivity(activityId);
    }).then(function (founder) {
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
            return new ItemClass(newItem).save();;
        }
    }).then(function (founder) {
        promise.resolve(founder);
    }, function (err) {
        console.log(err);
        promise.reject(err);
    })
}

var getDamaiActivity = function (activityId, ItemClass) {
    var promise = new AV.Promise(),
        dbItem, newItem;
    Damai.getActivityInfo(activityId).then(function (item) {
        newItem = item;
        console.log(newItem.title);
        newItem.activityId = activityId;
        return Database.getLatestActivity(activityId);
    }).then(function (founder) {
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
            return new ItemClass(newItem).save();
        }
    }).then(function (founder) {
        promise.resolve(founder);
    }, function (err) {
        console.log(err);
        promise.reject(err);
    })
}

var getAppInfo = function (appId, ItemClass) {
    var promise = new AV.Promise(),
        dbItem, newItem;
    Wdj.getAppInfo(appId).then(function (item) {
        newItem = item;
        newItem.appId = appId;
        //newItem = _.omit(newItem, 'id');
        return Database.getLatestApp(appId);
    }).then(function (founder) {
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
            //console.log('new item,%s', newItem.title);
            return new ItemClass(newItem).save();
            //return new ItemClass(_.extend(newItem, {title: newItem.title})).save();
        }
    }).then(function (founder) {
        promise.resolve(founder);
    }, function (err) {
        console.log(err);
        promise.reject(err);
    })
}

var getAppStoreInfo = function (appId, ItemClass) {
    var promise = new AV.Promise(),
        dbItem, newItem;
    AppStore.getAppStoreInfo(appId).then(function (item) {
        console.log('app,%s', item.trackName);
        newItem = item;
        return Database.getLatestAppleApp(item.trackId);
    }).then(function (founder) {
        dbItem = founder;
        if (dbItem) {
            if (_.isEqual(_.omit(dbItem.get('raw')), newItem)) {
                console.log('wdj item,%s', newItem.trackName);
                return founder.save();
            } else {
                var tmpFounder = new ItemClass(newItem);
                tmpFounder.set('raw', newItem);
                return tmpFounder.save();
            }
        } else {
            newItem.raw = _.clone(newItem);
            return new ItemClass(_.extend(newItem, {title: newItem.name})).save();
        }
    }).then(function (founder) {
        promise.resolve(founder);
    }, function (err) {
        console.log(err);
        promise.reject(err);
    })
}

var getDzdp = function (itemId, ItemClass) {
    var promise = new AV.Promise(),
        dbItem, newItem;
    console.log('new item,%s', itemId);
    Dzdp.getDzdpInfo(itemId).then(function (item) {
        newItem = item;
        newItem.itemId = itemId;
        return Database.getLatestDzdp(itemId);
    }).then(function (founder) {
        dbItem = founder;
        if (dbItem) {
            if (_.isEqual(_.omit(dbItem.get('raw')), newItem)) {
                console.log('hshy new item,%s', newItem.title);
                return founder.save();
            } else {
                var tmpFounder = new ItemClass(newItem);
                tmpFounder.set('raw', newItem);
                return tmpFounder.save();
            }
        } else {
            newItem.raw = _.clone(newItem);
            console.log('new item,%s', itemId);
            return new ItemClass(newItem).save();
           // return new ItemClass(_.extend(newItem, {title: appId})).save();
        }
    }).then(function (founder) {
        promise.resolve(founder);
    }, function (err) {
        console.log(err);
        promise.reject(err);
    })
}

//大众点评  POST
//curl -X POST http://localhost:3000/dzdp/10981869/update
app.post('/dzdp/:itemId/update', function (req, res) {
    var itemId = req.params['itemId'];
    getDzdp(itemId, Models.DzdpInfo);
    // send request to dzdp api to fetch latest info of this app
    // update app info in leancloud
})
//大众点评 GET
//http://localhost:3000/dzdp/10981869
var getDzdpItem= function (itemId,res) {
    Dzdp.getDzdpInfo(itemId).then(function (item) {
        res.send(item);
    })

}
app.get('/dzdp/:itemId', function (req, res) {
    var itemId = req.params['itemId'];
    getDzdpItem(itemId,res);
});

//豌豆荚 POST
//http://localhost:3000/app/com.talkweb.dadwheregoing/update
app.post('/app/:appId/update', function (req, res) {
    var appId = req.params['appId'];
    getAppInfo(appId, Models.WdjApp);
    // send request to wandoujia api to fetch latest info of this app
    // update app info in leancloud
})
//豌豆荚 GET
//http://localhost:3000/app/com.talkweb.dadwheregoing
var getWdjApp= function (appId,res) {
    Wdj.getAppInfo(appId).then(function (item) {
        res.send(item);
    })

}
app.get('/app/:appId', function (req, res) {
    var appId = req.params['appId'];
    getWdjApp(appId,res);
});

//appstore POST
//curl -X POST http://localhost:3000/appstore/709306740/update
app.post('/appstore/:appId/update', function (req, res) {
    var appId = req.params['appId'];
    getAppStoreInfo(appId, Models.AppStore);
    // send request to wandoujia api to fetch latest info of this app
    // update app info in leancloud
})
//appstore GET
//http://localhost:3000/appstore/709306740
var getAppStoreApp= function (appId,res) {
    AppStore.getAppStoreInfo(appId).then(function (item) {
        res.send(item);
    })

}
app.get('/appstore/:appId', function (req, res) {
    var appId = req.params['appId'];
    getAppStoreApp(appId,res);
});


//大麦POST
//curl -X POST http://localhost:3000/damai/75374/update
app.post('/damai/:activityId/update', function (req, res) {
    var activityId = req.params['activityId'];
    getDamaiActivity(activityId, Models.Activity);
    // send request to damai api to fetch latest info of this app
    // update app info in leancloud
})
//大麦 GET
//http://localhost:3000/damai/75374
var getDamai= function (activityId,res) {
    Damai.getActivityInfo(activityId).then(function (item) {
       res.send(item);
    })

}
app.get('/damai/:activityId', function (req, res) {
    var activityId = req.params['activityId'];
    getDamai(activityId,res);
});


//豆瓣电影 POST
//curl -X POST http://localhost:3000/dbmovie/23761370/update
app.post('/dbmovie/:movieId/update', function (req, res) {
    var movieId = req.params['movieId'];
    console.log('movieId,%s', movieId);
    getMovieName(movieId,Models.DbMovie);
    // send request to damai api to fetch latest info of this app
    // update app info in leancloud
})
//豆瓣电影 GET
//http://localhost:3000/dbmovie/23761370
var getDbMovie= function (movieId,res) {
    Dbmovie.getMovieInfo(movieId).then(function (item) {
        res.send(item);
    })

}
app.get('/dbmovie/:movieId', function (req, res) {
    var movieId = req.params['movieId'];
    getDbMovie(movieId,res);
});


//豆瓣同城 POST
//curl -X POST http://localhost:3000/activity/23803221/update
app.post('/activity/:activityId/update', function (req, res) {
    var activityId = req.params['activityId'];
    getActivityName(activityId, Models.Activity);
    // send request to doubantongcheng api to fetch latest info of this app
    // update app info in leancloud
})
//豆瓣同城 GET
//http://localhost:3000/activity/23937886
var getDbcity = function (activityId,res) {
    DbCity.getActivityInfo(activityId).then(function (item) {
        res.send(item);
    })

}
app.get('/activity/:activityId', function (req, res) {
    var activityId = req.params['activityId'];
    getDbcity(activityId,res);
});

//app.post('/user/:userId/updateAll', function (req, res) {
//    var userId = req.params['userId'];
//    updateCompaniesByUser(userId)
//        .then(function (userCompany) {
//            res.send(userCompany);
//            console.log('updateCompaniesByUser success,%s', userCompany.id);
//        }, function (err) {
//            console.log('updateCompaniesByUser failed');
//            res.status(500).send(err);
//        })
//});





//updateItem(9733, Kr.getFounderBasic, Database.getLatestKrFounder, Models.KrFounder)
//updateItem(133592, Kr.getCompanyInfo, Database.getLatestKrCompany, Models.KrCompany)

//fetchAndStoreCompanyByUser(13644);

//updateCompanyByUser(9733);

//updateUser(9733);

app.listen();