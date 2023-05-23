let db = firebase.firestore();
firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        const email = user.email;
        db.collection("funcionarios").where("email", "==", email).get().then((querySnapshot) => {
            if (querySnapshot.empty) {
                window.location.href = "../index.html";
            } else {
                querySnapshot.forEach((doc) => {
                    $("#unidade").val(doc.data().unidade);
                    let tipo = (doc.data().tipo);
                    validaAcesso(tipo);
                });
            }
        });
    } else {
        window.location.href = "loginFuncionario.html";
    }
});
function validaAcesso(tipo) {
    if (tipo == "Gerente") {
        document.getElementById("menuFun").style.display = "flex";
        document.getElementById("private").style.display = "flex";
    } else {
        document.getElementById("menuFun").style.display = "flex";
        document.getElementById("private").style.display = "none";
    }
}