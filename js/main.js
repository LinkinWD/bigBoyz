const client = contentful.createClient({
    // This is the space ID. A space is like a project folder in Contentful terms
    space: "sqee0b6lmkhy",
    // This is the access token for this space. Normally you get both ID and the token in the Contentful web app
    accessToken: "SqoNU9BCfbylzjSw6yLe1iNqYZAoHMyQKOkQJxCejic"
  });

let tuote1 = document.querySelector('.tuote1');
let tuote2 = document.querySelector('.tuote2');

  client.getEntries().then ( e =>{
    const article1 = e.items[3].fields.nimi
    const article2 = e.items[5].fields.nimi
    const hinta1 = e.items[3].fields.hinta
    const hinta2 = e.items[5].fields.hinta 
    const image1 = e.items[3].fields.image.fields.file.url;
    const image2 = e.items[5].fields.image.fields.file.url;
    tuote1.innerHTML = ` <h4>${article1}</h4>
                    <img src="${image1}">
                    <h5>€${hinta1}</h5>`
    tuote2.innerHTML = ` <h4>${article2}</h4>
                    <img src="${image2}">
                    <h5>€${hinta2}</h5>`
                    console.log(hinta1)
})


// avaa lähetä viesti ikkuna
$('.tilaukset .btn1').on('click', function() {
    $('.form1').toggleClass('hidden')
    $('.form2').addClass('hidden')
})
$('.tilaukset .btn2').on('click', function() {
    $('.form2').toggleClass('hidden')
    $('.form1').addClass('hidden')
})