const client = contentful.createClient({
    // This is the space ID. A space is like a project folder in Contentful terms
    space: "sqee0b6lmkhy",
    // This is the access token for this space. Normally you get both ID and the token in the Contentful web app
    accessToken: "SqoNU9BCfbylzjSw6yLe1iNqYZAoHMyQKOkQJxCejic"
  });
  

// muuttujat
const napit = document.querySelectorAll('.napit')
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

            let contentful = await client.getEntries({
                content_type: "varasto"
            })
           console.log(contentful)
            /* .then((response) => console.log(response.items))
            .catch(console.error)    */
        let result = await fetch('products.json')
        //muutetaan json formaatista 
        let data = await result.json()
        // products on items.array joka palautetaan contentfulista
        let products = contentful.items;
        console.log(products)
        // kopioideen eli map ja rakennellaan
        products = products.map(item =>{
            //otetaan fieldit tuotteista
            const {nimi,hinta, luokka} = item.fields;
            //otetaan id
            const {id} = item.sys
            //koska vastaus on tää otetaan image täältä
            const image = item.fields.image.fields.file.url;
            //palautetaan puhdas kokonaisuus
            return {nimi,hinta,luokka,id,image}
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
        <article class="product ${product.luokka}">
                <div class="images-container">
                <h3>${product.nimi}</h3>
                <img src=${product.image} alt="" class="product-img img-thumbnail">
                <h4>€${product.hinta}</h4>
                  <button class="bag-btn" data-id=${product.id}>
                    <i class="fas fa-shopping-cart"></i>
                    Lisää ostoskoriin
                  </button>
                </div>
                
                
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
        tempTotal += item.hinta * item.amount;
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
       <h4>${item.nimi}</h4>
       <h5>€${item.hinta}</h5>
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
setupAPP(){
    cart = Storage.getCart();
    this.setCartValues(cart)
    this.populateCart(cart);
    cartBtn.addEventListener('click', this.showCart)
    closeCartBtn.addEventListener('click', this.hideCart)
}

populateCart(cart){
    cart.forEach(item => this.addCartItem(item))
}
hideCart(){
    cartOverlay.classList.remove('transparentBcg')
    cartDOM.classList.remove('showCart')
}
cartLogic() {
    //tyhjennä kori nappi
    clearCartBtn.addEventListener('click', ()=> {
        this.clearCart()
    })
    // ostoskorin toiminnallisuus(lisää, poista tuotteita...) event bubbling. Laittaa kuuntelijan koko diviin
    cartContent.addEventListener('click', event => {
        //jos eventin kohde sisältää luokan, nii...
        if(event.target.classList.contains('remove-item'))
        {
            let removeItem = event.target
            let id = removeItem.dataset.id
            cartContent.removeChild(removeItem.parentElement.parentElement)
            this.removeItem(id)

        }
        else if(event.target.classList.contains('fa-chevron-up')) {
            let addAmount = event.target
            let id = addAmount.dataset.id
            //etsitään cartista esine, jonka Id on sama
            let tempItem = cart.find(item => item.id===id)
            tempItem.amount = tempItem.amount +1
            Storage.saveCart(cart)
            this.setCartValues(cart)
            addAmount.nextElementSibling.innerText = tempItem.amount
        }
        else if(event.target.classList.contains('fa-chevron-down')) {
            let lowerAmount = event.target
            let id = lowerAmount.dataset.id
            let tempItem = cart.find(item => item.id===id)
            tempItem.amount = tempItem.amount -1
            if(tempItem.amount > 0 ) {
                    Storage.saveCart(cart)
                    this.setCartValues(cart)
                    lowerAmount.previousElementSibling.innerText = tempItem.amount
            }
            else {
                cartContent.removeChild(lowerAmount.parentElement.parentElement)
                this.removeItem(id)
            }
        }
    })
}
clearCart() {
    let cartItems = cart.map(item => item.id)
    cartItems.forEach(id => this.removeItem(id))
    while(cartContent.children.length > 0) {
        cartContent.removeChild(cartContent.children[0])
    } 
    this.hideCart()
}
removeItem(id) {
    cart = cart.filter(item => item.id !== id)
    this.setCartValues(cart)
    Storage.saveCart(cart)
    let button = this.getSingleButton(id)
    button.disabled = false
    button.innerHTML = `<i class="fas fa-shopping-cart"></i>Lisää ostoskoriin`

}
// palauta takaisin se tietty nappi, jossa on sama data id
getSingleButton(id) {
    return buttonsDOM.find(button => button.dataset.id === id)
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
    static getCart() {
        //tarkistetaan onko mitään local storagessa, jos on niin tuodaan se, jos ei palautetaan tyhjä array
        return localStorage.getItem('cart')?JSON.parse(localStorage.getItem('cart')):[]
    }
}

//odotetaan DOM:in latausta, callback
document.addEventListener('DOMContentLoaded', () => {
    const ui = new UI()
    const products = new Products()
    //set up aplication
    ui.setupAPP()
    //hae kaikki tuotteet
    products.getProducts().then(products => {ui.displayProducts(products)
    //local strorageen tallennetaan esineet, sopii pieniin määriin esineitä   
    Storage.saveProducts(products)
}).then(() => {
    //nyt käynnistetään funktion, että saadaan 'lisää koriin' napit, niitä ei voinut etsiä alun muuttujissa, koska ne eivät ole dokumentissa, ennen sisällön latautumista.
    ui.getBagButtons();
    ui.cartLogic()

}).then(() => {
    // tehdään valikko, että näkyy kaikki tai sitten vaan kengät tai vaatteet. Tämän joutuu tekemään vasta nyt, koska elementit eivät sijaitse samassa paikassa kuin dokumentti vaan ne pitää hakea ensin muualta ja odottaa niiden latautumista.
    napit.forEach(nappi => {
        nappi.addEventListener('click', event => {
            let id = nappi.dataset.id
            let vaate = document.querySelectorAll('.vaate')
            let kenkä = document.querySelectorAll('.kenkä')
            let arti = document.querySelectorAll('article')
            if(id === 'kengät') {
                vaate.forEach(event => {
                    event.style.display = 'none'
                    kenkä.forEach( (e) =>
                        e.style.display = 'block')
                })
            } else 
                if(id === 'vaatteet') {
                    kenkä.forEach(event => {
                        event.style.display = 'none'
                        vaate.forEach( (e) =>
                        e.style.display = 'block')
                    })
            } else 
            if(id === 'kaikki') {
               arti.forEach(event => {
                   event.style.display = 'block'
               })

        }
            
        } )
    })
    })
    })

   

