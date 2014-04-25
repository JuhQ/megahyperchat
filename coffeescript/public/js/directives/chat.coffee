app.directive 'chat', (socketService, emojiService) ->
  restrict: 'E'
  templateUrl: 'chat.html'
  link: ($scope, el, attrs) ->
    $scope.messages = []
    $scope.emojis = emojiService.getList()

    scrollhere = document.getElementById("scrollhere")

    $scope.startsWith = (state, viewValue) ->
      state.substr(0, viewValue.length) is viewValue

    fromRandom = ->
      {name: "random man #{_.random(1,2000)}", id: _.random(1,2000)}

    for i in [0..1]
      socketService.sendMessage {message: "hello world, random :curly_loop: message #{_.random(1,10000)}", from: fromRandom()}

    socketService.on 'message', (data) =>
      $scope.messages.push data
      $scope.$apply()
      scrollhere?.scrollIntoView()


    $scope.sendMessage = ->
      socketService.sendMessage {message: $scope.message, from: fromRandom()}
      $scope.message = ''