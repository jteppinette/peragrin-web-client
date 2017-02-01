/*global describe, it, beforeEach, module, expect, spyOn, inject, afterEach*/

describe("utils.auth", function () {
    "use strict";
    var $httpBackend, $rootScope, currentUserResponse, currentUserStatusCode;

    beforeEach(module("peragrin"));

    beforeEach(inject(function ($injector) {
        $rootScope = $injector.get("$rootScope").$new();
        $httpBackend = $injector.get("$httpBackend");

        $httpBackend.when("POST", "/login/", {username: "vagrant", password: "vagrant"})
            .respond({username: "vagrant"});
        $httpBackend.when("POST", "/login/", {username: "invalid", password: "invalid"})
            .respond(404, {"status_code": 404, "detail": "Provided credentials did not authenticate. Please try again."});
        $httpBackend.when("GET", "/logout/")
            .respond({});
        $httpBackend.when("GET", "/users/current/")
            .respond(function () {
                return [currentUserStatusCode, currentUserResponse, {}];
            });
    }));

    afterEach(function () {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    describe("Auth", function () {
        var Auth;

        beforeEach(inject(function ($injector) {
            Auth = $injector.get("Auth");
        }));

        describe("authenticate", function () {

            it("should assign and return the auth object after successfully logging in", function () {
                $httpBackend.expectPOST("/login/", {username: "vagrant", password: "vagrant"});
                spyOn(Auth, "assignAuth").and.callThrough();
                Auth.authenticate({username: "vagrant", password: "vagrant"})
                    .then(function (auth) {
                        expect(Auth.assignAuth).toHaveBeenCalledWith({user: {username: "vagrant"}, status: true});
                        expect(auth.user.username).toBe("vagrant");
                        expect(auth.status).toBe(true);
                    });
                $httpBackend.flush();
            });

        });

        describe("login", function () {
            var $modal;

            beforeEach(inject(function ($injector) {
                $modal = $injector.get("$modal");
            }));

            it("should open a modal when called", function () {
                spyOn($modal, "open").and.callThrough();
                Auth.login();
                expect($modal.open).toHaveBeenCalledWith({templateUrl: "utils/auth/login.html", controller: "LoginController"});
                $httpBackend.flush();
            });

        });

        describe("logout", function () {

            it("should assign and return an undefined and false auth object", function () {
                $httpBackend.expectGET("/logout/");
                spyOn(Auth, "assignAuth").and.callThrough();
                Auth.logout()
                    .then(function (auth) {
                        expect(Auth.assignAuth).toHaveBeenCalledWith({user: undefined, status: false});
                        expect(auth.user).toBe(undefined);
                        expect(auth.status).toBe(false);
                    });
                $httpBackend.flush();
            });

        });

        describe("getAuth", function () {

            it("should assign and return the auth object on successfully getting the current user", function () {
                currentUserResponse = {username: "vagrant"};
                currentUserStatusCode = 200;
                $httpBackend.expectGET("/users/current/");
                spyOn(Auth, "assignAuth").and.callThrough();
                Auth.getAuth()
                    .then(function (auth) {
                        expect(Auth.assignAuth).toHaveBeenCalledWith({user: {username: "vagrant"}, status: true});
                        expect(auth.user.username).toBe("vagrant");
                        expect(auth.status).toBe(true);
                    });
                $httpBackend.flush();
            });

            it("should assign and resolve the auth object with status false after a non required failed current user request", function () {
                currentUserResponse = {};
                currentUserStatusCode = 401;
                $httpBackend.expectGET("/users/current/");
                spyOn(Auth, "assignAuth").and.callThrough();
                Auth.getAuth({required: false})
                    .then(function (auth) {
                        expect(Auth.assignAuth).toHaveBeenCalledWith({status: false});
                        expect(auth.status).toBe(false);
                    });
                $httpBackend.flush();
            });

            it("should assign and reject the auth object with status false after a required failed current user request", function () {
                currentUserResponse = {};
                currentUserStatusCode = 403; // Not a 401, because then http-interceptor-auth would catch it
                $httpBackend.expectGET("/users/current/");
                spyOn(Auth, "assignAuth").and.callThrough();
                Auth.getAuth({required: true})
                    .catch(function (auth) {
                        expect(Auth.assignAuth).toHaveBeenCalledWith({status: false});
                        expect(auth.status).toBe(false);
                    });
                $httpBackend.flush();
            });

        });

    });

    describe("LoginController", function () {
        var $scope, $modalInstance;

        beforeEach(inject(function ($controller) {
            $scope = $rootScope.$new();
            $modalInstance = {
                close: function () {
                    return undefined;
                }
            };
            $controller("LoginController", {$scope: $scope, $modalInstance: $modalInstance});
        }));

        describe("submit", function () {

            it("should set $scope.message and $scope.detail on failure", function () {
                $httpBackend.expectPOST("/login/", {username: "invalid", password: "invalid"});
                $scope.submit("invalid", "invalid")
                    .then(function () {
                        expect($scope.message).toBe("Provided credentials did not authenticate. Please try again.");
                        expect($scope.status).toBe("has-error");
                    });
                $httpBackend.flush();
            });

            it("should close $modalInstance with auth object on success", function () {
                $httpBackend.expectPOST("/login/", {username: "vagrant", password: "vagrant"});
                spyOn($modalInstance, "close").and.callThrough();
                $scope.submit("vagrant", "vagrant")
                    .then(function () {
                        expect($modalInstance.close).toHaveBeenCalledWith({user: {username: "vagrant"}, status: true});
                    });
                $httpBackend.flush();
            });

        });

    });

});
