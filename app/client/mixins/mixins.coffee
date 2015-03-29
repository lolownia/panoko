window.Panoko = {} unless Panoko?

  
Panoko.QueryMixin =
  factsPerPage: 50
  getLimit: ->
    if 'limit' of @state
      return @state.limit
    return @factsPerPage

  getMoreFacts: (this_many) ->
    @queryFacts @props.query, this_many

  pagination: ->
    unless @state.facts.count?
      return ''
    count = @state.facts.count()
    if count == @getLimit()
      return DOM.div
        key: 'pagination'
        class: 'btn-group'
        role: 'group',
        DOM.a
          onClick: (ev) =>
            ev.preventDefault()
            @getMoreFacts(@getLimit() + @factsPerPage)
          href: '#'
          class: 'btn btn-default',
          'Load more...'
    return ''
             
  componentWillMount: ->
    if @props.query
      @queryFacts(@props.query)

  componentWillReceiveProps: (props) ->
    if props.query
      @queryFacts(props.query)

  queryFacts: (query, limit) ->
    if not limit?
      limit = @getLimit()
      
    result = Facts.find(@getQuery(query),
      {sort: {timestamp_start: -1}, limit: limit})
      
    v = {}
    v[@props.pane] = result.count()
    console.log "...and got counts: #{result.count()}"

    @publish 'counts', v
    @setState facts: result, limit: limit

  whereabouts: (query) ->
    if query.match(/^\d+[.]\d+[.]\d+[.]\d+$/)
      return [{'client': query}]
    return []

window.globalState = {}

# needs @globals = []
Panoko.ObserveGlobalState =
  componentDidMount: ->
    unless @globals
      return

    @observer = new ObjectObserver(window.globalState)
    @observer.open (added, removed, changed, oldVal) =>
      #console.log added, removed, changed
      news = {}
      for propname in @globals
        if propname of added
          ns[propname] = added[propname]          
        if  propname of changed
          ns[propname] = changed[propname]
        if  propname of removed
          ns[propname] = null
      unless news == {}
        @setState(news)
    #console.log "observe..", @observer, @getDOMNode()

  componentWillUnmount: ->
    unless @globals?
      return
    #console.log "un-observe..", @getDOMNode()
    @observer.close()

  updateGlobal: (prop, modificator) ->
    window.globalState[prop] = modificator window.globalState[prop]


Panoko.SyncState =
  doSyncState: (prop, state) ->
    #console.log "sync event:", prop, state
    if prop in @globals
      ns = {}

      if @mergers? and prop of @mergers
        ns[prop] = @mergers[prop](@state[prop], state)
      else
        ns[prop] = state
      
      #console.log 'state', ns, "->", @state
      @setState ns
      #console.log 'result state', @state


  componentDidMount: ->
    if @globals
      @globals.map (g) =>
        $(document).on "syncstate.#{g}", (ev, state) => @doSyncState(g, state)
    
  componentWillUnmount: ->
    if @globals
      @globals.map (g) =>
        $(document).off "syncstate.#{g}", (ev, state) => @doSyncState(g, state)
    
  publish: (prop, obj) ->
    $(document).trigger "syncstate.#{prop}", obj

