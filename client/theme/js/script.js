const form = document.querySelector('#img-form');
const img = document.querySelector('#img');
const outputPath = document.querySelector('#output-path');
const filename = document.querySelector('#filename');
const heightInput = document.querySelector('#height');
const widthInput = document.querySelector('#width');



img.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if(isImage(file)){

  }
  else{
    console.log("Please upload an image file");
    return
  }
  console.log("Success")

})

//check if the file is an image

const isImage = (file)=>{
   const types = ["image/png", "image/jpeg", "image/jpg", "image/gif"];
   return types.includes(file.type);
}