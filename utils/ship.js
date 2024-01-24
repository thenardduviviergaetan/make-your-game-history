import { wave,Port,movements } from "../main.js"
let border
let score = 0
let hpBoss = 10
let tab = [`http://127.0.0.1:5500/assets/sprite/saucer1b.ico`,`http://127.0.0.1:5500/assets/sprite/saucer2b.ico`,`http://127.0.0.1:5500/assets/sprite/saucer3b.ico`,'http://127.0.0.1:5500/assets/sprite/BOSS.png']
let explodeSound = new Audio('./assets/explosion.mp3')
explodeSound.volume = 1
let shotSound = new Audio('./assets/shoot.wav')
shotSound.volume = 0.5
let xPlode = new Audio('./assets/bangLarge.wav')
xPlode.playbackRate = 0.25
xPlode.volume = 0.5
/**
 * Initialize the entire characteristics of the ship itself
 * @returns {HTMLImageElement} - The ship in a HTML Image Element format
 */
class Ship {
    constructor(){
        this.x = window.innerWidth/2-45/2,
        this.y = 0
        this.HTML = document.createElement('img')
        this.HTML.src = './assets/ship-space.png'
        this.HTML.id = 'ship'
        this.HTML.style.width = '45px'
        this.HTML.style.position = 'absolute'
        this.HTML.style.bottom= `${this.y}px`
        this.HTML.style.transform = `translateX(${this.x}px)`
        }
        scoreReset(){
            score = 0
        }
    initShip = async ()=> {
        document.body.appendChild(this.HTML)
    }
}

/**
 * Initialize the location from where the projectile will be shot
 * Initialization of the bullet shot by the ship 
 * @param {Class} owner - The shooter, where the projectile will be shot 
 * @returns {HTMLDivElement} - The projectile foramtted as a div
 */
class Projectile {

    constructor(x,y){
        this.x = x
        this.y = y
        this.posx = x+21
        this.posy = y+26
        this.HTML =document.createElement('div')
        this.HTML.id ='projectile'
        this.HTML.style.backgroundColor = 'white'
        this.HTML.style.position = 'absolute'
        this.HTML.style.width = '3px'
        this.HTML.style.height = '14px'
        this.HTML.style.transform = `translateX(${this.x}px)`
        this.HTML.style.bottom = `${this.y}px`
    }


/**
 * It handles the 'blink' animation when the boss is hit
 * @param {HTMLElement} html - the html element ot make blink
 */
    blink(html) {
        html.style.opacity = '0%'
        setTimeout(() => {
            html.style.opacity = '100%'
                setTimeout(() => {
                    html.style.opacity = '0%'
                        setTimeout(() => {
                        html.style.opacity = '100%'
                    }, 250);
                }, 250);
        }, 250);
    }

/**
 * Handling of the shooting functionnality and of the bullet reaching the target and 'exploding' (removing) it 
 */
    shoot =  ()=> {
         document.body.appendChild(this.HTML)
        //TODO: mettre des sons à boss qui meurt,tir et game over
        let invaders = document.querySelectorAll('.invader')
        if (wave.move) {
             invaders.forEach(elem=> {
                if (elem != null){
                    border = elem.getBoundingClientRect()
                }
                //if the bullet reaches one of the invaders, it removes the bullet and the invader
                if (window.innerHeight-border.bottom-15 <= this.posy && border.right >= this.posx && border.left <= this.posx && window.innerHeight-border.top>=this.posy && elem != null){
                if (elem.classList.contains('boss')){
                        if (tab.includes(elem.querySelector('img').src)){
                            hpBoss--
                            this.blink(elem)
                            explodeSound.load()
                            explodeSound.play()
                        }
                        if (hpBoss == 0) {
                                xPlode.load()
                                xPlode.play()
                                score+=10 
                                elem.querySelector('img').src = './assets/boss-explosion.gif'
                                setTimeout(() => {
                                    elem.remove()
                                    hpBoss = 10
                                }, 500);
                            }
                    }else {
                        if (tab.includes(elem.querySelector('img').src)){
                            score++ 
                                explodeSound.load()
                                explodeSound.play()
                           }
                        elem.querySelector('img').src = './assets/Explosion.png'
                        setTimeout(() => {
                            elem.remove()
                        }, 250);
                    } 
                    this.posx=this.x+21
                    this.posy = this.y
                    shotSound.play()
                }
                this.HTML.style.transform = `translate(${this.posx}px,-${this.posy}px)`
            })
            if (this.posy <= window.innerHeight){
            this.posy+=movements[3]
            //if the bullet misses and reach the top of the screen 
            }else {
            this.posx=this.x+21
            this.posy =this.y
            shotSound.play()
        }
        this.HTML.style.transform = `translate(${this.posx}px,-${this.posy}px)`
        }
    }
}

export{Ship,Projectile,score}