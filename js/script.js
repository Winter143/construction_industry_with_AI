// setting up firebase with our website
const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyAUps0u952FCNFslPPn0VOwtVQLXEg1JnM",
    authDomain: "construction-industry-wi-70272.firebaseapp.com",
    projectId: "construction-industry-wi-70272",
    storageBucket: "construction-industry-wi-70272.appspot.com",
    messagingSenderId: "494097993743",
    appId: "1:494097993743:web:85219ddf87e2e9ae75d37a",
});
const db = firebaseApp.firestore();
const auth = firebaseApp.auth();

// Sign In function
const signIn = () => {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    // firebase code
    firebase.auth().signInWithEmailAndPassword(email, password)
        .then((result) => {
            if (password.includes("planning")) {
                window.location.href="main.html?verify=true";
            } else if (password.includes("manager")) {
                window.location.href="home.html?verify=true";
            } else if (password.includes("admin")) {
                window.location.href="admin.html?verify=true";
            } else {
                window.location.href="menu.html?verify=true";
            }
        })
        .catch((error) => {
            alert("Password incorrect. Please try again.")
            console.log(error.code);
            console.log(error.message)
        });
}