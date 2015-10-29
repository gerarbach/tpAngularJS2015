'use strict';

/**
 * @ngdoc directive
 * @name tpApp.directive:calc
 * @description
 * # calc
 */
angular.module('tpApp')
    .directive('calc', function(){
        return {
            restrict: 'AE',
            scope: {},
            templateUrl: 'views/calc-partial.html',
            link: function postLink($scope, element, attrs) {
                var num = '';

                $scope.tecla = function(t){
                    switch(t){
                        case '=':
                            num = eval(num);
                            break;
                        case 'C':
                            num = '';
                            break;
                        default:
                            num+=t;
                    }
                    $scope.resultado = num;
                }
            }
        };
    });