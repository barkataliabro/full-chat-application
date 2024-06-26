
const url = `https://api.cloudinary.com/v1_1/dqeneupli/auto/upload`


const upload = async (file)=>{
const formData = new FormData();
formData.append("file", file);
formData.append("upload_preset", "Chat-app-file");

const response =  await fetch(url, {
    method: "post",
    body: formData,
})


const responseData = await response.json()



return responseData
}

export default upload