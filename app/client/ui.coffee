
PaneController = React.createFactory React.createClass
  mixins: [Panoko.SyncState]
  globals: ['pane', 'query']
  
  getInitialState: ->
    {
      query: '',
      pane: 'messages'
    }

  newQuery: (query) ->
    @setState query: query

  show: (pane) ->
    @setState pane:pane

  panes: [
    ['messages', Panoko.FacebookMessageView],
#    ['search', Panoko.SearchQueryView]
    ]
    
  render: ->
    console.log "QUERY: #{@state.query}"
    children = []
    for [pane, components...] in @panes
      for comp in components
        children.push comp
          key: pane
          query: @state.query
          shown: pane == @state.pane
          sidebar: @props.sidebar
          pane: pane

    DOM.div children

SidebarController = React.createFactory React.createClass
  mixins: [Panoko.SyncState]
  globals: ['pane', 'counts']
  
  getInitialState: ->
    pane: 'messages'
    counts: {}

  changePane: (pane) ->
    @publish 'pane', pane

  panes: ['messages', 'search']
  render: ->
    DOM.ul {id:'active', class: "nav navbar-nav side-nav"},
      @panes.map (pane) =>
        DOM.li
          key: pane
          className: (@state.pane == pane and 'selected' or ''),
          DOM.a
            href: '#'+pane,
            onClick: (ev)=>@changePane(pane),
            [DOM.span(key:'name', pane),
            DOM.span
              key: 'count'
              className:'badge'
              style: (not @state.counts[pane]? and {display: 'none'} or {})
              [@state.counts[pane]]]
          
      
        


QueryInput = React.createFactory React.createClass
  mixins: [Panoko.SyncState]
  submit: (ev) ->
    ev.preventDefault()
    query = @refs.input.getDOMNode().value
    console.log "calling searcher with #{query}"
    @publish 'query', query
    
  render: ->
    DOM.form class: 'navbar-search', onSubmit: @submit,
      DOM.input {
        type:'text',
        placeholder:'Search',
        class:'form-control',
        ref: 'input'
        },[]


Meteor.startup ->
  React.render PaneController(),
    document.getElementById('panes')
  React.render QueryInput(),
    document.getElementById('search-form')
  React.render SidebarController(),
    document.getElementById('sidebar')


