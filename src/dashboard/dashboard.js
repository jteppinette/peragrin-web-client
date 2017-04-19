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
    }

    function OrganizationsCreateController($scope, $uibModalInstance, $http, communityID) {
        $scope.submit = submit;
        $scope.cancel = $uibModalInstance.dismiss;

        console.log(communityID);

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
