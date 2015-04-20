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
                result.title = $('h1[class=title]').text().trim()
                result.rate = $('span[class=star-rate]').text().trim()
                //result.location = $('price').text().trim()
                console.log(result.title);
                promise.resolve(result);
            } catch (e) {
                promise.reject({code: 500, msg: 'result parse failed'});
            }


        }, function(error) {
            //对象保存失败，处理 error
            console.log(error);
        });
        return promise;
    }

    var getDzdpInfo = function (appId) {
        return sendHttpRequest({
            method: 'GET',
            pathname: 'http://t.dianping.com/deal/' + appId
        })
    }


    return {
        getDzdpInfo: getDzdpInfo
    }
}
