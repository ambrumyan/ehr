'use strict';

var api = angular.module('apiModule', []);

api.provider('api', function() {
    this.options = {
        urlBase: 'https://dev.medrecord.nl/mrprd',
        limit: 100
    };
    // https://dev.medrecord.nl/mrprd/ehr/452/procedure/bloodpressure?sort=TIMESTAMP&descending=true&authToken=helloletmeinplease
    // https://dev.medrecord.nl/mrprd/ehr/452/procedure/bmi?authToken=helloletmeinplease
    var apiClient = {};

    this.setParams = function(options) {
        if (angular.isObject(options)) {
            this.options = angular.extend({}, this.options, options);
        }
    };



    this.$get = function($http) {
        var options = this.options;

        apiClient.init = function(page, url) {
            var params = { authToken: options.authToken };
            if (typeof page == 'string') {
                url = options.urlBase + page;
            } else {
                if (!page || page < 1) {
                    page = 1;
                }
                params.page = 1;
                params.limit = options.limit;
            }


            return {
                method: 'GET',
                url: url,
                params: params
            }
        }

        apiClient.getBodyMassIndex = function(page) {
            var params = apiClient.init(page, options.urlBase + '/ehr/' + options.ehrId + '/procedure/bmi');
            return $http(params);
        };

        apiClient.getBloodPressure = function(page) {
            var params = apiClient.init(page, options.urlBase + '/ehr/' + options.ehrId + '/procedure/bloodpressure');
            return $http(params);
        };


        apiClient.getAcq = function(page) {
            var params = apiClient.init(page, options.urlBase + '/ehr/' + options.ehrId + '/procedure/acq');
            return $http(params);
        };

        return apiClient;
    };
});
