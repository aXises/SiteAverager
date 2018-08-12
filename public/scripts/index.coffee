submitData = (url, data) =>
    $.ajax 
        url: url
        type: "POST"
        data: data

$(document).ready =>
    $("form").submit (e) =>
        e.preventDefault()
        value = $("input:first").val()
        if value == ""
            return $("input:first").addClass("is-invalid")
        $("input[type=\"submit\"]").val("Analysing...")
        submitData("/analyse", $("input:first").val()).then (res) =>
            # alert(res)
        .catch (err) =>
            # alert(err)