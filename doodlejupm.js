
let board;
let boardwidth= 360;
let boardheight= 576;
let context;


let doodlerwidth = 46;
let doodlerheight = 46;
let doodlerX = boardwidth/2 - doodlerwidth/2
let doodlerY = boardheight*7/8 - doodlerheight;
let doodlerRight;
let doodlerLeft;


let doodler = {
    img: null,
    x: doodlerX,
    y: doodlerY,
    width : doodlerwidth,
    height : doodlerheight
}

let score=0;
let maxscore=0;
let gameover = false;


let velocityX = 0;
let velocityY =0;
let initialVelocityY = -6;
let gravity = 0.3;


let platformarray = [];
let platformwidth = 60;
let platformheight = 18;
let platformimg; 


window.onload= function()  {
    board = document.getElementById("board");
    board.height=boardheight;
    board.width=boardwidth;
    context= board.getContext("2d"); 

    
    doodlerRight = new Image();
    doodlerRight.src = "./doodler-right.png";
    doodler.img=doodlerRight;
    doodlerRight.onload=function(){
    context.drawImage(doodler.img , doodler.x , doodler.y , doodler.width , doodler.height);
    }
    doodlerLeft = new Image();
    doodlerLeft.src = "./doodler-left.png";

    platformimg = new Image();
    platformimg.src = "./platform.png";

    velocityY = initialVelocityY;

    placePlatforms();

    requestAnimationFrame(update);

    document.addEventListener("keydown" , movedoodler);
    
}


function update(){
    requestAnimationFrame(update);

    if (gameover) {
        return;

    }
    context.clearRect(0,0,board.width , board.height);

    
    doodler.x += velocityX;
    if (doodler.x>boardwidth){
        doodler.x=0;
    }

    else if (doodler.x + doodler.width < 0 ){

        doodler.x = boardwidth;
    }
     velocityY += gravity;
     doodler.y += velocityY;
     if (doodler.y > board.height){
        gameover = true;
     }

    context.drawImage(doodler.img , doodler.x , doodler.y , doodler.width , doodler.height);

     for (let i=0;i<platformarray.length;i++){
        let platform = platformarray[i]; 
        if (velocityY < 0 && doodler.y < boardheight*3/4){
            platform.y -= initialVelocityY;
        }
        if (detectCollision(doodler,platform) && velocityY >=0){
            velocityY = initialVelocityY;
        }
        context.drawImage(platform.img, platform.x ,platform.y, platform.width , platform.height);
     }

    
     while (platformarray.length>0 && platformarray[0].y >= boardheight) {
        platformarray.shift();
        newPlatform(); //replacing with new platform on top

     }

     
     updateScore();
     context.fillStyle="white";
     context.font ="16px sans-serif";
     context.fillText(score , 5, 20);

     if (gameover){
        context.fillText("Game Over : Press 'Space' to Restart", boardwidth/7 , boardheight*7/8)
     }

    }


function movedoodler(e) {

    if(e.code == "ArrowRight" || e.code == "KeyD") {  //move right
     velocityX = 4;
     doodler.img = doodlerRight;   
    }

    else if(e.code == "ArrowLeft" || e.code == "KeyA")   //move left
    {
        velocityX = -4;
        doodler.img = doodlerLeft;  }

        else if (e.code=="Space" && gameover)
        {
             doodler = {
                img: doodlerRight,
                x: doodlerX,
                y: doodlerY,
                width : doodlerwidth,
                height : doodlerheight
            
            }

            velocityX=0;
            velocityY= initialVelocityY;
            score=0;
            maxscore=0;
            gameover=false;
            placePlatforms();
       }
}



function placePlatforms(){
    platformarray = [];

     let platform = {
        img: platformimg,
         x : boardwidth/2,
         y : boardheight - 50,
        width : platformwidth,
        height : platformheight
 }

     platformarray.push(platform);

   /* platform = {
        img: platformimg,
        x : boardwidth/2,
        y : boardheight - 150,
        width : platformwidth,
        height : platformheight
    }

    platformarray.push(platform);*/

    for (let i=0; i<6; i++){
        let randomX= Math.floor(Math.random() * boardwidth*3/4);

        let platform = {
            img: platformimg,
             x : randomX,
             y : boardheight - 75*i - 150,
            width : platformwidth,
            height : platformheight
     }
    
         platformarray.push(platform);
    }
}

    function newPlatform(){
        let randomX= Math.floor(Math.random() * boardwidth*3/4);

        let platform = {
            img: platformimg,
             x : randomX,
             y : -platformheight,
            width : platformwidth,
            height : platformheight
     }
    
         platformarray.push(platform);
    }

    

function detectCollision(a,b){
    return a.x<b.x + b.width &&
           a.x + a.width > b.x &&
           a.y<b.y + b.height &&
           a.y+a.height >b.y;


}


function updateScore(){
    let points = Math.floor(50*Math.random());
    if(velocityY <0){
        maxscore +=  points;
        if (score<maxscore){
            score = maxscore;
        }
    }

    else if (velocityY>0){
    maxscore -=points;
    }
}
