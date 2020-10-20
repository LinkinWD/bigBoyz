
// avaa lähetä viesti ikkuna
$('.tilaukset .btn1').on('click', function() {
    $('.form1').toggleClass('hidden')
    $('.form2').addClass('hidden')
})
$('.tilaukset .btn2').on('click', function() {
    $('.form2').toggleClass('hidden')
    $('.form1').addClass('hidden')
})