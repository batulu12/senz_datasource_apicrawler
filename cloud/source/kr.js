/**
 * Created by fengxiaoping on 4/13/15.
 */

var Url = require('url');

module.exports = function () {
    var sendHttpRequest = function (options) {
        var promise = new AV.Promise();
        AV.Cloud.httpRequest({
            method: options.method,
            url: Url.format({
                protocol: "http",
                hostname: "rong.36kr.com",
                pathname: options.pathname
            })
        }).then(function (response) {
            var result = undefined;
            try {
                result = JSON.parse(response.text);
            } catch (e) {
                promise.reject({code: 500, msg: 'result parse failed'});
            }

            if (result.code === 0) {
                promise.resolve(result.data);
            } else {
                promise.reject(_.pick(result, 'code', 'msg'));
            }
        })
        return promise;
    }

    var getFounderBasic = function (founderId) {
        return sendHttpRequest({
            method: 'GET',
            pathname: '/api/user/' + founderId + '/basic'
        })
    }

    var getFounderCompany = function (founderId) {
        return sendHttpRequest({
            method: 'GET',
            pathname: '/api/user/' + founderId + '/company'
        })
    }

    var getCompanyInfo = function (companyId) {
        return sendHttpRequest({
            method: 'GET',
            pathname: '/api/company/' + companyId
        })
    }

    return {
        getFounderBasic: getFounderBasic,
        getCompanyInfo: getCompanyInfo,
        getFounderCompany: getFounderCompany
    }
}
