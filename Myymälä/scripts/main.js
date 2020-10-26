// muuttujat

const cartBtn = document.querySelector('.cart-btn')
const closeCartBtn = document.querySelector('.close-cart')
const clearCartBtn = document.querySelector('.clear-cart')
const cartDOM = document.querySelector('.cart')
const cartOverlay = document.querySelector('.cart-overlay')
const cartItems = document.querySelector('.cart-items')
const cartTotal = document.querySelector('.cart-total')
const cartContent = document.querySelector('.cart-content')
const productsDOM = document.querySelector('.products-center')

//ostoskori
let cart = []


// tässä luokassa haetaan tuotteet
class Products {
     //muutetaan koodi asynronoiduksi että saadaan lupauseli siirretää osa tehtävistä selaimen hoidettavaksija odotetaan sen valmistumista, ennen kuin toteutetaan funktio.
    async getProducts(){
    //kokeillaan saada tuotteet ja palautetaan ne, tai errori
        try {   
        let result = await fetch('products.json')
        //muutetaan json formaatista 
        let data = await result.json()
        // products on items.array joka palautetaan
        let products = data.items
        // kopioideen eli map ja rakennellaan
        products = products.map(item =>{
            //otetaan fieldit
            const {title,price} = item.fields;
            //otetaan id
            const {id} = item.sys
            //koska vastaus on tää otetaan image täältä
            const image = item.fields.image.fields.file.url;
            //palautetaan puhdas kokonaisuus
            return {title,price,id,image}
        })
        // ja palautetaan taas
        return products
    } catch (error) {
        console.log(error)

    }
}
}
// UI, tuotteiden näyttöluokka. Kun tuotteet on haettu, pistetään esille
class UI {
    //näytä tuotteet
    displayProducts(products) {
    let result = '';
    //käydään kaikki tuotteet läpi
    products.forEach(product => {
        //lisätään arrayhyn
        result +=`
        <!-- yksi esine -->
        <article class="product">
                <div class="images-container">
                  <img src=${product.image} alt="" class="product-img img-thumbnail">
                  <button class="bag-btn" data-id=${product.id}>
                    <i class="fas fa-shopping-cart"></i>
                    add to bag
                  </button>
                </div>
                <h3>${product.title}</h3>
                <h4>${product.price}</h4>
              </article>
              <!-- Esine loppuu-->`
              
    });
    // kaikki laitetaan DOMiin
    productsDOM.innerHTML = result;
}
getBagButtons(){
    //spread operator, muuttaa arrayksi, ei tule node listiä
    const buttons = [...document.querySelectorAll('.bag-btn')];
    //jokainen nappi käydään läpi ja koska ne ovat esineiden sisällä, niihin liitetään sen esineen data-id
    buttons.forEach(button => {
        let id = button.dataset.id;
        //katsotaan ostoskorista onko samaa id:tä paikalla
        let inCart = cart.find(item => item.id === id)
        //jos on niin ilmoitetaan siitä ja poistetaa nappi käytöstä
        if(inCart){
            button.innerText = 'ostoskorissa'
            button.disabled = true
        } else {
            //muuten
            button.addEventListener('click', (event)=>{
                console.log(event)
            })

        }
    })
    
}
}
// Local storage, tässä tuotteet tallennetaan selaimen omaan muistiin
class Storage {
    //static method
    static saveProducts(products){
        //pitää tallentaa stringinä
        localStorage.setItem("products", JSON.stringify(products))
    }

}

//odotetaan DOM:in latausta, callback
document.addEventListener('DOMContentLoaded', () => {
    const ui = new UI()
    const products = new Products()

    //hae kaikki tuotteet
    products.getProducts().then(products => {ui.displayProducts(products)
    //local strorageen tallennetaan esineet, sopii pieniin määriin esineitä   
    Storage.saveProducts(products)
}).then(() => {
    //nyt käynnistetään funktion, että saadaan 'lisää koriin' napit, niitä ei voinut etsiä alun muuttujissa, koska ne eivät ole dokumentissa, ennen sisällön latautumista.
    ui.getBagButtons();
})
   
});
