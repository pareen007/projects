let ship;
let invader = [];
let bullets = []


function setup(){
    createCanvas(600, 400);
    ship = new Ship();
    bullet = new Bullet(width / 2, height /2);
    for (let i = 0; i < 8; i++) {

        invader[i] = new Invaders(i*80 + 80, 60);
        
    }
}

function draw(){
    background(51);
    ship.show();
    for (let i = 0; i < bullets.length; i++) {
        bullets[i].show();
        bullets[i].move();
        for(let j = 0; j < invader.length; j++){
            if(bullets[i].hits(invader[j])){
                invader[j].grow();
                bullets[i].evaporate();
            }
        }
    }
    let right = false;

    for(let i = 0; i < invader.length; i++){
        invader[i].show();
        invader[i].move();
        if(invader[i].x > width){
            right = true;
        }
    }

    if(right){
        for(let i = 0; i < invader.length; i++){
            invader[i].shiftDown();
        }
    }

    for (let i = bullets.length - 1; i >= 0; i--) {
        if(bullets[i].toDelete){
            bullets.splice(i,1);
        } 
    }
   
}

function keyPressed(){
    if (key === ' '){
        let bullet = new Bullet(ship.x, height - 20)
        bullets.push(bullet)
    }
    if (keyCode === RIGHT_ARROW){
        ship.move(1);
    } else if(keyCode === LEFT_ARROW){
        ship.move(-1);
    }
}

class Ship{
    constructor(){
        this.x = width/2;
    }
    show(){
        fill(255);
        rectMode(CENTER)
        rect(this.x, height-20, 20, 20);
    }
    move(dir){
        this.x += dir * 5
    }
}

class Invaders{
    constructor(x,y){
        this.x = x;
        this.y = y;
        this.r = 5;

        this.xdir = 1;
    }

    show(){
        fill(255, 0, 200)
        rectMode(CENTER)
        ellipse(this.x, this.y, this.r * 2, this.r * 2);
    }

    grow(){
        this.r = this.r + 2;
    }
    shiftDown(){
        this.xdir += -1;
        this.y += this.r;

    }
    move(){
        this.x = this.x + this.xdir;
    }
}
class Bullet{
    constructor(x,y){
        this.x = x;
        this.y = y;
        this.r = 8;
        this.toDelete = false;
    }
    show(){
        noStroke();
        fill(255,255,255);
        ellipse(this.x, this.y, this.r * 2, this.r * 2)
    }
    move(){
        this.y = this.y - 5;
    }
    evaporate(){
        this.toDelete = true;

    }
    hits(invader){
        let d = dist(this.x, this.y, invader.x, invader.y)
        if(d < this.r + invader.r){
            return true;
        } else {
            return false;
        }
    }
}