/*global angular*/

(function () {
    "use strict";

    angular
        .module("app.dashboard", [])
        .controller("DashboardController", DashboardController);

    function DashboardController($http, $scope, AuthService) {
        $scope.logout = AuthService.logout;

        $scope.users = [];

        function initialize() {
            $http.get("/users")
                .then(function (data) {
                    $scope.users = data.data;
                });

            $scope.$on("$stateChangeSuccess", function () {
                $scope.collapsed = true;
            });
        };

        initialize();
    }

}());
