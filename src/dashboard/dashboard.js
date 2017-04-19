/*global angular*/

(function () {
    "use strict";

    angular
        .module("app.dashboard", [])
        .controller("DashboardController", DashboardController);

    function DashboardController($http, $scope, AuthService) {
        $scope.logout = AuthService.logout;

        $scope.users = [];
        $scope.organization = {};

        function initialize() {
            $http.get("/users")
                .then(function(http) {
                    $scope.users = http.data;
                });

            $http.get(`/organizations/${sessionStorage.organizationID}`)
                .then(function(http) {
                    $scope.organization = http.data;
                });

            $scope.$on("$stateChangeSuccess", function () {
                $scope.collapsed = true;
            });
        };

        initialize();
    }

}());
