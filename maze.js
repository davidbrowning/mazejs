let canvas;
let context;
var matrix = [[]];
let myCell;
var width;//TODO make this dependant on the user radio buttons
var height;

document.addEventListener('keydown', function(event) {
    if(event.keyCode == 37) {
        myCell.moveLeft();
    }
    else if(event.keyCode == 39) {
        myCell.moveRight();
    }
    else if(event.keyCode == 38) {
        myCell.moveUp();
    }
    else if(event.keyCode == 40) {
        myCell.moveDown();
    }
//    createWall();
});



function cell(spec){
    let that = {};
    
    that.getX = function(){
        return spec.mx_x;
    }
    that.getY = function(){
        return spec.mx_y;
    }
    that.isFree = function(){
        return spec.empty;
    }
    that.moveRight = function(){
        if(matrix[spec.mx_x + 1][spec.mx_y].isFree()){
            context.clearRect(spec.position.x,spec.position.y,canvas.width, canvas.height);
            spec.position.x = spec.position.x + spec.width;
            spec.mx_x = spec.position.x / width;
            spec.mx_y = spec.position.y / height;
            console.log("x: ",spec.mx_x, "y: ",spec.mx_y);
            spec.updateMe = true;
        }
    }
    that.moveLeft = function(){
        if(matrix[spec.mx_x - 1][spec.mx_y].isFree()){
            context.clearRect(spec.position.x,spec.position.y,canvas.width, canvas.height);
            spec.position.x = spec.position.x - spec.width;
            spec.mx_x = spec.position.x / width;
            spec.mx_y = spec.position.y / height;
            console.log("x: ",spec.mx_x, "y: ",spec.mx_y);
            spec.updateMe = true;
        }
    }
    that.moveUp = function(){
        if(matrix[spec.mx_x][spec.mx_y - 1].isFree()){
            context.clearRect(spec.position.x,spec.position.y,canvas.width, canvas.height);
            spec.position.y = spec.position.y - spec.height;
            spec.mx_x = spec.position.x / width;
            spec.mx_y = spec.position.y / height;
            console.log("x: ",spec.mx_x, "y: ",spec.mx_y);
            spec.updateMe = true;
        }
    }
    that.moveDown = function(){
        if(matrix[spec.mx_x][spec.mx_y + 1].isFree()){
            context.clearRect(spec.position.x,spec.position.y,canvas.width, canvas.height);
            spec.position.y = spec.position.y + spec.height;
            spec.mx_x = spec.position.x / width;
            spec.mx_y = spec.position.y / height;
            console.log("x: ",spec.mx_x, "y: ",spec.mx_y);
            spec.updateMe = true;
        }
    }
    that.draw = function(){
        context.fillStyle = 'rgba(100,0,100,1)';
        var startPoint = (Math.PI/180)*0;
        var endPoint = (Math.PI/180)*360;
        context.arc(spec.position.x+25, spec.position.y+25,5,startPoint,endPoint,true);
        context.fill();
        context.closePath();
        context.fillStyle = spec.color;
        context.fillRect(spec.position.x,spec.position.y,spec.width,spec.height);
        spec.updateMe = false;
    }
    that.getUpdateStatus = function(){
        return spec.updateMe;
    }
    
    return that;
}

myOtherWall = cell({
    position: {x: 100, y: 0},
    height: 50,
    width: 50,
    color: 'rgb(50,50,50)',
    mx_x:2,
    mx_y:0,
    updateMe: true,
    empty: false
})

myWall = cell({
    position: {x: 0, y: 50},
    height: 50,
    width: 50,
    color: 'rgb(50,50,50)',
    isWall: true,
    up : false,
    down : false,
    right : false,
    left : false,
    mx_x : 0,
    mx_y : 1,
    updateMe: true,
    empty: false
})

myCell = cell({
    position: {x: 0, y: 0},
    height: 50,
    width: 50,
    up: false,
    down : false,
    mx_x : 0,
    mx_y : 0,
    color: 'rgb(0,255,0)',
    isWall: false,
    updateMe: true
})


function init(){
    canvas = document.getElementById('canvas');
    context = canvas.getContext('2d');
    width = canvas.width / 10;
    height = canvas.height /10;
    for (var i = 0; i < 10; i ++){
        matrix[i] = new Array(10);
        for(var j = 0; j < 10; j++){
            matrix[i][j] = (cell({position: {x: i * width, y: j* height},mx_x: i, mx_y: j, empty: true,isWall: false}));
        }
    }
    gameLoop(performance.now());
}

function gameLoop(timestamp){
    list = []
    update(list);
    render(list);
}

function update(list){
    if(myCell.getUpdateStatus()){
        list.push(myCell);
        list.push(myWall);
        list.push(myOtherWall);
        console.log(matrix[myWall.getX()][myWall.getY()]);
    }
    matrix[myWall.getX()][myWall.getY()] = myWall;
    matrix[myOtherWall.getX()][myOtherWall.getY()] = myOtherWall;
}

function render(list){
    context.save();
    list.forEach(function(el){
        el.draw();
    })
    context.restore();
    requestAnimationFrame(gameLoop);
}
