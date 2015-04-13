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

    var getLatestKrUserCompany = function (userId) {
        var query = queryItemByField(Models.KrUserCompany, 'user', new Models.KrFounder({id: userId}));
        query.descending('createdAt');
        return query.first();
    }

    return {
        getLatestKrFounder: getLatestKrFounder,
        getLatestKrCompany: getLatestKrCompany,
        getLatestKrUserCompany: getLatestKrUserCompany
    }

}