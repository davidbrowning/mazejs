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
    else if(event.keyCode == 80){
        var x = myCell.getX()
        var y = myCell.getY()
        solveMaze(x, y)
    }
//    createWall();
})



function cell(spec){
    let that = {};
    
    that.getX = function(){
        return spec.mx_x;
    }
    that.getY = function(){
        return spec.mx_y;
    }
    that.setPath = function(){
        spec.color = 'rgb(0,200,100)'
        spec.updateMe = true;
    }

    that.isFree = function(){
        return spec.empty;
    }
    that.makeFree = function(){
        spec.empty = true
        spec.color = 'rgb(250,250,250)'
        spec.updateMe = true;
    }
    that.makeEnd = function(){
        spec.empty = true
        spec.color = 'rgb(10,100,200)'
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
        if(spec.crumbs){
            var startPoint = (Math.PI/180)*0;
            var endPoint = (Math.PI/180)*360;
            context.arc(spec.position.x+25, spec.position.y+25,5,startPoint,endPoint,true);
            context.closePath();
            if(breadcrumb){
                context.fill();
            }
        }
        context.fillStyle = spec.color;
        context.fillRect(spec.position.x,spec.position.y,spec.c_width,spec.c_height);
        spec.updateMe = false;
    }
    that.setVisited = function(){
        spec.visited = true;
    }
    that.isVisited = function(){
        return spec.visited;
    }
    that.getUpdateStatus = function(){
        return spec.updateMe;
    }
    
    return that;
}





function init(){
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
        updateMe: true,
        crumbs: true
    })
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

function solveMaze(x, y){
    console.log('x',x)
    console.log('y',y)
    my_x = x
    my_y = y
    end_x = x_length -1
    end_y = y_length -1
    solution = []
    path = []
    while(x !== end_x || y !== end_y){
        matrix[x][y].setVisited()
        matrix[x][y].setPath()
        addAllSpaces(x,y,path,solution)
        next = path.pop()
        x = next.getX()
        y = next.getY()
    }
    solution.forEach(function(el){
        matrix[el.getX()][el.getY()].setPath()    
    })
    
    console.log('finished')
}

function addAllSpaces(x, y, walls, solve){
    var left = x-1
    var right = x+1
    var up = y-1
    var down = y+1
    if((left > -1 )&& (matrix[left][y].isFree()===true)){
        if(!matrix[left][y].isVisited()){
            walls.push(matrix[left][y]);
            solve.push(matrix[left][y]);
        }
    }
    if((right < x_length) && (matrix[right][y].isFree()===true)){
        if(!matrix[right][y].isVisited()){
            walls.push(matrix[right][y]);
            solve.push(matrix[right][y]);
        }
    }
    if((up > -1) && (matrix[x][up].isFree()===true)){
        if(!matrix[x][up].isVisited()){
            walls.push(matrix[x][up]);
            solve.push(matrix[x][up]);
        }
    }
    if((down < y_length) && (matrix[x][down].isFree()===true)){
        if(!matrix[x][down].isVisited()){
            walls.push(matrix[x][down]);
            solve.push(matrix[x][down]);
        }
    }
    console.log('walls.length',walls.length)
    return walls
}

function addAllWalls(x, y, walls){
    var left = x-1
    var right = x+1
    var up = y-1
    var down = y+1
    if(left > 0 && !matrix[left-1][y].isFree() ){
        walls.push(matrix[left][y]);
    }
    if(right < x_length-1 && !matrix[right+1][y].isFree()){
        walls.push(matrix[right][y]);
    }
    if(up > 0 && !matrix[x][up-1].isFree()){
        walls.push(matrix[x][up]);
    }
    if(down < y_length-1 && !matrix[x][down+1].isFree()){
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

function getAdjacentCell(adj, existingMaze, t){
    //Will revisit this idea
}
function makePath(axis, direction, t){
    if(axis == 'x'){
        if(direction == 'left'){
            if(!matrix[t.getX()-1][t.getY()].isFree()){
                matrix[t.getX()][t.getY()].makeFree();
                matrix[t.getX()-1][t.getY()].makeFree();
            }
        }
        else if(!matrix[t.getX()+1][t.getY()].isFree()){
            matrix[t.getX()][t.getY()].makeFree();
            matrix[t.getX()+1][t.getY()].makeFree();
        }
    }
    else if(axis == 'y'){
        if(direction == 'up'){ 
            if(!matrix[t.getX()][t.getY()-1].isFree()){
                matrix[t.getX()][t.getY()].makeFree();
                matrix[t.getX()][t.getY()-1].makeFree();
            }
        }
        else if(!matrix[t.getX()][t.getY()+1].isFree()){
            matrix[t.getX()][t.getY()].makeFree();
            matrix[t.getX()][t.getY()+1].makeFree();
        }
    }
}

function generateMaze(){
    var starter_x = 1 + Math.floor((Math.random() * x_length) % (x_length - 2));
    var starter_y = 1 + Math.floor((Math.random() * y_length) % (y_length - 2));
    matrix[starter_x][starter_y].makeFree();
    var existingMaze = []
    existingMaze.push(matrix[starter_x][starter_y])
    walls = []
    walls = addAllWalls(starter_x, starter_y, walls)
	shuffle(walls)
    console.log("walls:"+ walls.length)
	while(walls.length > 0){
        shuffle(walls)
		t = walls.pop()
        if(walls.length > 500){
            break;
        }
        var mazeMemberCell;
        if(t.getX() > 0 && t.getX() < x_length-1){
            if(t.getY() > 0 && t.getY() < y_length-1){
                if(matrix[t.getX() -1][t.getY()].isFree()){
                    makePath('x','right', t);
                    addAllWalls(t.getX()+1, t.getY(), walls)
                }
                else if(matrix[t.getX()+1][t.getY()].isFree()){
                    makePath('x', 'left', t);
                    addAllWalls(t.getX()-1, t.getY(), walls)
                }
                else if(matrix[t.getX()][t.getY()-1].isFree()){
                    makePath('y', 'down', t);
                    addAllWalls(t.getX(), t.getY()+1, walls)
                }
                else if(matrix[t.getX()][t.getY()+1].isFree()){
                    makePath('y', 'up', t);
                    addAllWalls(t.getX(), t.getY()-1, walls)
                }
            }
        }
        placeHolder = [t.getX(), t.getY()]
        console.log(placeHolder)
        console.log((walls.length))
	}
    freeUpEnds();
    drawMaze = true;
}

function freeUpEnds(){
    //TODO Make start and beginning accessible
    if(!matrix[0][1].isFree() && !matrix[1][0].isFree()){        
        var i = 1
        var j = 0
        matrix[j][i].makeFree()
        while(!matrix[j+1][i].isFree() && !matrix[j][i+1].isFree()){
            var xory = Math.floor((Math.random() * 2) % 2);
            if(xory == 1){
                j+=1
            }
            else{
                i+=1
            }
            matrix[j][i].makeFree()
        }
    }
    if(!matrix[x_length -1][y_length-2].isFree() && !matrix[x_length -2][y_length-1].isFree()){        
        var i = y_length-1
        var j = x_length-2
        matrix[j][i].makeFree()
        while(!matrix[j-1][i].isFree() && !matrix[j][i-1].isFree()){
            var xory = math.floor((math.random() * 2) % 2);
            if(xory == 1){
                j-=1
            }
            else{
                i-=1
            }
            matrix[j][i].makeFree()
        }
    }
    matrix[x_length-1][y_length-1].makeEnd()
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
