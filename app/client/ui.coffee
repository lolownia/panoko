
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
    ['search', Panoko.SearchQueryView],
    ['cred', Panoko.CredView],
    ['upload', Panoko.UploadView],
    ['email', Panoko.EmailView]
    ]
    
  render: ->
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
  mergers:
    counts: (old, change) ->
      _.extend(old or {}, change)
      
  panes: ['messages', 'email', 'search', 'cred', 'upload']
    
  getInitialState: ->
    pane: 'messages'
    counts: {}

  changePane: (pane) ->
    @publish 'pane', pane


  render: ->
    show_badge = (counts) =>
      if counts?
        return {}
      return {display: 'none'}
      
    is_selected = (pane) =>
      if @state.pane == pane
        return 'selected'
      return ''
      
    DOM.ul {id:'active', class: "nav navbar-nav side-nav"},
      @panes.map (pane) =>
        DOM.li
          key: pane
          className: is_selected(pane)
          DOM.a
            href: '#'+pane,
            onClick: (ev)=>@changePane(pane),
            [DOM.span(key:'name', pane),
            DOM.span
              key: 'count'
              className:'badge'
              style: show_badge(@state.counts[pane])
              [@state.counts[pane]]]
        


QueryInput = React.createFactory React.createClass
  mixins: [Panoko.SyncState]
  submit: (ev) ->
    ev.preventDefault()
    query = @refs.input.getDOMNode().value
    @publish 'query', query
    
  render: ->
    DOM.form class: 'navbar-search', onSubmit: @submit,
      DOM.input {
        type:'text',
        placeholder:'Search',
        class:'form-control',
        ref: 'input'
        },[]

Test = React.createFactory React.createClass
  getInitialState: ->
    {foo:{}}
  render: ->
    DOM.div {}, [
      DOM.button({onClick: => @setState({foo: {one:1}})}, "one"),
      DOM.button({onClick: => @setState({foo: {two:2}})}, "two"),
      DOM.span "state keys are: #{Object.keys(@state.foo)}"
      ]
      


Meteor.startup ->
  React.render PaneController(),
    document.getElementById('panes')
  React.render QueryInput(),
    document.getElementById('search-form')
  React.render SidebarController(),
    document.getElementById('sidebar')
  #React.render Test(), document.getElementById('test')
