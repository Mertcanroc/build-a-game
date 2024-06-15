
const cursor = document.querySelector(".cursor")
const holes = [...document.querySelectorAll(".hole")]
const scoreEL = document.querySelector(".score span")
let score = 0

//Whack audio
const sound = new Audio("img/smash.mp3");


function run(){
    const i = Math.floor(Math.random() * holes.length)
    const hole = holes[i]
    let timer = null

    const img = document.createElement("img")
    img.classList.add("mole")
    img.src = "img/mole.png"

    // De score
    img.addEventListener("click", () => {
        score += 5
        sound.play()
        scoreEL.textContent = score
        img.src = "img/whacked.png"
        timer = setTimeout(() => {
            hole.removeChild(img)
            run()
        }, 500)
    })

    hole.appendChild(img)

// snelheid van de moles
    timer = setTimeout(() => {
        hole.removeChild(img)
        run()
    }, 950)
};
run()

// de beweging van je cursor
window.addEventListener("mousemove", e => {
    cursor.style.top = e.pageY + "px"
    cursor.style.left = e.pageX + "px"
});

window.addEventListener("mousedown", () => {
    cursor.classList.add("active")
});

window.addEventListener("mouseup", () => {
    cursor.classList.remove("active")
});