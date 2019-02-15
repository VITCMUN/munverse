window.onload = () => {
    
    function login() {
        var payload = {
            "username": document.getElementById('username').value,
            "password": document.getElementById('password').value
        }
        var xhttp = new XMLHttpRequest()
        xhttp.onreadystatechange = () => {
            if (this.readyState == 4) {
                if (this.status == 200) {
                    window.location.href = '/'
                } else if ([302, 304].indexOf(this.status) > -1) {
                    window.location.href = this.redirectUrl
                } else {
                    document.getElementById('error_message').innerHTML = this.responseText
                }
            } 
        }
        xhttp.open('POST', '/login', true)
        xhttp.setRequestHeader('Content-type', 'application/json')
        xhttp.send(JSON.stringify(payload))
    }

    document.getElementById('login_button').onclick = login

}

  