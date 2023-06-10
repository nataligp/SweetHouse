var uid = ""
var url_string = window.location.href;
var url = new URL(url_string);
var eid = url.searchParams.get("id");
var sid = "";

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
            var chatMessagesElement = document.getElementById("chat-messages");
            var messageElement = document.createElement("p");
            messageElement.textContent = content;
            chatMessagesElement.appendChild(messageElement);
            chatMessagesElement.scrollTop = chatMessagesElement.scrollHeight;
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
    var data = new Date()

    if (messageContent.trim() !== "") {
        db.collection("mensagens").add({
            session: eid,
            sender: uid,
            content: messageContent,
            read: 'false',
            timestamp: firebase.firestore.Timestamp.now()
        });

        messageInput.value = "";
        Catch();

    }
}

function displayMessages(content) {
    var chatMessagesElement = document.getElementById("chat-messages");
    var messageElement = document.createElement("p");
    messageElement.textContent = content;
    chatMessagesElement.appendChild(messageElement);
}

function Catch() {
    db.collection("mensagens").where("session", "==", eid).where("read", "==", "false").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            content = doc.data().content;
            return db.collection("mensagens").doc(doc.id).update({
                read: 'true'
            }).then(() => {
                displayMessages(content);
            });
        });
    });
}