angular.module('app').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('chat.html',
    "<div class=\"row placeholders\" ng-hide=\"true\"><div class=\"col-xs-5 col-sm-2 placeholder\" ng-repeat=\"i in getNumber(6) track by $index\"><img src=\"http://placekitten.com/100/100\" class=\"img-responsive img-circle\" alt=\"Generic thumbnail\"><h4>Ahmed</h4><span class=\"text-muted\">Single, 27 years</span></div></div><h2>Chat</h2><div class=\"table-responsive\"><table class=\"table table-striped\"><tbody><tr ng-repeat=\"message in messages\"><td class=\"col-xs-2 col-sm-2 message-from\"><img ng-src=\"https://graph.facebook.com/{{message.from.id}}/picture\" class=\"img-circle\"> {{message.from.name}}</td><td class=\"col-xs-10 col-sm-10\"><message>{{message.message}}</message></td></tr></tbody></table></div>"
  );


  $templateCache.put('index.html',
    "<div class=\"col-sm-3 col-md-2 sidebar\"><ul class=\"nav nav-sidebar\"><li class=\"active\"><a href=\"#\">Signup</a></li><li><a href=\"#\">Logout</a></li><li><a href=\"#\">My profile</a></li><li><a href=\"#\">Search</a></li></ul><online></online></div><div class=\"col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 main\"><chat></chat></div><script type=\"text/ng-template\" id=\"customTemplate.html\"><a>\n" +
    "    <i class=\"emoji emoji_{{match.label.replace(':', '').replace(':', '')}}\">{{match.label}}</i>\n" +
    "    <span bind-html-unsafe=\"match.label | typeaheadHighlight:query\"></span>\n" +
    "  </a></script><div id=\"footer\"><div class=\"col-md-10 col-md-offset-2\"><form class=\"form\" role=\"form\" ng-submit=\"sendMessage()\"><div class=\"form-group col-sm-6\"><input type=\"text\" class=\"form-control\" placeholder=\"Message..\" ng-model=\"message\" typeahead=\"emoji for emoji in emojis | filter:$viewValue:startsWith | limitTo:8\" typeahead-template-url=\"customTemplate.html\"></div><button type=\"submit\" class=\"btn btn-default\">Send</button></form></div></div>"
  );


  $templateCache.put('online.html',
    "<ul class=\"nav nav-sidebar online-list\"><li><strong>Online ({{online.length}})</strong></li><li ng-repeat=\"user in online\"><a href=\"\"><img ng-src=\"https://graph.facebook.com/{{user.id}}/picture\" class=\"img-circle\"> {{user.name}}</a></li></ul>"
  );

}]);
