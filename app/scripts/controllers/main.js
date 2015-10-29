'use strict';

/**
 * @ngdoc function
 * @name tpApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the tpApp
 */
angular.module('tpApp', ['ui.grid', 'ui.grid.selection', 'ui.grid.resizeColumns', 'ds.clock', 'cfp.hotkeys', 'toastr'])
.controller('MainCtrl', function ($scope, Clientes, hotkeys, toastr, $window) {
     
    $scope.form = {};
    $scope.cli = {};
    $scope.fecha = new Date();
    
    /*Se arma la grilla*/
    $scope.grilla = {
        columnDefs:[
            {field: "nombre"},
            {field: "apellido"},
            {field: "email"},
            {field: "telefono"},
            {field: "direccion"},
            { name: 'Acción', width: 135,
             cellTemplate:'<button class="btn btn-info btn-xs line_button" ng-click="grid.appScope.editarRow(row)" data-toggle="modal" data-target="#modalEditar">Editar</button> | <button class="btn btn-info btn-xs" ng-click="grid.appScope.borrarRow(row)">Borrar</button>' }
        ],
        enableFiltering: true,
        displaySelectionCheckbox: true,
        enableRowSelection: true,
        onRegisterApi: function(gridApi) { //register grid data first within the gridOptions
          $scope.gridApi = gridApi;
          gridApi.selection.on.rowSelectionChanged($scope, function(row) {
            if($scope.gridApi.selection.getSelectedRows().length > 0){
                $("#btnBorrar").removeAttr("disabled");
            }else{
                $("#btnBorrar").attr("disabled", true);
            }
          });
        }
    };
    
    /*Se guarda el nuevo cliente*/
    $scope.nuevoCliente = function(){
        Clientes.crear($scope.cli).then(function(){
            $scope.listarClientes("todos");
            $scope.obtenerLetras();
            $('#modalNuevo').modal('hide');
            $scope.form.nuevocli.$setPristine();
            $scope.form.nuevocli.$setUntouched();
            $scope.cli = {};
            toastr.success('Cliente creado con éxito');
        });
    };
    
    /*Se borran los clientes seleccionados en los checkbox*/
    $scope.borrarSeleccionados = function() {
        if ($window.confirm("Está seguro que desea borrar los clientes seleccionados?")) {
            var seleccionados = $scope.gridApi.selection.getSelectedRows();

            for(var key in seleccionados){
                Clientes.borrar(seleccionados[key].id).then(function(){
                    $scope.listarClientes("todos");
                    $scope.obtenerLetras();

                });
            }
            toastr.success('Los clientes seleccionados fueron borrados con éxito');
        }
    };
    
    /*Se borra el cliente desde el botón Borrar*/
    $scope.borrarRow = function(row) {
        if ($window.confirm("Está seguro que desea borrar el cliente?")) {
            Clientes.borrar(row.entity.id).then(function(){
                $scope.listarClientes("todos");
                $scope.obtenerLetras();
                toastr.success('Cliente borrado con éxito');
            });
        }
    };
    
    /*Se completa el formulario de edición*/
    $scope.editarRow = function(row) {
        $scope.editId = row.entity.id;
        $scope.editNombre = row.entity.nombre;
        $scope.editApellido = row.entity.apellido;
        $scope.editEmail = row.entity.email;
        $scope.editTelefono = Number(row.entity.telefono);
        $scope.editDireccion = row.entity.direccion;
    };
    
    /*Se guardan los cambios del formulario edición*/
    $scope.editarCliente = function(cliente){
        var id = cliente.editId.$modelValue;
        cliente = {
            nombre: cliente.editNombre.$modelValue,
            apellido: cliente.editApellido.$modelValue,
            email: cliente.editEmail.$modelValue,
            telefono: cliente.editTelefono.$modelValue,
            direccion: cliente.editDireccion.$modelValue
        };
        Clientes.editar(id, cliente).then(function(){
            $scope.listarClientes("todos");
            $scope.obtenerLetras();
            $('#modalEditar').modal('hide');
            toastr.success('Cliente editado con éxito');
        });
    };
    
    /*Filtro de letras*/
    $scope.obtenerLetras = function(){
        Clientes.traer().then(function(cli){

            var letras = [];
            for(var i=0; i<cli.data.length; i++){
                letras.push(cli.data[i].apellido.substr(0, 1));
            };

            var letrasUnicas = [];
            $.each(letras, function(i, l){
                if($.inArray(l, letrasUnicas) === -1) letrasUnicas.push(l);
            });

            $scope.letras = letrasUnicas.sort();
        });
    };
    $scope.obtenerLetras();
    
    /*Se llena la grilla*/
    $scope.listarClientes = function(filtro){
        Clientes.traer().then(function(cli){
            if(filtro === "todos"){
                $scope.grilla.data = cli.data;
            }else{
                var clientes = [];
                for(var i=0; i<cli.data.length; i++){
                    if(cli.data[i].apellido.substr(0, 1) === filtro)
                        clientes.push(cli.data[i]);
                    $scope.grilla.data = clientes;
                };
            }
        });
    };
    $scope.listarClientes("todos");
    
    hotkeys.add({
        combo: 'n',
        description: 'Abre el formulario de nuevo cliente',
        callback: function(){
            $('#modalNuevo').modal('show');
        }
    });
    hotkeys.add({
        combo: 'c',
        description: 'Abre la calculadora',
        callback: function(){
            $('#modalCalc').modal('show');
        }
    });
});
