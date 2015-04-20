/**
 * Created by fengxiaoping on 4/13/15.
 */

var Models = require('cloud/model')

module.exports = function () {
    var queryItemByField = function (QueryClass, fieldName, id) {
        var query = new AV.Query(QueryClass);
        query.equalTo(fieldName, id);
        return query;
    }

    var getLatestKrFounder = function (founderId) {
        var query = queryItemByField(Models.KrFounder, 'itemId', founderId);
        query.descending('createdAt');
        return query.first();
    }

    var getAllKrFounder = function (founderId) {
        var query = new AV.Query(KrFounder);
        query.equalTo('userId', founderId);
        return query.find();
    }

    var getLatestKrCompany = function (companyId) {
        var query = queryItemByField(Models.KrCompany, 'itemId', companyId);
        query.descending('createdAt');
        return query.first();
    }

    var getLatestActivity= function (activityId) {
        var query = queryItemByField(Models.Activity, 'activityId', activityId);
        query.descending('createdAt');
        return query.first();
    }

    var getLatestApp= function (appId) {
        var query = queryItemByField(Models.WdjApp, 'appId', appId);
        query.descending('createdAt');
        return query.first();
    }

    var getLatestAppleApp= function (appId) {
        var query = queryItemByField(Models.AppStore, 'trackId', appId);
        query.descending('createdAt');
        return query.first();
    }

    var getLatestMovie= function (movieId) {
        var query = queryItemByField(Models.DbMovie, 'movieId', movieId);
        query.descending('createdAt');
        return query.first();
    }

    var getLatestDzdp=function(itemId){
        var query = queryItemByField(Models.DzdpInfo, 'itemId', itemId);
        query.descending('createdAt');
        return query.first();
    }

    var getLatestKrUserCompany = function (userId) {
        var query = queryItemByField(Models.KrUserCompany, 'user', new Models.KrFounder({id: userId}));
        query.descending('createdAt');
        return query.first();
    }

    return {
        getLatestKrFounder: getLatestKrFounder,
        getLatestActivity:getLatestActivity,
        getLatestApp:getLatestApp,
        getLatestAppleApp:getLatestAppleApp,
        getLatestDzdp:getLatestDzdp,
        getLatestMovie:getLatestMovie,
        getLatestKrCompany: getLatestKrCompany,
        getLatestKrUserCompany: getLatestKrUserCompany
    }

}