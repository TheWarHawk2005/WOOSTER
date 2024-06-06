const SERVERURL = 'https://jsonblob.com/api/1239311056248889344'

if (localStorage.getItem('client-password') == null) localStorage.setItem('client-password', '')
if (localStorage.getItem('client-name') == null) localStorage.setItem('client-name', '')
document.querySelector('#passwordInput').value = localStorage.getItem('client-password')
document.querySelector('#nameInput').value = localStorage.getItem('client-name')

setInterval(function() {
    if (document.querySelector('#passwordInput').value !== "") loadMessages()
},3000)


// Attempt to Ping JSONBlob
xmh = new XMLHttpRequest()
xmh.open('GET', SERVERURL)
xmh.onload = function () {
    results = xmh.responseText
    console.log(`Pinged JSONBlob server`)
}
xmh.send()

function loadMessages() {
    // Load messages
    xmh = new XMLHttpRequest()
    xmh.open('GET', SERVERURL)
    xmh.onload = function () {
        results = JSON.parse(xmh.responseText)
        password = document.querySelector('#passwordInput').value

        messagesWrapper = document.querySelector('#messages')
        messagesWrapper.innerHTML = ''
        for (i = 0; i < results.length; i++) {
            data = results[i]
            sender = CryptoJS.AES.decrypt(data.name, password).toString(CryptoJS.enc.Utf8)
            body = CryptoJS.AES.decrypt(data.body, password).toString(CryptoJS.enc.Utf8)
            security = CryptoJS.AES.decrypt(data.security, password).toString(CryptoJS.enc.Utf8) //security must == password when decrypted to load message

            if (security == password) {
                let ele = document.createElement('DIV')
                ele.classList = `message isOdd${i % 2 === 0}`
                ele.innerHTML = `
            <span class="name">${sender}</span><span class="body">: ${body}</span>
            `
                messagesWrapper.appendChild(ele)
            }
            }
    }
    xmh.send()
}

function sendMessage() {
    xmh = new XMLHttpRequest()
    xmh.open('GET', SERVERURL)
    xmh.onload = function () {
        data = JSON.parse(xmh.responseText)

        password = document.querySelector('#passwordInput').value
        clientName = CryptoJS.AES.encrypt(document.querySelector('#nameInput').value, password).toString()
        body = CryptoJS.AES.encrypt(document.querySelector('#messageInput').value, password).toString()
        security = CryptoJS.AES.encrypt(password, password).toString()

        document.querySelector('#messageInput').value = ''

        data.push({"name":clientName,"body":body,"security":security}) //update data
    
        xmh = new XMLHttpRequest()
        xmh.open('PUT', SERVERURL)
        xmh.setRequestHeader('content-type','application/json')
        xmh.onload = function () {
            loadMessages()
    
        }
        xmh.send(JSON.stringify(data))
    
    }
    xmh.send()
}

function saveDetails() {
    localStorage.setItem('client-password', document.querySelector('#passwordInput').value)
    localStorage.setItem('client-name', document.querySelector('#nameInput').value)
    alert(`Saved your name and password :)`)
}