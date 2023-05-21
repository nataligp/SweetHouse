var url_string = window.location.href;
var url = new URL(url_string);
var categoria = url.searchParams.get("categoria");
let db = firebase.firestore();

db.collection("produtos").where("categoria", "==", categoria).where("status", "==", "DISPONÍVEL").get().then((querySnapshot) => {
    const topo = document.querySelector(".topo");
    const paragrafo = document.createElement("p");
    paragrafo.textContent = categoria ;
    topo.appendChild(paragrafo);
    if (!querySnapshot.empty) {
        querySnapshot.forEach((doc) => {
            let sku = doc.data().sku;
            const storageRef = firebase.storage().ref();
            const imageRef = storageRef.child(categoria + "/" + sku + '.jpg');
            imageRef.getDownloadURL().then(function (url) {
                const produtos = document.querySelector(".produto");
                const div1 = document.createElement("div");
                div1.setAttribute("class", "card");
                const div2 = document.createElement("div");
                div2.setAttribute("class", "card-body");
                const div = document.createElement("a");
                div.href = "detalhesProduto.html?sku=" + sku + "&categoria=" + categoria + "";
                const h5 = document.createElement("h5");
                h5.setAttribute("class", "card-title");
                h5.textContent = doc.data().nome;
                const h6 = document.createElement("h5");
                h6.setAttribute("class", "card-title");
                h6.textContent = doc.data().preco;
                const img = document.createElement("img");
                img.src = url;
                div1.appendChild(img);
                div2.appendChild(h5);
                div2.appendChild(h6);
                div1.appendChild(div2);
                div.appendChild(div1);
                produtos.appendChild(div);
            });
        });
    } else {
        document.getElementById("noproducts").style.display = "flex";
    }
});


