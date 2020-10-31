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
//buttons
let buttonsDOM = []

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
            //otetaan fieldit tuotteista
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
    //tätä tarvitaan että myöhemmin löydetään tietty nappi(huomaa buttonsDOM)
    buttonsDOM = buttons;
    buttons.forEach(button => {
        let id = button.dataset.id;
        //katsotaan ostoskorista onko samaa id:tä paikalla
        let inCart = cart.find(item => item.id === id)
        //jos on niin ilmoitetaan siitä ja poistetaa nappi käytöstä
        if(inCart){
            button.innerText = 'ostoskorissa'
            button.disabled = true
        } 
            //muutetaan teksti
            button.addEventListener('click', (event)=>{
                event.target.innerText = 'Ostoskorissa';
                event.target.disabled = true
                //haetaan esine (product from products) ja lisätään siihen määrä(amount). haemme esineen varastosta
                let cartItem = {...Storage.getProduct(id), amount:1}
               
                //lisätään ostoskoriin. lisäämme esineen cart arrayhyn
                cart = [...cart,cartItem]
                //tallenetaan local storageen.Methodi etssii arraytä(cart).tallenetaan esina storageen
                Storage.saveCart(cart)
                //asetetaan ostoskorin valuet
                this.setCartValues(cart);
                //esitetään esine ostoskorissa
                this.addCartItem(cartItem)
                //näytetään ostoskori
                this.showCart()
            })

        
    })
    
}
setCartValues(cart){
    let tempTotal = 0
    let itemsTotal = 0
    cart.map(item => {
        //hinta total = esineen hinta kerrottuna määrällä ostoskorissa. ja esineet yhteensä
        tempTotal += item.price * item.amount;
        itemsTotal += item.amount
    })
    //ostoskorin summa kahdella desimaalilla.esineiden määrä ostoskorissa
    cartTotal.innerText = parseFloat(tempTotal.toFixed(2))
    cartItems.innerText = itemsTotal;
   
}
//luodaan cart item
addCartItem(item) {
    const div = document.createElement('div')
    div.classList.add('cart-item')
    div.innerHTML = `<img src=${item.image}>
    <div>
       <h4>${item.title}</h4>
       <h5>€${item.price}</h5>
       <span class="remove-item" data-id=${item.id}>remove</span>
    </div>
    <div>
      <i class="fas fa-chevron-up" data-id=${item.id}></i>
      <p class="item-amount">${item.amount}</p>
      <i class="fas fa-chevron-down" data-id=${item.id}></i>
    </div>`;
    //liitetään itemi childina documenttiin
    cartContent.appendChild(div)
   
}
showCart(){
    cartOverlay.classList.add('transparentBcg')
    cartDOM.classList.add('showCart')
}
}

// Local storage, tässä tuotteet tallennetaan selaimen omaan muistiin
class Storage {
    //static method
    static saveProducts(products){
        //pitää tallentaa stringinä
        localStorage.setItem("products", JSON.stringify(products))
    }
    static getProduct(id){
        //must parse, koska tuote on tallenettu stringinä local storageen
        let products = JSON.parse(localStorage.getItem('products'));
        return products.find(product => product.id === id)

    }
    static saveCart(cart) {
        localStorage.setItem('cart', JSON.stringify(cart))
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
