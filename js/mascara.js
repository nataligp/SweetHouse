$(document).ready(function(){
    $('#CEP').mask('99999-999')
    $('#telefone').mask('(99) 99999-9999')
    $('#telefonefixo').mask('(99) 9999-9999')
})
$(document).ready(function () {
    $('#preco').maskMoney({
        prefix: 'R$ ',
        allowNegative: true,
        thousands: '.', decimal: ',',
        affixesStay: true
    });
})