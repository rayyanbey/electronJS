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
        alertError("Please select an image file (png, jpeg, jpg, gif)");
        return;
    }
    alertSuccess("Image selected successfully");
});


form.addEventListener("submit", async (e) => {
    e.preventDefault()

    const width = widthInput.value
    const height = heightInput.value 
    const imagePath = img.files[0].path

    if(!img.files[0]){
        alertError("Please upload an image");
        return
    }

    if(width === "" || height === ""){
        alertError("Please enter valid dimensions");
        return
    }

    //send to main using IPC renderer

    ipcRenderer.send('image:resize', {
        imagePath,
        width,
        height
    })
})

//Get Response from Main
ipcRenderer.on('image:done',()=>{
    alertSuccess("Image Resized")
})











//Utilities 
const isImage = (file) => {
    const types = ["image/png", "image/jpeg", "image/jpg", "image/gif"];
    return types.includes(file.type);
};


function alertError(message){
    Toastify.toast({
        text:message,
        duration: 5000,
        close: false,
        style:{
            background: "red",
            color: 'white',
            textAlign: 'center'
        }
    })
}

function alertSuccess(message){
    Toastify.toast({
        text:message,
        duration: 5000,
        close: false,
        style:{
            background: "green",
            color: 'white',
            textAlign: 'center'
        }
    })
}
