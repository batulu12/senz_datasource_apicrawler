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
            url: options.pathname
        }).then(function (response) {
            var result = undefined;
            try {
                var result = {}
                //var $ = cheerio.load(response.text);
                //result.name = $("span[property='v:itemreviewed']").text().trim();
                //result.summary = $("span[property='v:summary']").text().trim();
                //result.category = $("span[property='v:genre']").text().trim();
              //  console.log($("span[property='v:itemreviewed']").text());
                temp = JSON.parse(response.text);
                result.average = temp.rating.average;
                result.summary = temp.summary;
                result.name = temp.title;
                result.category = '';
                temp.genres.forEach(function(category){
                    result.category = result.category +'/'+category;
                });
                console.log(result.category);
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

    var getMovieInfo = function (moiveId) {
        return sendHttpRequest({
            method: 'GET',
            pathname: 'https://api.douban.com/v2/movie/subject/' + moiveId
        })
    }


    return {
        getMovieInfo: getMovieInfo
    }
}
