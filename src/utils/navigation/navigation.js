/*global angular*/

(function () {
    "use strict";

    function NavigationController($scope, Auth, $state) {
        $scope.$on("$stateChangeSuccess", function () {
            $scope.collapsed = true;
        });
        $scope.login = function () {
            return Auth.login()
                .then(function () {
                    $state.go("app.dashboard");
                })
                .catch(function () {
                    $state.go("landing");
                });
        };
        $scope.logout = function () {
            return Auth.logout()
                .then(function () {
                    $state.go("landing");
                });
        };
    }

    angular
        .module("utils.navigation", ["ui.bootstrap", "utils.auth"])
        .controller("NavigationController", NavigationController);

}());
