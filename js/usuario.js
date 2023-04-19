const app = {
        
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    onDeviceReady: function() {
        document.getElementById("cadastro").addEventListener("click",app.inserir);  
        document.getElementById("login").addEventListener("click",app.login); 
        document.getElementById("alterar").addEventListener("click",app.alterar); 
        document.getElementById("excluir").addEventListener("click",app.excluir); 
        document.getElementById("visualizar").addEventListener("click",app.visualizar); 

    },

    inserir: function(){
        let cnome = document.getElementById("nome").value;
        let cemail = document.getElementById("email").value;
        let ctelefone = document.getElementById("telefone").value;
        let ccep = document.getElementById("CEP").value;
        let crua = document.getElementById("rua").value;
        let cnumero = document.getElementById("numero").value;
        let cbairro = document.getElementById("bairro").value;
        let ccidade = document.getElementById("cidade").value;
        let cestado = document.getElementById("uf").value;
        let csenha = document.getElementById("senha").value;

        db.collection("usuarios").add({
            nome: cnome,
            email: cemail,
            senha: csenha,
            telefone: ctelefone,
        })
        .then((docRef) => {
            alert("Document written with ID: ", docRef.id);
        })
        .catch((error) => {
            alert("Error adding document: ", error);
        });
    },
    
    editar: function(){
        var url_string = window.location.href;
        var url = new URL(url_string);
        var getEmail = url.searchParams.get("email");

        let cnome = document.getElementById("nome").value;
        let cemail = document.getElementById("email").value;
        let ctelefone = document.getElementById("telefone").value;

        var db = firebase.firestore();
        var user = db.collection("usuarios").where("email", "==", cemail);

        user.get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                var dados = db.collection("usuarios").doc(doc.id);

                return dados.update({
                    nome: cnome,
                    telefone: ctelefone,
                    origem: cemail,
                })
                .then(() => {
                    console.log("Document successfully updated!");
                    window.location.href = "indexLogin.html";
                })
                .catch((error) => {
                    // The document probably doesn't exist.
                    console.error("Error updating document: ", error);
                });
            });
        })
        .catch((error) => {
            console.log("Error getting documents: ", error);
        });

    },
    listar: function(){
        var db = firebase.firestore();
        var user = db.collection("usuarios");

        user.get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                console.log(doc.id, " => ", doc.data());
                doc.data().nome
                doc.data().telefone
                doc.data().email
            });
        })
        .catch((error) => {
            console.log("Error getting documents: ", error);
        });
    },

    excluir: function(){ 
        var url_string = window.location.href;
        var url = new URL(url_string);
        var getEmail = url.searchParams.get("email");

        var db = firebase.firestore();
        var users = db.collection("usuarios").where("email", "==", getEmail);

        users.get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                db.collection("usuarios").doc(doc.id).delete().then(() => {
                    console.log("Document successfully deleted!");
                    window.location.href = "index.html";
                }).catch((error) => {
                    console.error("Error removing document: ", error);
                });
            });
        })
        .catch((error) => {
            console.log("Error getting documents: ", error);
        });
    },

    login: function(){
        var auth = null;
        firebase.auth().signInWithEmailAndPassword(document.getElementById("email").value, document.getElementById("senha").value)
        .then(function(user) {
            auth = user;
            window.location.href = "indexLogin.html";
            })
        .catch(function(error){
         });
    },
};

app.initialize();