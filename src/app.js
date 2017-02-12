'use strict';

var EHRApp = angular.module('EHRApp', ['apiModule', 'chartsModule', 'nvd3', 'pascalprecht.translate'])
    .config(["apiProvider", function(apiProvider) {
        apiProvider.setParams({ ehrId: 452, authToken: 'helloletmeinplease', limit: 90 });
    }])
    .config(['$translateProvider', function($translateProvider) {

        $translateProvider.translations('en_US', {
            "BMI": "Body Mass Index",
            "ACQ": "ACQ",
            "BP": "Blood Presure",
            "SYSTOLIC": "Systolic",
            "DIASTOLIC": "Diastolic",
            "NEXT": "Next",
            "RESET": "Reset",
        });
        $translateProvider.translations('nl_NL', {
            "BMI": "Queteletindex",
            "ACQ": "ACQ",
            "BP": "Bloeddruk",
            "SYSTOLIC": "Systolische",
            "DIASTOLIC": "Diastolische",
            "NEXT": "Volgende",
            "RESET": "Resetten",
        });

        $translateProvider.preferredLanguage('nl_NL');
    }])
    .controller('mainController', ["$scope", "$location", '$translate', "$timeout", "api", "charts", function($scope, $location, $translate, $timeout, api, charts) {


        var bmiChart = angular.copy(charts);
        var bpChart = angular.copy(charts);
        var acqChart = angular.copy(charts);


        $scope.setLang = function(langKey) {
            $translate.use(langKey);

            $scope.optionsBmi.title = {
                enable: true,
                text: $translate.instant('BMI')
            };

            $scope.optionsAcq.title = {
                enable: true,
                text: $translate.instant('ACQ')
            };

            $scope.optionsBp.title = {
                enable: true,
                text: $translate.instant('BP')
            };


            $scope.dataBp[0].key = $translate.instant('SYSTOLIC'); 
            $scope.dataBp[1].key = $translate.instant('DIASTOLIC');




        };

        $scope.name = $translate.instant('BMI');


        $scope.loadBmi = function(page) {
            var promise = api.getBodyMassIndex(page);
            promise.then(function successCallback(response) {
                var data1 = [];
                for (var index in response.data.measurement) {
                    var item = response.data.measurement[index];

                    data1.push({ x: item.time, y: item.bmi });

                }
                $scope.dataBmi = [{
                    values: data1,
                    key: 'bmi',
                    color: '#f4e242'
                }, ];


                $scope.bmiLinks = response.data.links;

            }, function errorCallback(response) {});

            bmiChart.setTitle($scope.name);
            bmiChart.setYAxisFormater('.02f');
            $scope.optionsBmi = bmiChart.options;

        }



        $scope.loadAcq = function(page) {
            var promise = api.getAcq(page);
            promise.then(function successCallback(response) {
                var data1 = [];
                for (var index in response.data.measurement) {
                    var item = response.data.measurement[index];

                    data1.push({ x: item.time, y: item.acqScore });

                }
                $scope.dataAcq = [{
                    values: data1,
                    key: 'acq',
                    color: '#f4e242'
                }, ];

                $scope.acqLinks = response.data.links;

            }, function errorCallback(response) {});

            acqChart.setTitle($translate.instant('ACQ'));
            acqChart.setYAxisFormater('.02f');
            $scope.optionsAcq = acqChart.options;

        }

        $scope.loadBloodPressure = function(page) {
            var promise = api.getBloodPressure(page);
            promise.then(function successCallback(response) {
                var data1 = [],
                    data2 = [];
                for (var index in response.data.measurement) {
                    var item = response.data.measurement[index];

                    data1.push({ x: item.time, y: item.diastolic });
                    data2.push({ x: item.time, y: item.systolic });

                }
                $scope.dataBp = [{
                        values: data2,
                        key: $translate.instant('SYSTOLIC'),
                        color: '#f4e242'
                    }, {
                        values: data1,
                        key: $translate.instant('DIASTOLIC'),
                        color: '#ff7f0e'
                    }

                ];

                var max = d3.max(data2, function(x) {
                    return x.y;
                });

                bpChart.setDomain(0, max + 10);


                $scope.bpLinks = response.data.links;


            }, function errorCallback(response) {});

            // bpChart.setTitle('Blood Presure');
            bpChart.setTitle($translate.instant('BP'));
            bpChart.setYAxisFormater('.0f');
            $scope.optionsBp = bpChart.options;

        }

        $scope.loadBmi();
        $scope.loadBloodPressure();
        $scope.loadAcq();
    }])
