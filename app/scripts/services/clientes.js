'use strict';

/**
 * @ngdoc service
 * @name angularDashboardApp.Proveedores
 * @description
 * # Proveedores
 * Factory in the angularDashboardApp.
 */
angular.module('tpApp')
  .factory('Clientes', function ($http, $rootScope) {
    // Service logic
    // ...
    var req = function(method, path, data){
        return $http({
            method: method,
            url: 'http://localhost:9001/clientes/'+path,
            data: data
        });
    }

    // Public API here
    return {
        traer: function(){
            return req('GET', '', '');
        },
        crear: function(datos){
            return req('POST', '', datos);
        },
        borrar: function(id){
            return req('DELETE', id, '');
        },
        editar: function(id, datos){
            return req('PUT', id, datos);
        }
    };
  });