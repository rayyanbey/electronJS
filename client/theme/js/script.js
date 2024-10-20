const form = document.querySelector("#img-form");
const img = document.querySelector("#img");
const outputPath = document.querySelector("#output-path");
const filename = document.querySelector("#filename");
const heightInput = document.querySelector("#height");
const widthInput = document.querySelector("#width");

img.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (isImage(file)) {
        form.style.display = "block";
        filename.innerText = file.name;
        //output path
        outputPath.innerText = path.join(os.homedir(), "imageshrink");

        //get original dim
        const image = new Image();
        image.onload = function() {
            widthInput.value = this.width;
            heightInput.value = this.height;
        };
        image.src = URL.createObjectURL(file); // Set the src attribute
    } else {
        console.log("Please upload an image file");
        return;
    }
    console.log("Success");
});

//check if the file is an image
const isImage = (file) => {
    const types = ["image/png", "image/jpeg", "image/jpg", "image/gif"];
    return types.includes(file.type);
};
