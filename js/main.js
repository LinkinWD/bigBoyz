const client = contentful.createClient({
    // This is the space ID. A space is like a project folder in Contentful terms
    space: "sqee0b6lmkhy",
    // This is the access token for this space. Normally you get both ID and the token in the Contentful web app
    accessToken: "SqoNU9BCfbylzjSw6yLe1iNqYZAoHMyQKOkQJxCejic"
  });

  
   client.getEntries()
.then((response) => console.log(response.items))
.catch(console.error)

// avaa lähetä viesti ikkuna
$('.tilaukset .btn1').on('click', function() {
    $('.form1').toggleClass('hidden')
    $('.form2').addClass('hidden')
})
$('.tilaukset .btn2').on('click', function() {
    $('.form2').toggleClass('hidden')
    $('.form1').addClass('hidden')
})