
window.QueryMixin =
  componentWillMount: ->
    if @props.query
      @queryFacts(@props.query)

  componentWillReceiveProps: (props) ->
    if props.query
      @queryFacts(props.query)

  queryFacts: (query) ->
    result = Facts.find(@getQuery(query))
    v = {}
    v[@props.pane] = result.count()
    @publish 'counts', v
    @setState facts: result

window.globalState = {}

# needs @globals = []
window.ObserveGlobalState =
  componentDidMount: ->
    unless @globals
      console.log "no @globals", @getDOMNode()
      return

    @observer = new ObjectObserver(window.globalState)
    @observer.open (added, removed, changed, oldVal) =>
      console.log added, removed, changed
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
    console.log "observe..", @observer, @getDOMNode()

  componentWillUnmount: ->
    unless @globals?
      return
    console.log "un-observe..", @getDOMNode()
    @observer.close()

  updateGlobal: (prop, modificator) ->
    window.globalState[prop] = modificator window.globalState[prop]


window.SyncState =
  doSyncState: (prop, state) ->
    console.log "eve ", prop, state
    if prop in @globals
      ns = {}
      ns[prop] = state
      console.log "Set state ", ns
      @setState ns
      console.log "and is set to ", @state
    false

  componentDidMount: ->
    if @globals
      @globals.map (g) =>
        console.log "syncstate.#{g}"
        $(document).on "syncstate.#{g}", (ev, state) => @doSyncState(g, state)
    
  componentWillUnmount: ->
    if @globals
      @globals.map (g) =>
        $(document).off "syncstate.#{g}", (ev, state) => @doSyncState(g, state)
    
  publish: (prop, obj) ->
    console.log "publish ", prop, obj
    $(document).trigger "syncstate.#{prop}", obj
