
window.Panoko = {} unless Panoko?


Panoko.TimeField = React.createFactory React.createClass
  timeString: (milliseconds) ->
    d = new Date(milliseconds * 1000)
    s.sprintf "%02d:%02d:%02d", d.getHours(), d.getMinutes(), d.getSeconds()
    
  render: ->
    DOM.td
      class: 'table-time',
      @timeString @props.fact.timestamp_start
      
