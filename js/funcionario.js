var db = firebase.firestore();

function inserir() {
    let cnome = document.getElementById("nome").value;
    let cemail = document.getElementById("email").value;
    let email = cemail.toLowerCase();
    let cmatricula = document.getElementById("matricula").value;
    let ctipo = document.getElementById("tipo").value;
    let cunidade = document.getElementById("unidadeForm").value;
    let cstatus = "INATIVO";
    if ((cnome != '') && (cemail != '') && (cmatricula != '') && (ctipo != '') && (cunidade != '') && (cunidade != "Selecione") && (ctipo != "Selecione")) {
        db.collection("funcionarios").where("email", "==", cemail).get().then((querySnapshot) => {
            if (querySnapshot.empty) {
                addFuncionario(cemail, cnome, cmatricula, ctipo, cunidade, cstatus);
            } else {
                Swal.fire(
                    'Atenção',
                    'O e-mail já está cadastrado',
                    'error'
                )
            }
        });
    } else {
        Swal.fire(
            'Atenção',
            'Campos obrigatórios não preenchidos ou preenchidos incorretamente',
            'error'
        )
    }
}
function addFuncionario(cemail, cnome, cmatricula, ctipo, cunidade, cstatus) {
    db.collection("funcionarios").add({
        nome: cnome,
        email: cemail,
        matricula: cmatricula,
        tipo: ctipo,
        unidade: cunidade,
        status: cstatus,
    }).then(function() {
        addGerente(cunidade, cemail).then(() => {
            Swal.fire({
                title: 'Funcionário cadastrado!',
                html: 'O funcionário foi cadastrado com sucesso.',
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
}
function addGerente(cunidade, cemail) {
    db.collection("lojas").where("unidade", "==", cunidade).get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            var cgerente = (doc.data().gerente);
            db.collection("funcionarios").where("email", "==", cemail).get().then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    var dados = db.collection("funcionarios").doc(doc.id);
                    return dados.update({
                        gerente: cgerente,
                    });
                });
            });
        });
    });
}

var url_string = window.location.href;
var url = new URL(url_string);
var email = url.searchParams.get("email");
function editarPerfil() {
    let cnome = document.getElementById("nome").value;
    var cemail = document.getElementById("email").value;
    let email = cemail.toLowerCase();
    let cmatricula = document.getElementById("matricula").value;
    let ctipo = document.getElementById("tipo").value;
    let cunidade = document.getElementById("unidadeForm").value;
    db.collection("funcionarios").where("email", "==", email).get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            var dados = db.collection("funcionarios").doc(doc.id);
            return dados.update({
                nome: cnome,
                email: cemail,
                matricula: cmatricula,
                tipo: ctipo,
                unidade: cunidade,
            }).then(() => {
                window.location.href = "equipe.html";
            });
        });
    });
}
function bloquearUser() {
    var url_string = window.location.href;
    var url = new URL(url_string);
    var email = url.searchParams.get("email");
    db.collection("funcionarios").where("email", "==", email).get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            var dados = db.collection("funcionarios").doc(doc.id);
            return dados.update({
                status: "BLOQUEADO",
            }).then(() => {
                window.location.href = "equipe.html";
            });
        });
    });
}
function mudarSenha() {
    Swal.fire({
        title: 'Redefinir senha',
        html: 'Insira sua nova senha.',
        icon: 'info',
        input: 'password',
        showCloseButton: true,
        confirmButtonColor: '#2ecc71',
        focusConfirm: false,
        confirmButtonText: 'Confirmar',
        preConfirm: (senhanova) => {
            const password = senhanova;
        },
    }).then((result) => {
        if (result.isConfirmed) {
            firebase.auth().onAuthStateChanged((user) => {
                user.updatePassword(result.value).then(() => {
                    window.location.href = "perfilFuncionario.html";
                }).catch((error) => {
                    alert(error);
                });
            });
        }
    });
}
function solicitarEdicao() {
    Swal.fire({
        title: 'Alteração de dados',
        html: 'Insira quais dados devem ser alterados e o motivo',
        icon: 'info',
        input: 'text',
        showCloseButton: true,
        confirmButtonColor: '#2ecc71',
        focusConfirm: false,
        confirmButtonText: 'Confirmar',
        preConfirm: (solicitacao) => {
            var solic = solicitacao;
        },
    }).then((result) => {
        if (result.isConfirmed) {
            firebase.auth().onAuthStateChanged((user) => {
                if (user) {
                    var email = user.email;
                    db.collection("funcionarios").where("email", "==", email).get().then((querySnapshot) => {
                        querySnapshot.forEach((doc) => {
                            var nome = (doc.data().nome);
                            var gestor = (doc.data().gestor);
                        });
                        db.collection("solicitacao").add({
                            nome: nome,
                            email: email,
                            solicitacao: result.value,
                            gestor: gestor,
                        });
                    });
                }
            });
        }
    });
}
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
