firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        const email = user.email;
        db.collection("funcionarios").where("email", "==", email).get().then((querySnapshot) => {
            if (querySnapshot.empty) {
                window.location.href = "../index.html";
            } else {
                querySnapshot.forEach((doc) => {
                    $("#nome").val(doc.data().nome);
                    $("#matricula").val(doc.data().matricula);
                    $("#tipo").val(doc.data().tipo);
                    $("#unidadeForm").val(doc.data().unidade);
                    $("#unidade").val(doc.data().unidade);
                    var tipo = (doc.data().tipo);
                    if (tipo != "Gerente") {
                        window.location.href = "indexFuncionario.html";
                    }
                });
            }
        });
    }
    else {
        window.location.href = "loginFuncionario.html";
    }
});