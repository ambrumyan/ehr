'use strict';

var charts = angular.module('chartsModule', []);

charts.provider('charts', function() {
    var tickMultiFormat = d3.time.format.multi([
        ["%b %-d %Y, %-I:%M%p ", function(d) {
            return d.getMinutes();
        }], 
        ["%-I%p", function(d) {
            return d.getHours();
        }], 
        ["%b %-d", function(d) {
            return d.getDate() != 1;
        }], 
        ["%b %-d", function(d) {
            return d.getMonth();
        }],
        ["%Y", function() {
            return true;
        }]
    ]);

    this.options = {
        chart: {
            type: 'lineChart',
            height: 450,
            margin: {
                top: 20,
                right: 20,
                bottom: 40,
                left: 55
            },
            x: function(d) {
                if (typeof d.x == 'string') {
                    return Date.parse(d.x);
                }
                return d.x;
            },
            y: function(d) {
                return d.y;
            },
            isArea: true,
            useInteractiveGuideline: true,

            xScale: d3.time.scale(),
            xAxis: {
                tickPadding: 10,
                tickFormat: function(d) {
                    return tickMultiFormat(new Date(d));
                },
                axisLabelDistance: -100,
                showMaxMin: false
            },
            yAxis: {
                tickFormat: function(d) {
                    return d3.format('.02f')(d);
                },
                axisLabelDistance: -10
            }
        },
        title: {
            enable: true
        },
    };

    this.setTitle = function(text) {
        this.options.title.text = text;
    }

    this.setDomain = function(min, max) {
        
        this.options.chart.yDomain = [min,max];
    }


    this.setYAxisFormater = function(text) {
        this.options.chart.yAxis.tickFormat = function(d) {
            return d3.format(text)(d);
        };
    }

    this.$get = function($http) {
        return this;
    };
});
