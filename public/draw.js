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

    if (username === null) {
        username = "Guest";
    }

    document.getElementById('inputMsg').value = ""; 
    socket.emit('messageSent', message, username); 
});

// Receive info logic 
socket.on('messageReceived', (message, username) => {
    const p = document.createElement('p'); 
    p.textContent = `${username}: ${message}`;   
    
    chatBox.appendChild(p); 
})

socket.on('draw', (pos, color, width) => {
    ctx.fillStyle = color;
    ctx.fillRect(pos.x,pos.y, width, width);
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
});

canvas.addEventListener('mousemove', (e) => {
    if (!isDrawing) return;

    const currentPos = {
        x: (e.clientX - rect.left) / rect.width * canvas.width,
        y: (e.clientY - rect.top) / rect.height * canvas.height
    };

    // ctx.lineTo(currentPos.x, currentPos.y); 
    // ctx.stroke();
    ctx.fillStyle = myColor.value; 
    ctx.fillRect(currentPos.x,currentPos.y,lineWidth.value,lineWidth.value);

    socket.emit('newDrawing', currentPos, ctx.fillStyle, lineWidth.value); 
    
    startingPos = currentPos;
});

canvas.addEventListener('mouseup', () => {
    isDrawing = false;
});

canvas.addEventListener('mouseout', () => {
    isDrawing = false;
});