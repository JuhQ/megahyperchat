app.directive('message', function(emojiService) {
  return {
    restrict: 'E',
    link: function($scope, el, attrs) {
      var replaceTag, safe_tags_replace, tagsToReplace;
      tagsToReplace = {
        "<": "&lt;",
        ">": "&gt;"
      };
      replaceTag = function(tag) {
        return tagsToReplace[tag] || tag;
      };
      safe_tags_replace = function(str) {
        return str.replace(/[&<>]/g, replaceTag);
      };
      $scope.message.message = $scope.message.message.replace(/[<>]/g, replaceTag);
      $scope.message.message = $scope.message.message.replace("&lt;3", ":heart:");
      return el.html(emojiService.emojify($scope.message.message));
    }
  };
});
