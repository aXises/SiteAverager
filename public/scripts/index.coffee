submitData = (route, data) =>
    $.ajax 
        url: route
        type: "POST"
        data: data

$(document).ready =>
    $("form").submit (e) =>
        e.preventDefault()
        value = $("input:first").val()
        if value == ""
            return $("input:first").addClass("is-invalid")
        $("input[type=\"submit\"]").val("Analysing...")
        submitData("/analyse", url: $("input:first").val()).then (res) =>
            return
        .catch (err) =>
            return