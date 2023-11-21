const socket = io();
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let myColor = document.getElementById("myColor"); 
let lineWidth = document.getElementById("lineWidth"); 
let isDrawing = false;
let startingPos = { x: 0, y: 0 };

const chatBtn = document.getElementById("sendMsg"); 
const chatBox = document.getElementById("chatBox");

const divUsers = document.getElementById("listOfUsers"); 
const rect = canvas.getBoundingClientRect();

const defaultImage = new Image();
defaultImage.src = "./assets/img/monkey.jpg";

defaultImage.onload = function () {
    ctx.drawImage(defaultImage, 0, 0, canvas.width, canvas.height);
};

// Chat Logic 
function getCookie(name) {
    const cookieValue = document.cookie.match(`(^|;)\\s*${name}\\s*=([^;]+)`);
    return cookieValue ? cookieValue.pop() : null;
}

chatBtn.addEventListener('click', () => {
    const message = document.getElementById('inputMsg').value;
    if (message === "") return 

    const username = getCookie("username");
    document.getElementById('inputMsg').value = ""; 
    socket.emit('messageSent', message, username); 
});

// Receive info logic 
socket.on('messageReceived', (message, username) => {
    console.log(message, username)
    const p = document.createElement('p'); 
    p.textContent = `${username}: ${message}`;   
    
    chatBox.appendChild(p); 
})

socket.on('draw', (start, end, color, width) => {
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.beginPath();
    ctx.moveTo(start.x, start.y); 
    ctx.lineTo(end.x, end.y); 
    ctx.stroke(); 
});

socket.on('user', (username) => {
    location.reload();
    divUsers.innerHTML = "<h1>Users online</h1>";
    console.log(username.length)

    for (let i = 0; i < username.length; i++) {
        const p = document.createElement('p'); 
        p.textContent = username[i]; 
        divUsers.appendChild(p);
    }   
}); 

// Save canvas logic 
const saveBtn = document.getElementById("saveBtn"); 
saveBtn.addEventListener("click", () => {
    const dataURL = canvas.toDataURL('image/jpg');

    const a = document.createElement('a');
    a.href = dataURL;
    a.download = "canvasSS";

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}); 


// Drawing Logic

canvas.addEventListener('mousedown', (e) => {
    isDrawing = true;
    startingPos = {
        x: (e.clientX - rect.left) / rect.width * canvas.width,
        y: (e.clientY - rect.top) / rect.height * canvas.height
    };
    ctx.strokeStyle = myColor.value;
    ctx.beginPath();
    ctx.moveTo(startingPos.x, startingPos.y);
});

canvas.addEventListener('mousemove', (e) => {
    if (!isDrawing) return;

    const currentPos = {
        x: (e.clientX - rect.left) / rect.width * canvas.width,
        y: (e.clientY - rect.top) / rect.height * canvas.height
    };

    ctx.lineTo(currentPos.x, currentPos.y); 
    ctx.stroke();

    // Envoie info au serveur
    if (lineWidth.value > 10) {
        lineWidth.value = 10; 
    }

    socket.emit('newDrawing', startingPos, currentPos, ctx.strokeStyle, lineWidth.value); 
    
    startingPos = currentPos;
});

canvas.addEventListener('mouseup', () => {
    isDrawing = false;
});

canvas.addEventListener('mouseout', () => {
    isDrawing = false;
});