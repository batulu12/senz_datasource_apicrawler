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
                var $ = cheerio.load(response.text);
                result.name = $('span[class=last]').text();
                result.category = $('div[class=second] a span').text();
                //console.log(response.text);
                console.log($('div[class=second] a span').text());
                console.log($('span[class=last]').text())

                promise.resolve(result);
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

    var getAppInfo = function (appId) {
        return sendHttpRequest({
            method: 'GET',
            pathname: 'http://www.wandoujia.com/apps/' + appId
        })
    }


    return {
        getAppInfo: getAppInfo
    }
}
