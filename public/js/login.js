$(document).ready(function () {
    $("#login_button").on("click", function () {
        login() //Logs in the user.
    })

    $("#username, #password").on("change", function () {
        $(document).keypress(function (e) {
            if (e.which == 13) {
                login()
            }
        })
    })
})

function login() {
    loginreq = new XMLHttpRequest()

    loginreq.onload = function () {
        if (loginreq.readystate = XMLHttpRequest.DONE) {
            if (loginreq.status === 200 || loginreq.status === 304) {
                window.location.href = '/'
            } else if (loginreq.status === 400) {
                $("#error_message").html("One or more fields empty.")
            } else if (loginreq.status === 401) {
                $("#error_message").html("Incorrect Username/Password.")
            }
        }
    }
    var username = $("#username").val()  //Change the ids here if you choose 
    var password = $("#password").val()  //to change the views later.
    loginreq.open('POST', 'http://localhost:8080/login', true);
    loginreq.setRequestHeader('Content-Type', 'application/json')
    loginreq.send(JSON.stringify({ username: username, password: password }))

}
