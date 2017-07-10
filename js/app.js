"use strict";


(function(){

	var app = angular.module('shoppingCart', ['ngRoute','ngCookies']);

	app.config(function($routeProvider){
		$routeProvider
			.when('/',{
				templateUrl:'template/main.html',
				controller:'mainController'
			})
			.when('/cart/', {
				templateUrl:'template/cart.html',
				controller:'mainController'
			})
			.when('/about/', {
				templateUrl:'template/about.html'
			})
			.otherwise({
				redirectTo: '/'
			});
	});

	app.factory('productsData', function($http) {
		var data = $http.get('data/products.json');
		return data;
	});

	app.controller('mainController', ['$scope', '$cookies', 'productsData', function($scope, $cookies, productsData) {

		$scope.products = [];
		productsData.then(function(response) {
			$scope.products = response.data;
		});
		$scope.cart = [];
		$scope.total = 0;


		if(!angular.isUndefined($cookies.get('total'))){
			$scope.total = parseFloat($cookies.get('total'));
		}

		if (!angular.isUndefined($cookies.get('cart'))) {
			$scope.cart =  $cookies.getObject('cart');
		}

		//methods
		$scope.addItemToCart = function(product){

			if ($scope.cart.length === 0){
				product.quantity = 1;
				$scope.cart.push(product);
			} else {
				var repeat = false;
				for(var i = 0; i< $scope.cart.length; i++){
					if($scope.cart[i].id === product.id){
						repeat = true;
						$scope.cart[i].quantity += 1;
					}
				}
				if (!repeat) {
					product.quantity = 1;
					$scope.cart.push(product);
				}
			}
			var expireDate = new Date();
			expireDate.setDate(expireDate.getDate() + 1);
			$cookies.putObject('cart', $scope.cart,  {'expires': expireDate});
			$scope.cart = $cookies.getObject('cart');


			$scope.total += parseFloat(product.price);
			$cookies.put('total', $scope.total,  {'expires': expireDate});
		};

		$scope.removeItemCart = function(product){

			if(product.quantity > 1){
				product.quantity -= 1;
				var expireDate = new Date();
				expireDate.setDate(expireDate.getDate() + 1);
				$cookies.putObject('cart', $scope.cart, {'expires': expireDate});
				$scope.cart = $cookies.getObject('cart');
			}
			else if(product.quantity === 1){
				var index = $scope.cart.indexOf(product);
				$scope.cart.splice(index, 1);
				expireDate = new Date();
				expireDate.setDate(expireDate.getDate() + 1);
				$cookies.putObject('cart', $scope.cart, {'expires': expireDate});
				$scope.cart = $cookies.getObject('cart');

			}

			$scope.total -= parseFloat(product.price);
			$cookies.put('total', $scope.total,  {'expires': expireDate});

		};

		$scope.increaseItemAmount = function(product) {
			product.quantity++;

			var repeat = false;
			for(var i = 0; i< $scope.cart.length; i++){
				if($scope.cart[i].id === product.id){
					repeat = true;
				}
			}
			if (!repeat) {
				product.quantity = 1;
				$scope.cart.push(product);
			}

			var expireDate = new Date();
			expireDate.setDate(expireDate.getDate() + 1);
			$cookies.putObject('cart', $scope.cart,  {'expires': expireDate});
			$scope.cart = $cookies.getObject('cart');

			$scope.total += parseFloat(product.price);
			$cookies.put('total', $scope.total,  {'expires': expireDate});
		};

		$scope.decreaseItemAmount = function(product) {
			product.quantity--;

			if(product.quantity > 1){
				var expireDate = new Date();
				expireDate.setDate(expireDate.getDate() + 1);
				$cookies.putObject('cart', $scope.cart, {'expires': expireDate});
				$scope.cart = $cookies.getObject('cart');
			}
			else if(product.quantity === 0){
				var index = $scope.cart.indexOf(product);
				$scope.cart.splice(index, 1);
				expireDate = new Date();
				expireDate.setDate(expireDate.getDate() + 1);
				$cookies.putObject('cart', $scope.cart, {'expires': expireDate});
				$scope.cart = $cookies.getObject('cart');

			}

			$scope.total -= parseFloat(product.price);
			$cookies.put('total', $scope.total,  {'expires': expireDate});
		};

	}]);

})();