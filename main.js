import {Ship,Projectile,score} from "./utils/ship.js";
import { Wave } from "./utils/enemies.js";
import { menuInit, throttle} from "./utils/utilsFunc.js";
import { loadScreen,bool,Hz} from "./utils/loadScreen.js";
// import { getScreenRefreshRate } from "./utils/requestHz.js";
//TODO: FAIRE DES BONUS DE RAPID FIRE (on rajoute des shoot()) et rapid movement on rajoute des moveship() ET UN KONAMI CODE
//** Initialization of all the global variables */
let Pause = false
let fps = false
let rightPressed,leftPressed
let movements = []
let waveNb = 1
let ship = new Ship
let wave = new Wave(4,10,false) // need to be more or equal to boss size
const Port = "5500"
let audio = new Audio('./assets/music.mp3')
audio.volume =0.5
let shotSound = new Audio('./assets/shoot.wav')
shotSound.volume = 0.5
let r = new Audio('./assets/boom.mp3')
r.volume = 1

const hertzChecker =  (Hz)=> {
    let movementShip,movementWave,ennemyShot,movementShot
        if (Hz == 60) {
                movementShip = 7
                movementWave = 2
                ennemyShot = 3
                movementShot = 7
        } else if (Hz == 240) {
                movementShip = 1.5
                movementWave = 0.8
                ennemyShot = 0.75
                movementShot = 1.5
        } else if (Hz == 144){
                movementShip = 3
                movementWave = 1.2
                ennemyShot = 1.5
                movementShot = 3
        }
        let int = setInterval(() => {
            if (movementShip !== undefined && movementWave !== undefined &&movementShip !== '' && movementWave !== '' ) {
                clearInterval(int)
                movements.push(movementShip)
                movements.push(movementWave)
                movements.push(ennemyShot)
                movements.push(movementShot)
                fps = true
            }
        },1);
}

Pause = loadScreen(Pause)

/**
 * @returns {Array}
 */

let game = document.getElementById('game')
game.appendChild(wave.HTML)

/**The initialization of the moving ship */
await ship.initShip()

//** Listener for the key pressed */
document.addEventListener('keydown',  (key)=> {
    if (key.key == 'd' )rightPressed = true
    if (key.key == 'q' )leftPressed = true
    if (key.key == 'D' )rightPressed = true
    if (key.key == 'Q' )leftPressed = true
    if (key.key == 'Escape'){
        Pause = !Pause
        pauseMenu()
    }
})

//** Listener for the key released */
document.addEventListener('keyup', (key)=> {
    if (key.key == 'd' ) rightPressed = false
    if (key.key == 'q' ) leftPressed = false
    if (key.key == 'D' ) rightPressed = false
    if (key.key == 'Q' ) leftPressed = false
})


/**
 * A function that handles X coordinates of the ship
 */

let bullet = new Projectile(ship.x,ship.y)
const moveShip =  ()=> {
    if (!wave.move) return
    ship.HTML =  document.getElementById('ship')
    if (ship.x>=document.getElementById('score').getBoundingClientRect().right && leftPressed) ship.x-=movements[0]
    if (ship.x <= window.innerWidth-56 && rightPressed) ship.x+=movements[0]
    bullet.x = ship.x
     ship.HTML.style.transform = `translateX(${ship.x}px)`
}

/** Handles the automatic refresh of the score */
setInterval(() => {
    let scoreCount = document.getElementById('score')
    scoreCount.textContent = `Score : ${score}`
    let waveCount = document.getElementById('wavenb')
    waveCount.textContent = `Wave : ${waveNb}`
    if (Pause){
        wave.move = false
    } else {
        wave.move = true
    }
}, 100);


/** Handles the timer with a precision of 10 milliseconds */

let min=0,sec=0,milli=0
const timer = ()=> {
    setInterval(() => {
        if (!Pause) {
        milli +=10
        if (milli == 1000) {
            sec++
            milli = 0
        }
        if (sec == 60){
            min++
            sec = 0
        }

            let timerStamp = document.getElementById('timer')
            timerStamp.textContent = `Time played : ${min}'${sec}"${milli}`
            if (window.innerWidth < 1000) {
                timerStamp.style.fontSize = 'small'
                document.getElementById('score').style.fontSize = 'small'
                document.getElementById('wavenb').style.fontSize = 'small'
            } else {
                timerStamp.style.fontSize = 'large'
                document.getElementById('score').style.fontSize = 'large'
                document.getElementById('wavenb').style.fontSize = 'large'
            }
        }
    }, 10);
}
timer()
/**
 * Handles the 'Pause' functionnality where there is a 'Resume' and 'Restart' choices
 */

menuInit()
const pauseMenu = ()=> {
    // it "asks" to the listener above if the escape key has been pressed, if it pressed then it enters in this condition block 
    if (Pause) {
        document.getElementById('menu').style.opacity = '100%'
        audio.pause()
        // listener for the clickable button Resume, it inverts the value of Pause boolean, works like a 'toggle' for the pause menu to showup
        
            document.getElementById('resume').addEventListener('click', ()=> {
                document.getElementById('menu').style.opacity = '0%'
                Pause = false
                audio.play()
            })
        

        // listener for the clickable button Restart, it refresh the wave to a freshly new, and reset all timers and score
        document.getElementById('restart').addEventListener('click',()=> {
            location.reload()
        })
        return menu
        // if we were already on pause, it delete the menu to resume the current game 
    } else {
        audio.play()
        if (document.getElementById('menu') !== null)document.getElementById('menu').style.opacity = '0%'
    }
}
wave.bossInit()
wave.overinit()
/** 
 * Handles the launch of the entire program, with the 60 fps functionnality without any framerate dropping 
*/
function Game(){
    // if this is a game over
    if (wave.tick()){
        Pause = true
        pauseMenu()
        document.getElementById('resume').style.opacity = '0%'
    }
    //FIXME: waveNb % qui ne marche pas
    let invaders = document.querySelectorAll('.invader')
     
    if (waveNb%2 != 0 && invaders.length == 0 && Pause == false) {
        waveNb++
        Pause = true
        movements[0]+=0.2
        movements[1]+=1
        movements[2]+=1
        movements[3]+=0.5
        document.getElementById('PROMPT').style.animation = 'typing 3s steps(29)  normal both, blink .8s infinite normal'
        document.getElementById('PROMPT').style.opacity = '100%'
        throttle(setTimeout(() => {
            document.getElementById('PROMPT').style.animation = ''
            document.getElementById('PROMPT').style.opacity = '0%'
            Pause = false
            wave.reset(true)
        }, 3500),4000,true)
        
    }else if (invaders.length == 0 && waveNb%2 == 0 && Pause == false){
        movements[0]+=0.2
        movements[1]+=1
        movements[2]+=1
        movements[3]+=0.5
        waveNb++
        wave.reset()
    }
    //for testing only
    for (let rep = 0; rep < 1; rep++) bullet.shoot();
    for (let rep = 0; rep < 1; rep++) moveShip()
    requestAnimationFrame(Game)
}
let loaded = setInterval(() => {
    if (bool){
        hertzChecker(Hz)
        if (fps){
            clearInterval(loaded)
            audio.loop = true
                    audio.volume =0.5
                    audio.play()
                    shotSound.play()
                    Pause = !Pause
                    if (document.getElementById('load') != null) document.getElementById('load').remove()
                    Game()
        }
        }
}, 100);



var k = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65],
n = 0;
document.addEventListener('keydown',(e) => {
    if (e.keyCode === k[n++]) {
        if (n === k.length) {
            audio.pause()
            
            r.play()
            n = 0;
            return false;
        }
    }
    else {
        n = 0;
    }
});


export {wave,Port,movements}