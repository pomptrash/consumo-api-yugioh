const imgCarta = document.querySelector("#imgCarta")
const inputCarta = document.querySelector("#inputCarta")
const datalist = document.querySelector('datalist')
const detalhes = document.querySelector("#detalhes")
const id = document.querySelector("#id")
const nome = document.querySelector("#nome")
const tipo = document.querySelector("#tipo")
const atk = document.querySelector("#atk")
const def = document.querySelector("#def")
const level = document.querySelector("#level")
const raca = document.querySelector("#raca")
const atributo = document.querySelector("#atributo")
const desc = document.querySelector("#desc")
const cartaAleatoria = document.querySelector("#cartaAleatoria")
const pesquisar = document.querySelector("#pesquisar")
const clearInputIcon = document.querySelector("#clearInputIcon")

// FUNÇÃO PARA DEFINIR OS VALORES DOS ATRIBUTOS NO HTML DE ACORDO COM A CARTA
function setValues(carta) {
    imgCarta.src = carta["card_images"][0]["image_url"]
    id.innerText = `#${carta.id}`
    nome.innerText = carta.name 
    tipo.innerText = carta.type
    atk.innerText = carta.atk && carta.atk>=0? carta.atk:'-'
    def.innerText = carta.def && carta.def>=0? carta.def:'-'
    level.innerText = carta.level && carta.level>=0? carta.level:'-'
    raca.innerText = carta.race? carta.race : '-'
    atributo.innerText = carta.attribute? carta.attribute:'-'
    desc.innerText = carta.desc
}

// CONSUMO DA API
async function consumirApi(){
    const response = await fetch('https://db.ygoprodeck.com/api/v7/cardinfo.php?language=pt')
    return response.json()
}

consumirApi().then(dados => {
    const cartas = dados.data
    
    // BOTÃO DE CARTA ALEATÓRIA 
    // VALOR RANDÔMICO PASSADO COMO ÍNDICE PARA RETORNAR UMA CARTA ALEATÓRIA
    cartaAleatoria.addEventListener('click', e=> {
        const randomCard = cartas[randomizer(cartas.length)]
        setValues(randomCard)
    })

    // LOOP PARA ALIMENTAR O DATALIST E SUGERIR NOMES DAS CARTAS DURANTE A PESQUISA 
    cartas.forEach(carta => {
        const option = document.createElement('option')
        option.setAttribute("value", carta.name)
        datalist.appendChild(option)
    
        // BOTÃO DE PESQUISA
        pesquisar.addEventListener("click", e=>{
            if (carta.name.toUpperCase() == inputCarta.value.toUpperCase()){
                setValues(carta)
            }   
        })
    })

    // ÍCONE PARA LIMPAR O INPUT
    clearInputIcon.addEventListener('click', e=>{
        inputCarta.value = ""
    })
})

// GERAR UM VALOR ALEATÓRIO PARA UTILIZAR COMO ÍNDICE
function randomizer(length){
    const randomIndex = Math.floor(Math.random() * length)
    return randomIndex
}
