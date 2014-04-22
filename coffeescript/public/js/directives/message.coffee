app.directive 'message', (emojiService) ->
  restrict: 'E'
  link: ($scope, el, attrs) ->

    # Note to self: I fucking hate regex
    tagsToReplace =
      "<": "&lt;"
      ">": "&gt;"
      
    replaceTag = (tag) ->
      tagsToReplace[tag] or tag
    safe_tags_replace = (str) ->
      str.replace /[&<>]/g, replaceTag

    $scope.message.message = $scope.message.message.replace /[<>]/g, replaceTag
    $scope.message.message = $scope.message.message.replace "&lt;3", ":heart:"

    el.html emojiService.emojify($scope.message.message)
