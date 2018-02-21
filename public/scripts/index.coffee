$(document).ready ->
    $('form').submit (e) ->
        e.preventDefault()
        value = $( 'input:first' ).val()
        if value == ''
            $( 'input:first' ).addClass('is-invalid')
            return
        window.location.href = '/analyse?query=' + encodeURIComponent value
        
