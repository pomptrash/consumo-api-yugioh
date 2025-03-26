const imgCarta = document.querySelector("#imgCarta")
const inputCarta = document.querySelector("#inputCarta")
const datalist = document.querySelector('datalist')
const deckCartasSection = document.querySelector("#deckCartasSection")
const deckCartasContainer = document.querySelector('.deckCartasContainer')
const deckAmout = document.querySelector('#deckAmout')
const deckAtkAmount = document.querySelector('#deckAtkAmount')
const deckDefAmount = document.querySelector('#deckDefAmount')

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

const btnCartaAleatoria = document.querySelector("#btnCartaAleatoria")
const btnPesquisar = document.querySelector("#btnPesquisar")
const clearInputIcon = document.querySelector("#clearInputIcon")
const btnAdicionarDeck = document.querySelector("#btnAdicionarDeck")
const btnVerDeck = document.querySelector("#btnVerDeck")

let atk_total = 0
let def_total = 0
let cartaAtual = 0
const deckCartas = []
getDeckLocalStorage(deckCartas)
setDeckStats()

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
    cartaAtual = carta
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
    btnCartaAleatoria.addEventListener('click', e=> {
        const randomCard = cartas[randomizer(cartas.length)]
        deckCartasContainer.classList.add('displayDeck')
        setValues(randomCard)
        deckCartasContainer.classList.add('displayDeck')
        verifyDisplayDeckt()
    })

    // LOOP PARA ALIMENTAR O DATALIST E SUGERIR NOMES DAS CARTAS DURANTE A PESQUISA 
    cartas.forEach(carta => {
        const option = document.createElement('option')
        option.setAttribute("value", carta.name)
        datalist.appendChild(option)
    
        // BOTÃO DE PESQUISA
        btnPesquisar.addEventListener("click", e=>{
            if (carta.name.toUpperCase() == inputCarta.value.toUpperCase()){
                setValues(carta)
                deckCartasContainer.classList.add('displayDeck')
                verifyDisplayDeckt()
            }   
        })
    })

    // ADICIONAR CARTA ATUAL NO DECK DE CARTAS
    btnAdicionarDeck.addEventListener('click', e=>{
        if(cartaAtual){
            if (deckCartas.includes(cartaAtual)){
                if (confirm(`A carta '${cartaAtual.name}' já existe no seu deck. Deseja adicionar mesmo assim?`)){
                    pushToDeck(cartaAtual, deckCartas)
                }
            } else {
                pushToDeck(cartaAtual, deckCartas)
            }
        } else {
            alert("Escolha uma carta.")
        }
    })

    // ÍCONE PARA LIMPAR O INPUT
    clearInputIcon.addEventListener('click', e=>{
        inputCarta.value = ""
        inputCarta.focus()
    })
})

// GERAR UM VALOR ALEATÓRIO PARA UTILIZAR COMO ÍNDICE
function randomizer(length){
    const randomIndex = Math.floor(Math.random() * length)
    return randomIndex
}

// FUNÇÃO PARA ADICIONAR CARTA AO ARRAY DECK E CRIAR ELEMENTOS HTML NO CONTAINER DECK DE CARTAS
function pushToDeck(carta, deck){
    if(deck.length < 15){
        deck.push(carta)
        setDeckStats()
        alert("Carta adicionada ao deck.")
        saveDeckLocalStorage(deckCartas)
        deckCartasContainer.classList.add('displayDeck')
        verifyDisplayDeckt()
    } else {
        alert("Deck cheio. (Máximo de 15 cartas)")
    }
}

// FUNÇÃO PARA REMOVER UMA CARTA DO DECK
function removeFromDeck(carta, deck){
    deck.splice(deck.indexOf(carta), 1)
    setDeckStats()
    alert("Carta removida.")
    saveDeckLocalStorage(deck)
}

// BOTÃO PARA CHAMAR A FUNÇÃO E MOSTRAR AS CARTAS
btnVerDeck.addEventListener('click', e=>{
    mostrarDeck(deckCartas)
})

// FUNÇÃO PARA MOSTRAR O DECK DE CARTAS NO CONTAINER DESTINADO
function mostrarDeck(deck){
    deckCartasSection.innerHTML = ''
    deckCartasContainer.classList.toggle('displayDeck')
    verifyDisplayDeckt()
    if (deck.length > 0){
        deck.forEach(carta => {            
            // CRIANDO O ELEMENTO HTML PARA CADA CARTA DO DECK
            const card = document.createElement('div')
            card.setAttribute('id', carta.id)
            card.classList.add('card', 'cardDeck', 'bg-primary')
            card.classList.add('d-flex', 'align-items-center', 'p-1')

            const imgCartaDeck = document.createElement('img')
            imgCartaDeck.setAttribute('alt', 'YuGiOh card')
            imgCartaDeck.setAttribute('id', carta.id)
            imgCartaDeck.src = carta["card_images"][0]["image_url"]
            imgCartaDeck.classList.add('imgCartaDeck', 'card-img-top')

            const removeCardIcon = document.createElement('i')
            removeCardIcon.classList.add('bi', 'bi-trash3', 'text-light', 'p-1')
            removeCardIcon.style.textShadow = 'none'
            removeCardIcon.style.cursor = 'pointer'
            
            // ADICIONANDO OS ELEMENTOS CRIADO À SECTION DECK DE CARTAS
            card.appendChild(imgCartaDeck)
            card.appendChild(removeCardIcon)
            deckCartasSection.append(card)
    
            // MOSTRA OS DETALHES DA CARTA CLICADA
            imgCartaDeck.addEventListener('click', e=>{
                setValues(carta)
            })
    
            // REMOVE A CARTA AO DAR UM DUPLO CLIQUE
            removeCardIcon.addEventListener('click', e=>{
                if (confirm(`Tem certeza que deseja remover a carta '${carta.name}' do seu deck?`)){
                    removeFromDeck(carta, deck)
                    deckCartasSection.removeChild(e.target.closest('div'))
                }
            })
        })
    } else {
        alert('Deck vazio.')
    }
}

// FUNÇÃO PARA VERIFICAR O ESTADO DO DISPLAY DECK
function verifyDisplayDeckt() {
    if (!deckCartasContainer.classList.contains('displayDeck')){
        btnVerDeck.innerText = 'Ocultar Deck'
    }else {
        btnVerDeck.innerText = 'Ver Deck'
    }
}

// FUNÇÃO PARA SALVAR O DECK NO LOCALSTORAGE
function saveDeckLocalStorage(deck){
   localStorage.setItem('Deck', JSON.stringify(deck))
}

// FUNÇÃO PARA RECUPERAR O DECK DO LOCALSTORAGE 
function getDeckLocalStorage(deck){
    const localDeck = localStorage.getItem('Deck')
    if (localDeck) {
        deck.length = 0
        deck.push(...JSON.parse(localDeck))
    }
    return deck
}

// REUNIR ESTATÍSTICAS DO DECK (quantidade de cartas, total de atk, total de def)
function setDeckStats(){
    atk_total = 0
    def_total = 0
    deckAmout.innerText = deckCartas.length
    deckCartas.forEach(carta =>{
        atk_total += carta.atk? carta.atk:0
        def_total += carta.def? carta.def:0
    })
    deckAtkAmount.innerText = parseInt(atk_total)
    deckDefAmount.innerText = parseInt(def_total)
}
