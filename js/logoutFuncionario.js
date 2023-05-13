function LogOut() {
    firebase.auth().signOut().then(() => {
        window.location.href = "loginFuncionario.html";
    }).catch((error) => {
    });
}