/*global angular*/

(function () {
    "use strict";

    angular
        .module("app.landing", [])
        .controller("LandingController", LandingController);

    function LandingController($http, $scope, AuthService) {
        $scope.submit = submit;

        function submit(username, password) {
            AuthService.login({username: username, password: password});
        }
    }

}());
