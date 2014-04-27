app.directive 'chat', (socketService, emojiService, accountService) ->
  restrict: 'E'
  templateUrl: 'chat.html'
  link: ($scope, el, attrs) ->
    $scope.messages = []
    $scope.from = false
    $scope.emojis = emojiService.getList()

    scrollhere = document.getElementById("scrollhere")

    $scope.startsWith = (state, viewValue) ->
      state.substr(0, viewValue.length) is viewValue

    loggedInUser = accountService.getLoggedIn()

    loggedInUser
      .$promise
      .then (data) ->
        console.log("data", data)
        $scope.from = data
        socketService.setOnline data


    socketService.on 'message', (data) =>
      $scope.messages.push data
      $scope.$apply()
      scrollhere?.scrollIntoView()


    $scope.sendMessage = ->
      if $scope.from
        socketService.sendMessage {message: $scope.message, from: $scope.from}
        $scope.message = ''