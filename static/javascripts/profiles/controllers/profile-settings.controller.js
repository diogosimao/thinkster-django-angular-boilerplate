(function () {
    'use strict';
    
    angular
        .module('thinkster.profiles.controllers')
        .controller('ProfileSettingsController', ProfileSettingsController);
    
    ProfileSettingsController.$inject = [
        '$location', '$routeParams', 'Authentication', 'Profile', 'Snackbar'
    ];
    
    function ProfileSettingsController($location, $routeParams, Authentication, Profile, Snackbar) {
        var vm = this;
        
        vm.destroy = destroy;
        vm.update = update;
        
        activate();
        
        function activate() {
            var authenticatedAccount = Authentication.getAuthenticatedAccount();
            var username = $routeParams.username.substr(1);
            
            if (!authenticatedAccount) {
                $location.url('/');
                Snackbar.error('Você não esta autorizado a visualizar esta página.');
            } else {
                if (authenticatedAccount.username !== username){
                    $location.url('/');
                    Snackbar.error('Você não esta autorizado a visualizar esta página.');
                }
            }
            
            Profile.get(username).then(profileSuccessFn, profileErrorFn);
            
            function profileSuccessFn(data, status, headers, config) {
                vm.profile = data.data;
            }
            
            function profileErrorFn(data, status, headers, config) {
                $location.url('/');
                Snackbar.error('Esta usuário não existe.');
            }
        }
        
        function destroy() {
            Profile.destroy(vm.profile.username).then(profileSuccessFn, profileErrorFn);
            
            function profileSuccessFn(data, status, headers, config) {
                Authentication.unauthenticate();
                window.location = '/';
                
                Snackbar.show('Sua conta foi deletada.');
            }
            
            function profileErrorFn(data, status, headers, config) {
                Snackbar.error(data.error);
            }
        }
        
        function update() {
            Profile.update(vm.profile).then(profileSuccessFn, profileErrorFn);
            
            function profileSuccessFn(data, status, headers, config) {
                Snackbar.show('Sua conta foi atualizada.');
            }
            
            function profileErrorFn(data, status, headers, config) {
                Snackbar.error(data.error);
            }
        }
    }
})();