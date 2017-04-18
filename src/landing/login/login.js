/*global angular*/

(function () {
    "use strict";

    angular
        .module("app.landing.login", [])
        .controller("LoginController", LoginController);

    function LoginController($http, $scope, AuthService) {
        $scope.submit = submit;

        function submit(username, password) {
            AuthService.login({username: username, password: password});
        }
    }

}());
