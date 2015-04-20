/**
 * Created by fengxiaoping on 4/13/15.
 */

var Url = require('url');
var _ = require('underscore');
cheerio = require('cheerio');

module.exports = function () {
    var sendHttpRequest = function (options) {
        console.log(options.pathname);
        var promise = new AV.Promise();
        AV.Cloud.httpRequest({
            method: options.method,
            url: options.pathname
        }).then(function (response) {
            var result = undefined;
            try {
                var result = {}
                result = JSON.parse(response.text);
                console.log(result["results"][0]["trackName"]);
                promise.resolve(result["results"][0]);
            } catch (e) {
                promise.reject({code: 500, msg: 'result parse failed'});
            }


        }, function(error) {
            //对象保存失败，处理 error
            console.log('error');
            console.log(error);
        });
        return promise;
    }

    var getAppStoreInfo = function (appId) {
        return sendHttpRequest({
            method: 'GET',
            pathname: 'https://itunes.apple.com/lookup?id=' + appId
        })
    }


    return {
        getAppStoreInfo: getAppStoreInfo
    }
}
