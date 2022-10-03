function posting() {
  const formData = new FormData();

  const file = document.getElementById("postingFile");
  const content = $("#content").val();
  if (file.value == "") {
    swal("","사진을 최소 한개 이상 올려주세요","warning");
    return;
  }
  for (let i = 0; i < file.files.length; i++) {
    formData.append("files", file.files[i]);
  }
  formData.append("content", content);
  axios({
    headers: {
      "Content-Type": "multipart/form-data",
    },
    url: "/posting/uploads",
    method: "post",
    data: formData,
  }).then((response) => {
    if (response.data.code == 200) {
      swal("", "새 게시글 포스팅 성공!", "success").then((value) => {
        window.location = "/";
      });
    } else {
      swal("", "게시글 포스팅 실패", "error");
    }
  });
}
