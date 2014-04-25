app.directive 'online', (socketService) ->
  restrict: 'E'
  templateUrl: 'online.html'
  link: ($scope, el, attrs) ->
    $scope.online = []

    socketService.getOnlineList()

    socketService.on 'chat-history', (data) =>
      $scope.online = data or []
      $scope.$apply()

    socketService.on 'online', (data) =>
      $scope.online.push data
      $scope.$apply()


    socketService.on 'offline', (id) =>
      _.remove $scope.online, (online) ->
        id is online.id
      $scope.$apply()

    #setInterval ->
    #  socketService.setOnline {name: "Random #{_.random(1,200)}", id: _.random(1,200)}
    #, 15000


    #setInterval ->
    #  socketService.setOffline _.random(1,200)
    #, 1500
