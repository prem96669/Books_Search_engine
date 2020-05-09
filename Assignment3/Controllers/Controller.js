
var app = angular.module('booksearchcatalog', []);

app.controller('mainController', ['$scope' , '$http', function($scope, $http) {
    console.log("Entered into the main controller");
    $scope.isInitialized = false;

    $scope.searchKeyword = function(){
        $scope.hideVar = false;
        $http.get('/search/'.concat($scope.keyword)).then(function(response) {
            $scope.books = response.data;
            $scope.isInitialized = true;
            console.log($scope.books);
        });
    }

    $scope.retrievenotes = function(){
        $scope.hideVar = true;
        $scope.isInitialized = true;
        $http.get('/retrievenotes/'.concat($scope.keyword)).then(function(response){
            $scope.notes = response.data;
            console.log(response.data);
        });
    }

    $scope.saveNotes = function(){
        $scope.isInitialized = true;
        var data = {'note': $scope.notes, 'keyword': $scope.keyword};
        $http.post('/notes',data).then(function(response){
            console.log(response.data);
        });
        console.log(data);
        $scope.notes = "";
    }
    
    $scope.reset = function(){
        $scope.notes = "";
    }


}]);