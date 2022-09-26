const socket = io.connect(`http://localhost:8000/notification`, {
    path: "/socket.io",
  });
socket.on("notification",()=>{
    document.querySelector(".notification").innerText=parseInt(document.querySelector(".notification").innerText)+1;
    console.log("asdsadas");
});