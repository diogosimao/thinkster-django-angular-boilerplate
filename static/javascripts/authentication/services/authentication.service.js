(function () {
    'use strict';

    angular
        .module('thinkster.authentication.services')
        .factory('Authentication', Authentication);

    Authentication.$inject = ['$cookies', '$http'];

    function Authentication($cookies, $http) {
        var Authentication = {
            unauthenticate: unauthenticate,
            setAuthenticatedAccount: setAuthenticatedAccount,
            isAuthenticated: isAuthenticated,
            getAuthenticatedAccount: getAuthenticatedAccount,
            login: login,
            register: register
        };
        return Authentication;

        function register(email, password, username) {
            return $http.post('/api/v1/accounts/', {
                username: username,
                password: password,
                email: email
            });
        }

        function login(email, password) {
            return $http.post('/api/v1/auth/login', {
                email: email, password: password
            }).then(loginSuccessFn, loginErrorFn);
            
            function loginSuccessFn(data, status, headers, config){
                Authentication.setAuthenticatedAccount(data.data);
                
                window.location = '/';
            }
            
            function loginErrorFn(data, status, hearders, config){
                console.error('Falha épica!');
            }
        }

        function getAuthenticatedAccount() {
            if (!$cookies.authenticatedAccount){
                return;
            }

            return JSON.parse($cookies.authenticatedAccount);
        }

        function isAuthenticated(){
            return !!$cookies.authenticatedAccount;
        }

        function setAuthenticatedAccount(account){
            $cookies.authenticatedAccount = JSON.stringfy(account);
        }

        function unauthenticate(){
            delete $cookies.authenticatedAccount;
        }
    }
})();
