function getQueryParams() {
    const params = Object.fromEntries(new URLSearchParams(location.search));
    return params;
}

var params = getQueryParams();
var verify = params.verify;
if (!verify) {
    window.location.href="index.html";
}

document.getElementById("newproject").addEventListener("click", () => {
    window.location = "mcreate.html";
});
document.getElementById("checklist").addEventListener("click", () => {
    window.location = "mprojectlist.html";
});