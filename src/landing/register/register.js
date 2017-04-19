/*global angular*/

(function () {
    "use strict";

    angular
        .module("app.landing.register", [])
        .controller("RegisterController", RegisterController);

    function RegisterController($http, $scope, AuthService) {
        $scope.submit = submit;

        $scope.communities = [];
        $scope.organization = {};

        
        function initialize() {
            $http.get("/communities")
                .then(function(http) {
                    $scope.communities = http.data;
                });
        }

        initialize();

        function submit() {
            var data = {
                username: $scope.username,
                password: $scope.password,
                organization: {
                    communityID: $scope.community.id,
                    address: $scope.organization.address,
                    name: $scope.organization.name
                }
            };
            AuthService.register(data);
        }
    }

}());
