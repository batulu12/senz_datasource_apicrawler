/**
 * Created by fengxiaoping on 4/13/15.
 */

var Url = require('url');
var _ = require('underscore');
cheerio = require('cheerio');

module.exports = function () {
    var sendHttpRequest = function (options) {
        var promise = new AV.Promise();
        AV.Cloud.httpRequest({
            method: options.method,
            url:options.pathname
        }).then(function (response) {
            var result = undefined;
            try {
                var result = {}
                temp = JSON.parse(response.text);
                result.time = temp.begin_time;
                result.location = temp.address;
                result.title = temp.title;
                promise.resolve(result);
            } catch (e) {
                promise.reject({code: 500, msg: 'result parse failed'});
            }

        }, function(error) {
           console.log(error);
        });
        return promise;
    }

    var getActivityInfo = function (activityId) {
        return sendHttpRequest({
            method: 'GET',
            pathname: 'https://api.douban.com/v2/event/' + activityId
        })
    }


    return {
        getActivityInfo: getActivityInfo
    }
}
