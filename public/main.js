const socket = io();
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let myColor = document.getElementById("myColor"); 
let isDrawing = false;
let startingPos = { x: 0, y: 0 };


// Receive info logic 
socket.on('draw', (start, end, color) => {
    //console.log(start, end); 
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.moveTo(start.x, start.y); 
    ctx.lineTo(end.x, end.y); 
    ctx.stroke(); 
})

// Save canvas logic 
const saveBtn = document.getElementById("saveBtn"); 
saveBtn.addEventListener("click", () => {
    const dataURL = canvas.toDataURL('image/jpg');

    // Create a link and set the download attribute
    const a = document.createElement('a');
    a.href = dataURL;
    a.download = "canvasSS";

    // Trigger a click on the link to start the download
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}); 


// Drawing Logic

canvas.addEventListener('mousedown', (e) => {
    isDrawing = true;
    startingPos = { x: e.clientX - canvas.offsetLeft, y: e.clientY - canvas.offsetTop };
    ctx.strokeStyle = myColor.value;
    ctx.beginPath();
    ctx.moveTo(startingPos.x, startingPos.y);
});

canvas.addEventListener('mousemove', (e) => {
    if (!isDrawing) return;

    const currentPos = { x: e.clientX - canvas.offsetLeft, y: e.clientY - canvas.offsetTop };

    ctx.lineTo(currentPos.x, currentPos.y); 
    ctx.stroke();

    // Envoie info au serveur
    socket.emit('newDrawing', startingPos, currentPos, ctx.strokeStyle); 
    
    startingPos = currentPos;
});

canvas.addEventListener('mouseup', () => {
    isDrawing = false;
});

canvas.addEventListener('mouseout', () => {
    isDrawing = false;
});

