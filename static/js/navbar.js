

function posting(){
    const formData = new FormData();
    
    const file = document.getElementById("postingFile");
    const content = $("#content").val();

    console.log(+file.value);
    if(file.value == ""){
        alert("사진을 등록해 주세요");
        
    }
    else{

    
    

    formData.append("postFile",file.files[0]);
    formData.append("content",content);
    axios({
      headers:{
                    "Content-Type":"multipart/form-data",
                },
                url: "/posting/uploads",
                method: "post",
                data: formData

    }).then((response)=>{
        if(response.data.code == 200){
            alert("등록 성공!");
            window.location ="/"
        }
        else{
            alert("등록 실패!");
        }
    })
    }
  }