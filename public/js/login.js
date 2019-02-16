$(document).ready(function () {
    $("#login_button").on("click", function () {
        var username = $("#username").val()  //Change the ids here if you choose 
        var password = $("#password").val()  //to change the views later.
        login(username, password) //Logs in the user.
    })
})

function login(username, password) {
    loginreq = new XMLHttpRequest();

    loginreq.onload = function () {
        if (loginreq.readystate = XMLHttpRequest.DONE) {
            if (loginreq.status === 200 || loginreq.status === 304) {
                window.location.href = '/'
            }else{
                $("#error_message").html(loginreq.responseText)
            }
        }
    }
    loginreq.open('POST', 'http://localhost:8080/login', true);
    loginreq.setRequestHeader('Content-Type', 'application/json');
    loginreq.send(JSON.stringify({ username: username, password: password }));

}