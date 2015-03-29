
window.Panoko = {} unless Panoko?

Panoko.PaneView =
  raw_html: (html) ->
    {__html: html}

  thead: (headers) ->
    clock = DOM.th({key:'time'}, DOM.i({class:'fa fa-clock-o'}, []))
    ip = DOM.th({key:'ip'}, DOM.i({class:'fa fa-sitemap'}, []))

    DOM.thead(
      key:'thead',
      DOM.tr([clock, ip].concat(
        _.map headers, (fn)-> DOM.th(key:fn, fn)))
      )

Panoko.IPField = React.createFactory React.createClass
  ip_ending: ->
    @props.fact.client.split('.').splice(-1)
    
  render: ->
    DOM.td
      key: 'id'
      class: 'table-ip'
      title: "#{@props.fact.client}",
      "...#{@ip_ending()}"
      
Panoko.TimeField = React.createFactory React.createClass
  timeString: (milliseconds) ->
    d = new Date(milliseconds * 1000)
    s.sprintf "%02d:%02d:%02d", d.getHours(), d.getMinutes(), d.getSeconds()
    
  render: ->
    DOM.td
      key: 'clock'
      class: 'table-time',
      @timeString @props.fact.timestamp_start
      

Panoko.FacebookUsers = React.createFactory React.createClass
  render: ->
    DOM.td
      key: 'user'
      class: 'table-user',
        (_.map @props.fbids, (fbid) ->
          DOM.a(
            href: "https://facebook.com/#{fbid}"
            target: '_blank',
            DOM.i(class: 'fa fa-user','')))
            .concat [
              DOM.span(@props.names or '(no data)')
              ]
