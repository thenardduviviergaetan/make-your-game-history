let bool1 = false
let bool = false
let Hz
const loadScreen = (Pause)=> {
    
    let loadAll = document.createElement('div')
    loadAll.classList.add('containerLoad')
    let load = document.createElement('div')
    load.id = 'load'
    load.style.width = `100%`
    load.style.height = `100%`

    let intro = document.createElement('div')
    intro.id= 'intro'
    let prompt = document.createElement('p')
    prompt.id = 'prompt'
    prompt.innerHTML = 'Hello almighty fighter ! We need your help to eradicate those aliens ! They want to destroy our universe by all needs... Hope you\'ll be brave enough to kill\'em all ! Good luck comrad. '
    prompt.style.display = 'none'
    setTimeout(() => {
        prompt.style.display = ''
    },1500);
    let asteroid = document.createElement('img')
    asteroid.id = "asteroid"
    asteroid.src = '../assets/asteroid.png'


    let fpsContainer = document.createElement('div') 
    fpsContainer.id = 'contFPS'

    let txt = document.createElement('p')
    txt.textContent = 'Choose your refresh rate before playing !'
    txt.id = 'txt'
    let fps1 = document.createElement('button')
    let fps2 = document.createElement('button')
    let fps3 = document.createElement('button')
    fps1.classList.add('fps')
    fps1.textContent = '60 Hz'
    fps1.value = '60'
    fps2.classList.add('fps')
    fps2.textContent = '120-165 Hz'
    fps2.value = '144'
    fps3.classList.add('fps')
    fps3.textContent = '240 Hz'
    fps3.value = '240'
    fps1.addEventListener('click', ()=> {
        Hz = Number(fps1.value)
        bool1 = true
        play.disabled = false
    })
    fps2.addEventListener('click', ()=> {
        Hz = Number(fps2.value)
        bool1 = true
        play.disabled = false
    })
    fps3.addEventListener('click', ()=> {
        Hz = Number(fps3.value)
        bool1 = true
        play.disabled = false
    })


    let play = document.createElement('button')
    play.id='play'
    play.textContent = 'Play !'
    play.disabled = true

    intro.appendChild(asteroid)
    intro.appendChild(prompt)
    load.appendChild(intro)
    fpsContainer.appendChild(txt)
    fpsContainer.appendChild(fps1)
    fpsContainer.appendChild(fps2)
    fpsContainer.appendChild(fps3)
    load.appendChild(fpsContainer)
    load.appendChild(play)
    loadAll.appendChild(load)
    document.body.appendChild(loadAll)
    
    return !Pause
}

let i = setInterval(() => {
    if (bool1) {
        document.getElementById('play').addEventListener('click', ()=> {
            bool = true
            clearInterval(i)
        })
    }
}, 100);

export {loadScreen,bool,Hz}