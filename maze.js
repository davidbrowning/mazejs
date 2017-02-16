let canvas;
let context;
var matrix = [[]];
let myCell;
var width;//TODO make this dependant on the user radio buttons
var height;
var x_length;
var y_length;
var breadcrumb;
var drawMaze;

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
    else if(event.keyCode == 66){
        breadcrumb = !breadcrumb;
       //console.log(breadcrumb)
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
    that.makeFree = function(){
        spec.empty = true
        spec.color = 'rgb(250,250,250)'
        spec.updateMe = true;
    }
    that.moveRight = function(){
        if(matrix[spec.mx_x + 1][spec.mx_y].isFree()){
            matrix[that.getX()][that.getY()].makeFree()
            //context.clearRect(spec.position.x,spec.position.y,canvas.width, canvas.height);
            spec.position.x = spec.position.x + spec.c_width;
            spec.mx_x = spec.position.x / width;
            spec.mx_y = spec.position.y / height;
           //console.log("x: ",spec.mx_x, "y: ",spec.mx_y);
            spec.updateMe = true;
        }
    }
    that.moveLeft = function(){
        if(matrix[spec.mx_x - 1][spec.mx_y].isFree()){
            matrix[that.getX()][that.getY()].makeFree()
            spec.position.x = spec.position.x - spec.c_width;
            spec.mx_x = spec.position.x / width;
            spec.mx_y = spec.position.y / height;
           //console.log("x: ",spec.mx_x, "y: ",spec.mx_y);
            spec.updateMe = true;
        }
    }
    that.moveUp = function(){
        if(matrix[spec.mx_x][spec.mx_y - 1].isFree()){
            matrix[that.getX()][that.getY()].makeFree()
            spec.position.y = spec.position.y - spec.c_height;
            spec.mx_x = spec.position.x / width;
            spec.mx_y = spec.position.y / height;
           //console.log("x: ",spec.mx_x, "y: ",spec.mx_y);
            spec.updateMe = true;
        }
    }
    that.moveDown = function(){
        if(matrix[spec.mx_x][spec.mx_y + 1].isFree()){
            matrix[that.getX()][that.getY()].makeFree()
            spec.position.y = spec.position.y + spec.c_height;
            spec.mx_x = spec.position.x / width;
            spec.mx_y = spec.position.y / height;
           //console.log("x: ",spec.mx_x, "y: ",spec.mx_y);
            spec.updateMe = true;
        }
    }
    that.draw = function(){
        context.fillStyle = 'rgba(100,0,100,1)';
       // var startPoint = (Math.PI/180)*0;
       // var endPoint = (Math.PI/180)*360;
       // context.arc(spec.position.x+12.5, spec.position.y+12.5,2.5,startPoint,endPoint,true);
       // context.closePath();
       // if(breadcrumb){
       //     context.fill();
       // }
       // else{
       //     //TODO figure out a way to clear the board without killing the walls/main character
       // }
        context.fillStyle = spec.color;
        context.fillRect(spec.position.x,spec.position.y,spec.c_width,spec.c_height);
        spec.updateMe = false;
    }
    that.getUpdateStatus = function(){
        return spec.updateMe;
    }
    
    return that;
}



myCell = cell({
    position: {x: 0, y: 0},
    c_height: 50,
    c_width: 50,
    up: false,
    down : false,
    mx_x : 0,
    mx_y : 0,
    color: 'rgb(0,255,0)',
    visited: false,
    updateMe: true
})


function init(){
    breadcrumb = false;
    canvas = document.getElementById('canvas');
    context = canvas.getContext('2d');
    x_length = 10;
    y_length = 10;
    width = canvas.width / x_length;
    height = canvas.height / y_length;
    for (var i = 0; i < 10; i ++){
        matrix[i] = new Array(10);
        for(var j = 0; j < 10; j++){
            matrix[i][j] = (cell({position: {x: i * width, y: j* height},c_width: width, c_height: height,mx_x: i, mx_y: j, empty: false,visited: false, color: 'rgb(25,25,25)', updateMe: false}));
           }
    }
    generateMaze()
    gameLoop(performance.now());
}


function addAllWalls(x, y, walls){
    var left = x-2
    var right = x+2
    var up = y-2
    var down = y+2
    if(left > -1 && !matrix[left][y].isFree() ){
        walls.push(matrix[left][y]);
    }
    if(right < x_length && !matrix[right][y].isFree()){
        walls.push(matrix[right][y]);
    }
    if(up > -1 && !matrix[x][up].isFree()){
        walls.push(matrix[x][up]);
    }
    if(down < y_length && !matrix[x][down].isFree()){
        walls.push(matrix[x][down]);
    }
    return walls
}

//This is knuth-shuffle by coolaj86 on github.com 
//https://github.com/coolaj86/knuth-shuffle

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

function generateMaze(){
    var starter_x = 1 + Math.floor((Math.random() * x_length) % (x_length - 2));
    var starter_y = 1 + Math.floor((Math.random() * y_length) % (y_length - 2));
    matrix[starter_x][starter_y].makeFree();
    //matrix[0][1].makeFree();
    //matrix[1][0].makeFree();
    //matrix[matrix.length-1][matrix.length-1].makeFree()
    //TODO draw maze
    
    //From Wikipedia
    //Start with a grid full of walls.
    //Pick a cell, mark it as part of the maze. Add the walls of the cell to the wall list.
    //While there are walls in the list:
    //    Pick a random wall from the list. If only one of the two cells that the wall divides is visited, then:
    //        Make the wall a passage and mark the unvisited cell as part of the maze.
    //        Add the neighboring walls of the cell to the wall list.
    //    Remove the wall from the list.
    walls = []
    walls = addAllWalls(starter_x, starter_y, walls)
	shuffle(walls)
    console.log("walls:"+ walls.length)
    //placeHolder = [starter_x, starter_y];
    //console.log(placeHolder)
    //console.log(walls.length)
	while(walls.length > 0){
        shuffle(walls)
		t = walls.pop()
        //if(!matrix[placeHolder[0]][placeHolder[1]].isFree() || !matrix[t.getX()][t.getY()].isFree()){
        //if(t.getX() > placeHolder[0]){
        //    matrix[t.getX() - 1][t.getY()].makeFree()
        //}
        //else if(t.getX() < placeHolder[0]){
        //    matrix[t.getX() + 1][t.getY()].makeFree()
        //}
        //else if(t.getY() > placeHolder[1]){
        //    matrix[t.getX()][t.getY() - 1].makeFree()
        //}
        //else if(t.getY() < placeHolder[1]){
        //    matrix[t.getX()][t.getY() + 1].makeFree()
        //} 
        //TODO I need to devise a means by which I
        //can have a referece either to the maze from
        //the new random cell, or from the random cell 
        //to the existing maze. 

        if(){ 
            matrix[t.getX()][t.getY()].makeFree()
        }
        placeHolder = [t.getX(), t.getY()]
        console.log(placeHolder)
        addAllWalls(t.getX(), t.getY(), walls)
        console.log((walls.length))
        //console.log(t)
	}
    drawMaze = true;
}

function gameLoop(timestamp){
    list = []
    update(list);
    render(list);
}

function update(list){
    matrix.forEach(function(el){
        el.forEach(function(ce){
            if(ce.getUpdateStatus()){
                list.push(ce);
               //console.log(ce.getX(), ce.getY())
            }
        })
    })
    if(myCell.getUpdateStatus()){
        list.push(myCell);
    }
}

function render(list){
    context.save();
    if(drawMaze){
        matrix.forEach(function(el){
            el.forEach(function(ce){
                ce.draw();
            })
        })
        drawMaze = false;
    }
    list.forEach(function(el){
        el.draw();
    })
    context.restore();
    requestAnimationFrame(gameLoop);
}
