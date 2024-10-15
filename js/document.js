import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import { getStorage, ref, uploadBytes, getDownloadURL, listAll } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-storage.js";

const firebaseConfig = {
    apiKey: "AIzaSyAUps0u952FCNFslPPn0VOwtVQLXEg1JnM",
    authDomain: "construction-industry-wi-70272.firebaseapp.com",
    databaseURL:
    "https://construction-industry-wi-70272-default-rtdb.firebaseio.com",
    projectId: "construction-industry-wi-70272",
    storageBucket: "construction-industry-wi-70272.appspot.com",
    messagingSenderId: "494097993743",
    appId: "1:494097993743:web:85219ddf87e2e9ae75d37a",
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

function getQueryParams() {
    const params = Object.fromEntries(new URLSearchParams(location.search));
    return params;
}

async function uploadImage() {
    var params = getQueryParams();
    var projectName = params.file;
    const fileInput = document.getElementById("fileInput");
    const file = fileInput.files[0];

    if (file) {
    const storageRef = ref(storage, `${projectName}/${file.name}`);
    await uploadBytes(storageRef, file);
    }

    getImage();
}

async function getImage() {
    var params = getQueryParams();
    var projectName = params.file;
    const listRef = ref(storage, projectName);

    // Find all the prefixes and items.
    listAll(listRef)
    .then((res) => {
        res.items.forEach((itemRef) => {
        console.log(itemRef.toString().split('/'));
        const imageName = itemRef.toString().split('/')[4];
        getDownloadURL(ref(storage, projectName + '/' + imageName))
            .then((url) => {
                if (imageName.includes(".docx")) {
                    $(".uploaded-images").append(`<a href="${url}"><img src="images/mword.png" style="width:42px;height:42px;">${imageName}</a>`);
                } else if (imageName.includes(".xlsx")) {
                    $(".uploaded-images").append(`<a href="${url}"><img src="images/mexcel.png" style="width:42px;height:42px;">${imageName}</a>`);
                } else if (imageName.includes(".ppt")) {
                    $(".uploaded-images").append(`<a href="${url}"><img src="images/mpoint.png" style="width:42px;height:42px;">${imageName}</a>`);
                } else {
                    $(".uploaded-images").append(`<a href="${url}"><img src="images/imglogo.png" style="width:42px;height:42px;">${imageName}</a>`);
                }
            })
            .catch((error) => {
            // Handle any errors
            });

        });
    }).catch((error) => {
        // Uh-oh, an error occurred!
    });
}

const uploadButton = document.getElementById("uploadImage");
uploadButton.addEventListener('click', uploadImage);
getImage();
