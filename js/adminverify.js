function getQueryParams() {
    const params = Object.fromEntries(new URLSearchParams(location.search));
    return params;
}

var params = getQueryParams();
var verify = params.verify;
if (!verify) {
    window.location.href="index.html";
}

document.getElementById("system").addEventListener("click", () => {
    window.location = "home.html?verify=true";
});
document.getElementById("regusers").addEventListener("click", () => {
    window.location = "users.html";
});