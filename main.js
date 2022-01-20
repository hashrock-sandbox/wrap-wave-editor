const fileInput = document.getElementById("input")
const canvas = document.getElementById('vis');
const ctx = canvas.getContext('2d')
let cursor = 0;
const scale = 1;
const height = 100;
const amp = height / 2;
let data = null
const width = canvas.width
let selectionStart = 1000;
let selectionEnd = 3000; 
const MOVE_SIZE = 25
let pressShift = false

document.addEventListener("keyup", (ev) => {
    switch(ev.code) {
        case "ShiftLeft": 
            pressShift = false
            break;
        case "ShiftRight": 
            pressShift = false
            break;
        }
    }
)

function clearSelection (){
    selectionStart = 0;
    selectionEnd = 0;

}

document.addEventListener("keydown", (ev)=>{
    switch(ev.code) {
        case "ShiftLeft": 
            selectionStart = cursor
            pressShift = true;
            break;
        case "ShiftRight": 
            selectionStart = cursor
            pressShift = true;
            break;
        case "ArrowUp": 
            cursor -= Math.floor(width * scale)
            if(pressShift){
                selectionEnd = cursor;
            }else{
                clearSelection()
            }
            redraw(data, ctx, width, height, cursor)
            ev.preventDefault()
            break;
        case "ArrowDown": 
            cursor += Math.floor(width * scale)
            if(pressShift){
                selectionEnd = cursor;
            }else{
                clearSelection()
            }
            ev.preventDefault()
            redraw(data, ctx, width, height, cursor)
            break;
        case "ArrowLeft": 
            cursor -= MOVE_SIZE
            if(pressShift){
                selectionEnd = cursor;
            }else{
                clearSelection()
            }
            redraw(data, ctx, width, height, cursor)
            ev.preventDefault()
            break;
        case "ArrowRight": 
            cursor += MOVE_SIZE
            if(pressShift){
                selectionEnd = cursor;
            }else{
                clearSelection()
            }
            redraw(data, ctx, width, height, cursor)
            ev.preventDefault()
            break;
    }
})


fileInput.addEventListener("change", async (e) => {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const file = e.target.files[0]
    const ab = await file.arrayBuffer();

    audioCtx.decodeAudioData(ab, (buffer) => {
        data = buffer.getChannelData(0)

        redraw(data, ctx, width, height, cursor);
    })
})

function redraw(data, ctx, width, height, cursor) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "black";
    for (let i = 0; i < data.length / width; i++) {
        const start = i * width / scale;
        const end = (i + 1) * width / scale;

        const row = data.slice(start, end);
        drawWaveShape(ctx, 0, height * i, width, height, row, scale, amp);

        ctx.save()
        ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
        ctx.translate(0, height * i)
        ctx.fillRect(selectionStart - start, 0, selectionEnd - selectionStart, height)
        ctx.restore()
    }
    ctx.fillRect((cursor % width), Math.floor(cursor / width) * height, 3, height);
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";

    ctx.fillStyle = "black";
}

function drawWaveShape(ctx, x, y, width, height, data, scale, amp) {
    ctx.save()
    ctx.translate(x, y)
    ctx.beginPath();
    ctx.lineTo(0, height / 2);
    ctx.moveTo(0, height / 2 + data[0]);
    // for (let i = 0; i < width; i++) {
    //     ctx.lineTo(i, height / 2 + data[step * i] * amp);
    // }
    for (let i = 0; i < data.length; i++) {
        ctx.lineTo(i * scale, height / 2 + data[i] * amp);
    }
    ctx.lineTo(width, height / 2);
    ctx.closePath();
    ctx.stroke();
    ctx.restore()
}

