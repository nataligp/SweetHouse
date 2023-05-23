var db = firebase.firestore();

firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        const email = user.email;
        db.collection("funcionarios").where("email", "==", email).get().then((querySnapshot) => {
            if (querySnapshot.empty) {
                window.location.href = "../index.html";
            } else {
                querySnapshot.forEach((doc) => {
                    $("#unidade").val(doc.data().unidade);
                    let unidade = (doc.data().unidade);
                    visualizarEquipe(unidade);
                    p = document.querySelector(".unidade");
                    p.textContent = unidade;
                });
            }
        });

    }
    else {
        window.location.href = "loginFuncionario.html";
    }
});

function visualizarEquipe(unidade) {
    db.collection("funcionarios").where("unidade", "==", unidade).get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            $("#dados").append("<tr>");
            $("#dados").append("<td scope='col'>" + doc.data().nome + "</td>");
            $("#dados").append("<td scope='col'>" + doc.data().matricula + "</td>");
            $("#dados").append("<td scope='col'>" + doc.data().email + "</td>");
            $("#dados").append("<td scope='col'>" + doc.data().status + "</td>");
            $("#dados").append("<td scope='col' id='edit'><a href='editarFuncionario.html?email=" + doc.data().email + "'>Editar</a></td>");
            $("#dados").append("</tr>");
            document.getElementById("tabelas").style.display = "flex";
            document.getElementById("carregando").style.display = "none";
        });
    });
}