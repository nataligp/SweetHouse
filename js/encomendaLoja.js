unidade = ""
sku = ""
var db = firebase.firestore();
firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        const email = user.email;
        db.collection("funcionarios").where("email", "==", email).get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                $("#unidade").val(doc.data().unidade);
                unidade = (doc.data().unidade);
                visualizar(unidade);
            });
        });
    } else {
        window.location.href = "../funcionario/loginFuncionario.html";
    }
});

function visualizar(unidade) {
    db.collection("encomendas").where("loja", "==", unidade).get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            cliente = doc.data().emailc;
            produto = doc.data().produto;
            tiporet = doc.data().tiporet;
            dataret = doc.data().dataret;
            stts = doc.data().status;
            id = doc.id;
            visualizarC(cliente, produto, tiporet, dataret, stts, id);

        });
    });

}
function visualizarC(cliente, produto, tiporet, dataret, stts, id) {
    db.collection("usuarios").where("email", "==", cliente).get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            nomec = doc.data().nome;
            visualizarP(nomec, produto, tiporet, dataret, stts, id)
        });
    });
}
function visualizarP(nomec, produto, tiporet, dataret, stts, id) {
    db.collection("produtos").where("sku", "==", produto).get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            nomep = doc.data().nome;
            $("#dados").append("<tr>");
            $("#dados").append("<td scope='col'>" + nomep + "</td>");
            $("#dados").append("<td scope='col'>" + nomec + "</td>");
            $("#dados").append("<td scope='col'>" + tiporet + "</td>");
            $("#dados").append("<td scope='col'>" + dataret + "</td>");
            $("#dados").append("<td scope='col'>" + stts + "</td>");
            $("#dados").append("<td scope='col' id='edit'><a href='detalhesEncomendas.html?uid=" + id + "'>Ver detalhes</a></td>");
            $("#dados").append("</tr>");
        });
    });
}