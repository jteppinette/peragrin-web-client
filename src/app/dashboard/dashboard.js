/*global angular*/

(function () {
    "use strict";

    function DashboardController($http, $scope) {
        $scope.users = [];
        $scope.getUsers = function () {
            $http.get("/users/")
                .then(function (data) {
                    $scope.users = data.data;
                });
        };

        $scope.getUsers();
    }

    angular.module("app.dashboard", [])
        .controller("DashboardController", DashboardController);

}());
