(function (angular) {
  "use strict";

  var app = angular.module("codeforamerica.pmarbach.exercise", []);

  app.service("DataService", ["$http", "$q", "$window", function MainCtrl ($http, $q, $window) {
    return {
      fetch: function () {
        var d = $q.defer(),
            service = this;

        $http.get("data.txt")
          .success(function (data) {
            var result = [],
                lineArr = data.split("\n").filter(function (line) {
                  return line.length > 0;
                }),
                keys = lineArr.shift().split("\t").map(function (key) {
                  return key.trim();
                });

            angular.forEach(lineArr, function (line) {
              var valArr = line.split("\t"),
                  obj = {};

              angular.forEach(valArr, function (val, idx) {
                var key = keys[idx].toString();
                obj[key] = val;
              });

              service.attachProjections(obj);

              result.push(obj);
            });

            d.resolve(result);
          })
          .error(function () {
            $window.alert("failed to load");
            d.reject();
          });

        return d.promise;
      },

      attachProjections: function (obj) {
        // per this page, the density is in square meters: https://www.census.gov/geo/maps-data/data/gazetteer2010.html
        var landAreaSqKm = obj["Land Area"] / 1000000;

        if (obj["Population"] > 0) {
          obj["Population Density"] = +(obj["Population"] / landAreaSqKm).toFixed(2);
        }

        if (obj["Housing Units"] > 0) {
          obj["Housing Density"] = +(obj["Housing Units"] / landAreaSqKm).toFixed(2);
        }
      },

      getMinForAttr: function (data, attr) {
        var least = null,
            result;

        angular.forEach(data, function (obj) {
          if (!least) {
            least = obj[attr];
          }

          least = Math.min(least, obj[attr]) || least;

          if (least === obj[attr]) {
            result = obj;
          }
        });

        return result;
      },

      getMaxForAttr: function (data, attr) {
        var most = null,
            result;

        angular.forEach(data, function (obj) {
          if (!most) {
            most = obj[attr];
          }

          most = Math.max(most, obj[attr]) || most;

          if (most === obj[attr]) {
            result = obj;
          }
        });

        return result;
      },

      getAverageForAttr: function (data, attr) {
        var used = 0;

        return +(data.reduce(function (memo, obj) {
          if (typeof obj[attr] === 'number') {
            memo += obj[attr];
            used++;
          }

          return memo;
        }, 0) / used).toFixed(2);
      }
    };
  }]);

  app.controller("MainCtrl", ["$scope", "DataService", function MainCtrl ($scope, DataService) {
    // dummy functions until data is parsed
    $scope.getMin = function () {};
    $scope.getMax = function () {};
    $scope.getAvg = function () {};

    DataService.fetch().then(function (result) {
      $scope.data = result;
      $scope.getMax = DataService.getMaxForAttr.bind(DataService, $scope.data);
      $scope.getMin = DataService.getMinForAttr.bind(DataService, $scope.data);
      $scope.getAvg = DataService.getAverageForAttr.bind(DataService, $scope.data);
    });
  }]);
}(window.angular));
