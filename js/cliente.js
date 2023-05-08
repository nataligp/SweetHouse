function alertaExcluir() {
    Swal.fire({
        title: 'Excluir conta',
        html: 'Ao executar essa ação, sua conta será deletada do nosso sistema permanentemente. Insira sua senha para executar essa ação.',
        icon: 'warning',
        input: 'password',
        showCloseButton: true,
        confirmButtonColor: '#d63031',
        focusConfirm: false,
        confirmButtonText: 'Confirmar',
        preConfirm: (excluir) => {
            const password = excluir;
        },
    }).then((result) => {
        if (result.isConfirmed) {
            firebase.auth().onAuthStateChanged((user) => {
                if (user) {
                    const email = user.email;
                    db.collection("usuarios").where("email", "==", email).get().then(function (querySnapshot) {
                        querySnapshot.forEach(function (doc) {
                            doc.ref.delete()
                        });
                    });
                    const credential = firebase.auth.EmailAuthProvider.credential(
                        user.email,
                        result.value
                    );
                    user.reauthenticateWithCredential(credential).then(() => {
                        user.delete().then(() => {
                            window.location.href = "index.html";
                        }).catch((error) => {
                            alert(error);
                        });
                    }).catch((error) => {
                        alert(error);
                    });
                }
            });
        }
    });
}

function editarPerfil() {
    let cnome = document.getElementById("nome").value;
    let ctelefone = document.getElementById("telefone").value;
    let ccep = document.getElementById("CEP").value;
    let crua = document.getElementById("rua").value;
    let cnumero = document.getElementById("numero").value;
    let cbairro = document.getElementById("bairro").value;
    let ccidade = document.getElementById("cidade").value;
    let db = firebase.firestore();
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            const email = user.email;
            db.collection("usuarios").where("email", "==", email).get().then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    var dados = db.collection("usuarios").doc(doc.id);
                    if ((cnome != '') && (ctelefone != '') && (ccep != '') && (crua != '') && (cnumero != '') && (cbairro != '') && (ccidade != '')) {
                        return dados.update({
                            nome: cnome,
                            telefone: ctelefone,
                            cep: ccep,
                            rua: crua,
                            numero: cnumero,
                            bairro: cbairro,
                            cidade: ccidade,
                        }).then(() => {
                            window.location.href = "perfil.html";
                        });
                    } else {
                        Swal.fire(
                            'Atenção',
                            'Campos obrigatórios não preenchidos',
                            'alert'
                        )
                    }
                });

            });

        }
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
                    window.location.href = "index.html";
                }).catch((error) => {
                    alert(error);
                });
            });
        }
    });
}
function inserirUser() {
    let db = firebase.firestore();
    let cnome = document.getElementById("nome").value;
    var cemail = document.getElementById("email").value;
    let email = cemail.toLowerCase();
    let ctelefone = document.getElementById("telefone").value;
    let ccep = document.getElementById("CEP").value;
    let crua = document.getElementById("rua").value;
    let cnumero = document.getElementById("numero").value;
    let cbairro = document.getElementById("bairro").value;
    let ccidade = document.getElementById("cidade").value;
    let csenha = document.getElementById("senha").value;
    if ((cnome != '') && (cemail != '') && (ctelefone != '') && (ccep != '') && (crua != '') && (cnumero != '') && (cbairro != '') && (ccidade != '') && (csenha != '')) {
        firebase.auth().createUserWithEmailAndPassword(email, csenha)
            .then(function (user) {
                auth = user;
                let db = firebase.firestore();
                db.collection("usuarios").add({
                    nome: cnome,
                    email: cemail,
                    telefone: ctelefone,
                    cep: ccep,
                    rua: crua,
                    numero: cnumero,
                    bairro: cbairro,
                    cidade: ccidade,
                });
                Swal.fire({
                    title: 'Cadastro realizado!',
                    icon: 'sucess',
                    confirmButtonColor: '#2ecc71',
                    focusConfirm: false,
                    confirmButtonText: 'Confirmar'
                }).then((result) => {
                    if (result.isConfirmed) {
                        window.location.href = "index.html";
                    }
                })
            }).catch(function (error) {
                Swal.fire(
                    'Atenção',
                    'O e-mail informado já possui registro, informe outro ou faça login',
                    'error'
                )
            });
    }
    else {
        Swal.fire(
            'Atenção',
            'Campos obrigatórios não preenchidos',
            'error'
        )
    }
}

function verificaAtividade() {
    var db = firebase.firestore();
    var email = document.getElementById("email").value;
    db.collection("usuarios").where("email", "==", email).get().then((querySnapshot) => {
        if (querySnapshot.empty) {
            db.collection("funcionarios").where("email", "==", email).get().then((querySnapshot) => {
                if (querySnapshot.empty) {
                    Swal.fire({
                        title: 'Realize um cadastro',
                        icon: 'alert',
                        confirmButtonColor: '#2ecc71',
                        focusConfirm: false,
                        confirmButtonText: 'Confirmar'
                    }).then((result) => {
                        if (result.isConfirmed) {
                            window.location.href = "cadastro.html";
                        }
                    });
                }
                else {
                    Swal.fire(
                        'Atenção',
                        'Credenciais inválidas para esse acesso',
                        'error'
                    )
                }
            });
        } else {
            userLog();
        }
    });
}
function userLog() {
    var auth = null;
    var email = document.getElementById("email").value;
    var senha = document.getElementById("senha").value;
    if ((email != '') && (senha != '')) {
        firebase.auth().signInWithEmailAndPassword(email, senha)
            .then(function (user) {
                auth = user;
                window.location.href = "index.html";
            })
            .catch(function (error) {
                Swal.fire(
                    'Atenção',
                    'Senha inválida',
                    'alert'
                )
            });
    } else {
        Swal.fire(
            'Atenção',
            'Campos obrigatórios não preenchidos',
            'alert'
        )
    }
};