function consumirApi(){
    const url = 'https://db.ygoprodeck.com/api/v7/cardinfo.php'
    fetch(url)
    .then (response => response.json())
    .then (dados => {
        const cartas = dados.data
        const imgCarta = document.querySelector("#imgCarta")
        const inputCarta = document.querySelector("#inputCarta")
        cartas.forEach(carta => {
            const datalist = document.querySelector('datalist')
            const option = document.createElement('option')
            option.setAttribute("value", carta.name)
            datalist.appendChild(option)

            inputCarta.addEventListener("focusout", e=>{
                if (carta.name.toUpperCase() == inputCarta.value.toUpperCase()){
                    imgCarta.src = carta["card_images"][0]["image_url"]
            }
        });
        })
    })
}


consumirApi()

