/*global angular*/

(function () {
    "use strict";

    angular
        .module("app.landing.login", [])
        .controller("LoginController", LoginController);

    function LoginController($http, $scope, AuthService) {
        $scope.submit = submit;

        function submit(email, password) {
            AuthService.login({email: email, password: password});
        }
    }

}());
