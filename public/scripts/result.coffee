$(document).ready ->
    blocks = $('#resultRGB .block')
    blocks.each (i, elem) ->
        $(elem).width (
            ($(this).parent().width() / blocks.length) / $(this).parent().width()
            ) * 100 + '%'