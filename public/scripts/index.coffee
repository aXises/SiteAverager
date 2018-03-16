$(document).ready ->
    $('form').submit (e) ->
        e.preventDefault()
        value = $( 'input:first' ).val()
        if value == ''
            $( 'input:first' ).addClass('is-invalid')
            return
        $('input[type="submit"]').val('Analysing...')
        window.location.href = '/analyse?query=' + encodeURIComponent value