$(document).ready ->
    $('form').submit (e) ->
        e.preventDefault()
        window.location.href = '/analyse?query=' + encodeURIComponent $( "input:first" ).val()
        
