/*global angular*/

(function () {
    "use strict";

    angular
        .module("app.dashboard", [])
        .controller("DashboardController", DashboardController);

    function DashboardController($http, $scope, AuthService) {
        $scope.logout = AuthService.logout;

        $scope.organization = {};
        $scope.organizations = [];

        function initialize() {
            $http.get(`/organizations/${sessionStorage.organizationID}`)
                .then(function(http) {
                    $scope.organization = http.data;

                    $http.get(`/communities/${$scope.organization.communityID}/organizations`)
                        .then(function(http) {
                            $scope.organizations = http.data;
                        });
                });

            $scope.$on("$stateChangeSuccess", function () {
                $scope.collapsed = true;
            });
        };

        initialize();
    }

}());
