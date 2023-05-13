let db = firebase.firestore();
firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        const email = user.email;
        db.collection("funcionarios").where("email", "==", email).get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                $("#unidade").val(doc.data().unidade);
                let unidade = (doc.data().unidade);
                visualizarLoja(unidade);
            });
        });

    }
});
function visualizarLoja(unidade) {
    db.collection("lojas").where("unidade", "==", unidade).get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            $("#unidadeForm").val(doc.data().unidade);
            $("#telefonefixo").val(doc.data().telefone);
            $("#email").val(doc.data().email);
            $("#CEP").val(doc.data().cep);
            $("#rua").val(doc.data().rua);
            $("#numero").val(doc.data().numero);
            $("#bairro").val(doc.data().bairro);
            $("#cidade").val(doc.data().cidade);
            $("#status").val(doc.data().status);
        });
    });
}
function atualizar() {
    let cnome = document.getElementById("unidadeForm").value;
    let ctelefone = document.getElementById("telefonefixo").value;
    let cemail = document.getElementById("email").value;
    let ccep = document.getElementById("CEP").value;
    let crua = document.getElementById("rua").value;
    let cnumero = document.getElementById("numero").value;
    let cbairro = document.getElementById("bairro").value;
    let ccidade = document.getElementById("cidade").value;
    let cstatus = "ATIVO";
    db.collection("lojas").where("unidade", "==", cnome).get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            var dados = db.collection("lojas").doc(doc.id);
            return dados.update({
                nome: cnome,
                telefone: ctelefone,
                email: cemail,
                cep: ccep,
                rua: crua,
                numero: cnumero,
                bairro: cbairro,
                cidade: ccidade,
                status: cstatus
            }).then(() => {
                Swal.fire({
                    title: 'Dados atualizados!',
                    icon: 'success',
                    confirmButtonColor: '#2ecc71',
                    focusConfirm: false,
                    confirmButtonText: 'Confirmar'
                }).then((result) => {
                    if (result.isConfirmed) {
                        location.reload();
                    }
                });
            });

        });
    });
}
function desativarLoja() {
    let cnome = document.getElementById("unidadeForm").value;
    db.collection("lojas").where("unidade", "==", cnome).get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            var dados = db.collection("lojas").doc(doc.id);
            var status = doc.data().status;
            if (status == "INATIVO") {
                cstatus = "ATIVO";
                return dados.update({
                    status: cstatus
                }).then(() => {
                    location.reload();
                });
            }
            else {
                cstatus = "INATIVO";
                Swal.fire({
                    title: 'Inativar loja',
                    html: 'Ao executar essa ação, a loja ficará inativa e os produtos inacessíveis aos clientes.',
                    icon: 'warning',
                    showCloseButton: true,
                    confirmButtonColor: '#d63031',
                    focusConfirm: false,
                    confirmButtonText: 'Confirmar',
                }).then((result) => {
                    if (result.isConfirmed) {
                        return dados.update({
                            status: cstatus
                        });
                    }
                }).then(() => {
                    location.reload();
                });

            }
        });
    });
}