$(document).ready(() => {
    $("#event-logo-file").on("change", (e) => {
        var img_file = $("#event-logo-file").prop('files')[0];
        if (img_file) {
            reader_event.readAsDataURL(img_file)
        }
    })

    $("#council-logo-file").on("change", (e) => {
        var img_file = $("#council-logo-file").prop('files')[0];
        if (img_file) {
            reader_council.readAsDataURL(img_file)
        }
    })

    $('#div-logout').click(() => {
        window.location.href = '/logout'
    }).css("cursor", "pointer");

    var reader_event = new FileReader()
    var event_preview = $("#event-logo-preview")
    reader_event.addEventListener("load", function () {
        event_preview.attr("src", reader_event.result)
        $("#event-logo").val(reader_event.result)
    }, false);

    var reader_council = new FileReader()
    var council_preview = $("#council-logo-preview")
    reader_council.addEventListener("load", function () {
        council_preview.attr("src", reader_council.result)
        $("#council-logo").val(reader_council.result)
    }, false);


})