/*global angular*/

(function () {
    "use strict";

    function DashboardController($http, $scope) {
        $scope.leaders = [];
        $scope.organizations = [];
        $scope.communities = [];

        function initialize() {
            $http.get("/leaders/")
                .then(function (data) {
                    $scope.leaders = data.data;
                });
            $http.get("/organizations/")
                .then(function (data) {
                    $scope.organizations = data.data;
                });
            $http.get("/communities/")
                .then(function (data) {
                    $scope.communities = data.data;
                });
        };

        initialize();
    }

    angular.module("app.dashboard", [])
        .controller("DashboardController", DashboardController);

}());
