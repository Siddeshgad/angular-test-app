'use strict';

angular.module('myApp.view1', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {
    templateUrl: 'view1/view1.html',
    controller: 'View1Ctrl'
  });
}])

.controller('View1Ctrl', ['$scope','$http', function($scope,$http) {
	$scope.lanes = null;
	$scope.list = [];
	$scope.selectedSignal = null;
	$scope.date = null;
	$scope.selectedFromLane = null;
	$scope.selectedToLane = null;
	$scope.selectedModel = null;

	$http.get("http://localhost/auto_ninja/public/api/signal")
    .then(function(response) {
        $scope.signals = response.data;
    });

    $http.get("http://localhost/auto_ninja/public/api/model")
    .then(function(response) {
        $scope.models = response.data;
    });

    $scope.getLanes = function() {
		$http.get("http://localhost/auto_ninja/public/api/lane/" + $scope.selectedSignal)
	    .then(function(response) {
	        $scope.lanes = response.data;
	    });    	
    };

    $scope.filter = function() {
    	if($scope.date == null || $scope.selectedSignal == null)
    	{
    		alert('Date or signal value is empty');
    	}
    	else
    	{
    		if(($scope.selectedFromLane == $scope.selectedToLane) && ($scope.selectedFromLane != null))
    		{
    			alert('From and to lane can not be same');
    		}
    		else
    		{
	    		var date_value = $scope.date.getFullYear() + "-" + ($scope.date.getMonth() + 1) + "-" + $scope.date.getDate()
	    		var filters = "date=" + date_value + "&signal_id=" + $scope.selectedSignal;

	    		if($scope.selectedModel)
	    			filters += "&model=" + $scope.selectedModel;

	    		if($scope.selectedFromLane)
	    			filters += "&from_lane_id=" + $scope.selectedFromLane;

	    		if($scope.selectedToLane)
	    			filters += "&to_lane_id=" + $scope.selectedToLane;

	    		$http.get("http://localhost/auto_ninja/public/api/search?"+filters)
			    .then(function(response) {
			        $scope.list = response.data;
			    });
			}
    	}
    };


}]);