/*global angular*/

(function () {
    "use strict";

    angular
        .module("app.dashboard", [])
        .controller("DashboardController", DashboardController)
        .controller("OrganizationsCreateController", OrganizationsCreateController);

    function DashboardController($http, $scope, $uibModal, AuthService) {
        $scope.logout = AuthService.logout;
        $scope.createOrganization = createOrganization;
        $scope.enableOrganization = enableOrganization;

        $scope.organization = {};
        $scope.organizations = [];
        $scope.posts = [];
        $scope.geo = {};
        $scope.markers = {};
        $scope.tiles = {
            url: "https://api.mapbox.com/v4/mapbox.streets/{z}/{x}/{y}.png?access_token={apiKey}",
            options: {
                apiKey: sessionStorage.mapboxAPIKey
            }
        };
        $scope.defaults = {
            scrollWheelZoom: false
        };
        $scope.email = sessionStorage.email;

        function initialize() {
            $http.get(`/organizations/${sessionStorage.organizationID}`)
                .then(function(http) {
                    $scope.organization = http.data;
                    $scope.geo = {
                        lng: $scope.organization.longitude,
                        lat: $scope.organization.latitude,
                        zoom: 15
                    };
                    $scope.markers = {
                        organization: {
                            lng: $scope.organization.longitude,
                            lat: $scope.organization.latitude,
                            message: $scope.organization.name
                        }
                    };

                    $http.get(`/communities/${$scope.organization.communityID}/organizations`)
                        .then(function(http) {
                            $scope.organizations = http.data;
                        });
                    $http.get(`/communities/${$scope.organization.communityID}/posts`)
                        .then(function(http) {
                            $scope.posts = http.data;
                        });
                });

            $scope.$on("$stateChangeSuccess", function () {
                $scope.collapsed = true;
            });
        };

        initialize();

        function createOrganization() {
            var instance = $uibModal.open({
                templateUrl: "dashboard/organizations/create.html",
                controller: "OrganizationsCreateController",
                resolve: {
                    communityID: function() {
                        return $scope.organization.communityID;
                    }
                }
            });
            return instance.result
                .then(initialize);
        }

        function enableOrganization(organization) {
            $http.post(`/organizations/${organization.id}/enable`)
                .then(initialize);
        }
    }

    function OrganizationsCreateController($scope, $uibModalInstance, $http, communityID) {
        $scope.submit = submit;
        $scope.cancel = $uibModalInstance.dismiss;

        $scope.organization = {};

        function submit() {
            var data = {
                email: $scope.email,
                password: $scope.password,
                organization: {
                    communityID: communityID,
                    address: $scope.organization.address,
                    name: $scope.organization.name
                }
            };
            return $http.post("/register", data)
                .then($uibModalInstance.close)
                .catch($uibModalInstance.dismiss);
        }
    }

}());
