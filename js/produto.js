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
                visualizarProdutos(unidade);
            });
        });
    } else {
        window.location.href = "../funcionario/loginFuncionario.html";
    }
});
function readImage() {
    if (this.files && this.files[0]) {
        var file = new FileReader();
        file.onload = function (e) {
            document.getElementById("preview").src = e.target.result;
        };
        file.readAsDataURL(this.files[0]);
    }
}

function inserirProduto() {
    let db = firebase.firestore();
    let cnome = document.getElementById("nome").value;
    let csku = document.getElementById("sku").value;
    let cpreco = document.getElementById("preco").value;
    let cdescricao = document.getElementById("descricao").value;
    let ccategoria = document.getElementById("categoria").value;
    let cstatus = "DISPONÍVEL";
    let size = document.getElementById("imgprod");
    if ((cnome != '') && (csku != '') && (cpreco != '') && (cdescricao != '') && (ccategoria != '') && (ccategoria != "Selecione") && (size.files.length != 0)) {
        db.collection("produtos").where("sku", "==", csku).get().then((querySnapshot) => {
            if (!querySnapshot.empty) {
                querySnapshot.forEach((doc) => {
                    sku = doc.data().sku;
                });
                db.collection("produtos").where("sku", "==", sku).where("unidade", "array-contains", unidade).get().then((querySnapshot) => {
                    if (!querySnapshot.empty) {
                        Swal.fire(
                            'Atenção',
                            'O SKU já existe nessa unidade',
                            'error'
                        )
                    } else {
                        Swal.fire({
                            icon: 'alert',
                            html: 'Esse produto já existe, deseja adicionar a essa unidade?',
                            confirmButtonColor: '#3498DB',
                            focusConfirm: false,
                            confirmButtonText: 'Confirmar'
                        }).then((result) => {
                            if (result.isConfirmed) {
                                addUnidade(sku, unidade);
                            }
                        });
                    }
                });
            } else {
                addProduto(cnome, csku, cpreco, cdescricao, ccategoria, cstatus);
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

function addProduto(cnome, csku, cpreco, cdescricao, ccategoria, cstatus) {
    var file = document.getElementById("imgprod").files[0];
    let storage = firebase.storage();
    let path = ccategoria + "/";
    let name = csku;
    let imgRef = storage.ref().child(path + name + ".jpg")
    imgRef.put(file).then(() => {
        db.collection("produtos").add({
            nome: cnome,
            sku: csku,
            preco: cpreco,
            descricao: cdescricao,
            categoria: ccategoria,
            status: cstatus,
            unidade: unidade,
        }).then(() => {
            Swal.fire({
                title: 'Produto cadastrado!',
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

function addUnidade(sku, unidade) {
    db.collection("produtos").where("sku", "==", sku).get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            var dados = db.collection("produtos").doc(doc.id);
            return dados.update({
                unidade: firebase.firestore.FieldValue.arrayUnion(unidade)
            }).then(() => {
                Swal.fire({
                    title: 'Produto adicionado!',
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

//Visualização automática dos produtos

var url_string = window.location.href;
var url = new URL(url_string);
var sku = url.searchParams.get("sku");
var ccategoria = url.searchParams.get("categoria")
var db = firebase.firestore();
db.collection("produtos").where("sku", "==", sku).get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
        const storageRef = firebase.storage().ref();
        const imageRef = storageRef.child(ccategoria + "/" + doc.data().sku + '.jpg');
        imageRef.getDownloadURL().then(function (url) {
            preview.src = url;
        });
        document.getElementById("nome").value = doc.data().nome;
        document.getElementById("sku").value = doc.data().sku;
        document.getElementById("preco").value = doc.data().preco;
        document.getElementById("descricao").value = doc.data().descricao;
        document.getElementById("categoria").value = doc.data().categoria;
    });
})

function editarImagem() {
    let csku = document.getElementById("sku").value;
    let ccategoria = document.getElementById("categoria").value;
    var file = document.getElementById("imgprod");
    var img = file.files[0];
    let storage = firebase.storage();
    let path = ccategoria + "/";
    let name = csku;
    let imgRef = storage.ref().child(path + name + ".jpg")
    if (file.files.length != 0) {
        imgRef.put(img).then(() => {
            Swal.fire({
                title: 'Imagem alterada!',
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
    } else {
        Swal.fire(
            'Atenção',
            'Não foi inserido uma nova imagem para o produto',
            'error'
        )
    }
}
function editarProduto() {
    let db = firebase.firestore();
    let cnome = document.getElementById("nome").value;
    let csku = document.getElementById("sku").value;
    let cpreco = document.getElementById("preco").value;
    let cdescricao = document.getElementById("descricao").value;
    let ccategoria = document.getElementById("categoria").value;
    if ((cnome != '') && (csku != '') && (cpreco != '') && (cdescricao != '') && (ccategoria != '') && (ccategoria != "Selecione")) {
        db.collection("produtos").where("sku", "==", csku).get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                var dados = db.collection("produtos").doc(doc.id);
                return dados.update({
                    nome: cnome,
                    sku: csku,
                    preco: cpreco,
                    descricao: cdescricao,
                    categoria: ccategoria,
                }).then(() => {
                    Swal.fire({
                        title: 'Produto alterado!',
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
    } else {
        Swal.fire(
            'Atenção',
            'Campos obrigatórios não preenchidos ou preenchidos incorretamente',
            'error'
        )
    }
}

function inativarProduto() {
    db.collection("produtos").where("sku", "==", sku).get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            let status = doc.data().status;
            if (status == "INDISPONÍVEL") {
                var cstatus = "DISPONÍVEL"
            }
            else {
                var cstatus = "INDISPONÍVEL"
            }
            var dados = db.collection("produtos").doc(doc.id);
            return dados.update({
                status: cstatus
            }).then(() => {
                Swal.fire({
                    title: 'Produto ' + cstatus + '!',
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


//Visualizar lista de produtos automaticamente

function visualizarProdutos(unidade) {
    db.collection("produtos").where("unidade", "array-contains", unidade).get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            $("#dados").append("<tr>");
            $("#dados").append("<td scope='col'>" + doc.data().nome + "</td>");
            $("#dados").append("<td scope='col'>" + doc.data().preco + "</td>");
            $("#dados").append("<td scope='col'>" + doc.data().categoria + "</td>");
            $("#dados").append("<td scope='col'>" + doc.data().status + "</td>");
            $("#dados").append("<td scope='col' id='edit'><a href='editarProduto.html?sku=" + doc.data().sku + "&unidade=" + unidade + "&categoria=" + doc.data().categoria + "'>Editar</a></td>");
            $("#dados").append("</tr>");
            
            document.getElementById("tabelas").style.display = "flex";
            document.getElementById("carregando").style.display = "none";
        });
    });
}

