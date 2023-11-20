const socket = io();
const userBtn = document.getElementById("userBtn");

function setCookie(name, value, days) {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
}

userBtn.addEventListener('click', () => {
    const username = document.getElementById("username").value; 
    if (username === "") {
        alert("Veuillez entrer un nom valide.");    
        return; 
    }

    socket.emit('newUser', username); 
    setCookie("username", username, 30);

    window.location.href = "/draw";
})