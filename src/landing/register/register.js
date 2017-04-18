/*global angular*/

(function () {
    "use strict";

    angular
        .module("app.landing.register", [])
        .controller("RegisterController", RegisterController);

    function RegisterController($http, $scope, AuthService) {
        $scope.submit = submit;

        function submit(username, password) {
            AuthService.register({username: username, password: password});
        }
    }

}());
