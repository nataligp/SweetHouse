var uid = ""
var url_string = window.location.href;
var url = new URL(url_string);
var eid = url.searchParams.get("id");
var sid = "";
var sendertype = "";

if (url_string.includes("funcionario")) {
    sendertype = "func"
}
else{
    sendertype = "client"
}
firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        uid = user.uid;
    }
})
db = firebase.firestore();
db.collection("mensagens").orderBy('timestamp', 'asc').where("session", "==", eid).where("read", "==", "true").get().then((querySnapshot) => {
    if (!querySnapshot.empty) {
        querySnapshot.forEach((doc) => {
            content = doc.data().content;
            usertype = doc.data().sendertype;
            var chatMessagesElement = document.getElementById("chat-messages");
            var messageElement = document.createElement("p");
            messageElement.textContent = content;
            if (usertype != sendertype) {
                messageElement.style.alignSelf = "start"
            }
            chatMessagesElement.appendChild(messageElement);
        });
    }
});
function chat() {
    document.getElementById("chatbox").style.display = "flex";
}
function closechat() {
    document.getElementById("chatbox").style.display = "none";

}
function sendMessage() {
    var messageInput = document.getElementById("message-input");
    var messageContent = messageInput.value;

    if (messageContent.trim() !== "") {
        db.collection("mensagens").add({
            session: eid,
            sender: uid,
            sendertype: sendertype,
            content: messageContent,
            read: 'false',
            timestamp: firebase.firestore.Timestamp.now()
        });

        messageInput.value = "";
        Catch();

    }
}

function displayMessages(content, usertype) {
    var chatMessagesElement = document.getElementById("chat-messages");
    var messageElement = document.createElement("p");
    messageElement.textContent = content;
    if (usertype != sendertype) {
        messageElement.style.alignSelf = "start"
    }
    chatMessagesElement.appendChild(messageElement);
}

function Catch() {
    db.collection("mensagens").where("session", "==", eid).where("read", "==", "false").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            content = doc.data().content;
            usertype = doc.data().sendertype;
            return db.collection("mensagens").doc(doc.id).update({
                read: 'true'
            }).then(() => {
                displayMessages(content);
            });
        });
    });
}