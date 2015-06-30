(function (angular) {
  "use strict";

  var app = angular.module("codeforamerica.pmarbach.exercise", []);

  app.service("DataService", ["$http", "$q", "$window", function MainCtrl ($http, $q, $window) {
    return {
      fetch: function () {
        var d = $q.defer();

        $http.get("data.txt")
          .success(function (data) {
            var result = [],
                lineArr = data.split("\n"),
                keys = lineArr.shift().split("\t");

            angular.forEach(lineArr, function (line) {
              var valArr = line.split("\t"),
                  obj = {};

              angular.forEach(valArr, function (val, idx) {
                var key = keys[idx];
                obj[key] = val;
              });

              result.push(obj);
            });

            d.resolve(result);
          })
          .error(function () {
            $window.alert("failed to load");
            d.reject();
          });

        return d.promise;
      }
    };
  }]);

  app.controller("MainCtrl", ["$scope", "DataService", function MainCtrl ($scope, DataService) {
    $scope.hello = "world";

    DataService.fetch().then(function (result) {
      $scope.data = result;
    });
  }]);
}(window.angular));
