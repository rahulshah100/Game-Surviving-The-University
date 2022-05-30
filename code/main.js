import kaboom from "kaboom"

// Had to use this as otherwise for oneclick as the modal of instruction is clicked to close, the instruction text from screen disappeared
let screenClickCount=0

// hides the text when screen is clicked
document.getElementsByTagName("body")[0].addEventListener("click",function(){
  if(screenClickCount==1){
    strt.className="hideInstruction"
  }
  else{
    screenClickCount+=1
  }
})

// Initialize context
kaboom({
  font: "sink",
  background: [210, 210, 155]
})


// Lets load the Sprites
loadSprite("rk", "sprites/rk.png");
loadSprite("money", "sprites/money.png");
loadSprite("Books", "sprites/Books.png");
loadSprite("Bg", "sprites/Bg.png")


const bgImage= add([
  sprite("Bg"), //renders as a sprite
  pos(width() / 2, height() / 2),
    origin("center"),
    // Allow the background to be scaled
    scale(1),
    // Keep the background position fixed even when the camera moves
    fixed()
])

bgImage.scaleTo(Math.max(
    width() / 600,
    height() / 400
));

// Lets load the Music
loadSound("Backgroundmusic", "sounds/Backgroundmusic.mp3");
loadSound("points", "sounds/points.wav");
loadSound("no", "sounds/no.mp3");
loadSound("childyell", "sounds/childyell.mp3");
loadSound("GameOver", "sounds/GameOver.mp3");


// Lets define game variables
let SPEED = 270
let BSPEED = 2
let SCORE = 0
let scoreText;
let bg=false;
let backgroundMusic;
let collisionText;
let collisionCount=0;


// Lets define a function to display our score
const displayScore=()=>{
  destroy(scoreText)
  scoreText=add([
    text("Score:"+SCORE),
    scale(2),
    pos(width()-181, 21),
  ])    
}

const displayCollisions=()=>{
  destroy(collisionText)
  collisionText=add([
    text("Collisions:"+collisionCount),
    scale(2),
    pos(width()-181, 51),
  ])
}

// Lets add the player
const player = add([
  sprite("rk"), //renders as a sprite
  pos(100, 40), //position in world
  scale(0.37),
  area(), //gives it a collider area, so we can check for collisions with other characters later on
])

// Add events to our player
onKeyDown("left",()=>{
  playBg()
  player.move(-SPEED,0)
})

onKeyDown("right",()=>{
  playBg()
  player.move(SPEED,0)
})

onKeyDown("up",()=>{
  playBg()
  player.move(0,-SPEED)
})

onKeyDown("down",()=>{
  playBg()
  player.move(0,SPEED)
})


// Lets add specified number book sets and a pack of cash on loop
setInterval(()=>{
  let NumBooks=3
  for (let i=0; i<NumBooks; i++){
    let x=rand(0,width())
    let y=height()

    let c=add([
      sprite("Books"), 
      pos(x, y),
      scale(0.09),
      area(),
      "books"
    ])
    
    c.onUpdate(()=>{
      c.moveTo(c.pos.x, c.pos.y-BSPEED)
    })
  }
  
  let x=rand(0,width())
  let y=height()

  let c=add([
    sprite("money"), 
    pos(x, y),
    scale(0.4),
    area(),
    "money"
  ])

  c.onUpdate(()=>{
      c.moveTo(c.pos.x, c.pos.y-BSPEED)
  })
  if(BSPEED<10){
    BSPEED+=0.7    
  }
  if(SPEED<600){
    SPEED+=30  
  }
}, 2000)

player.onCollide("books",(books, money)=>  {
  if(typeof backgroundMusic!='undefined'){  
    backgroundMusic.volume(0.2)
  }
  if(collisionCount>=3){
    play("GameOver")
    destroy(player)
    addKaboom(player.pos)
    scoreText=add([
      text("Game Over"),
      scale(3),
      pos(10, 21),
      color(10,10,255)          
    ])
    wait(2,()=>{
        alert("Reload to play again")  
        window.location.reload()
    })    
  }
  addKaboom(player.pos)
  collisionCount+=1
  if(typeof backgroundMusic!='undefined'){  
    backgroundMusic.volume(0.2)
  }
  play("no", {volume:0.6})
  displayCollisions()
  if(typeof backgroundMusic!='undefined'){  
    wait(3,()=>{
      backgroundMusic.volume(0.5)
    })
  }    
})

player.onCollide("money",(money)=>  {
  if(typeof backgroundMusic!='undefined'){  
    backgroundMusic.volume(0.2)
  }
  play("points")
  destroy(money)
  SCORE+=1
  displayScore()
  if(typeof backgroundMusic!='undefined'){  
    wait(3,()=>{
      backgroundMusic.volume(0.5)
    })  
  }  
})


const playBg=()=>{
  if(!bg){
    backgroundMusic=play("Backgroundmusic", {loop:true, volume:0.5})
    bg=true
  }
}


displayScore()
displayCollisions()