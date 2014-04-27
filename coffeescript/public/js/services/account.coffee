app.factory 'accountService', ($resource) ->

  get: (id) ->
    $resource('/api/profile/:id').get({id})

    ##{id: 123, name: "asda", fb_id: id}

  getLoggedIn: ->
    $resource('/api/loggedin').get()