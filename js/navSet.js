firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    document.getElementById("header").style.display = "none";
    document.getElementById("navheaderLogin").style.display = "flex";
  } else {
    document.getElementById("navheaderLogin").style.display = "none";
    document.getElementById("header").style.display = "flex";
  }
});