const socket = io.connect(`http://49.50.167.217:8000/notification`, {
    path: "/socket.io", cors: { origin: '*' }
});
socket.on("notification", () => {
    document.querySelector(".notification").innerText = parseInt(document.querySelector(".notification").innerText) + 1;
});
socket.on("chatNoti",()=>{
    console.log("sfdsf");
    document.querySelector(".fa-regular.fa-comments div").innerText = parseInt(document.querySelector(".fa-regular.fa-comments div").innerText )+1;
});
const noti = document.querySelector(".notification");
axios.get("/user/notification").then((result) => {
    console.log(result.data);
    noti.innerText = result.data.cnt;
});
document.querySelector(".fa-heart.fa-regular").addEventListener("click", async (event) => {
    if (event.target.getAttribute("class") != 'fa-regular fa-heart') {
        return;
    }
    console.log(event.target.getAttribute("value"));
    if (event.target.getAttribute("value") == '0') {
        document.querySelector(".notification").innerText = '0';
        event.target.setAttribute("value", '1');
        const div = document.createElement("div");
        div.classList.add("notificationInfo");
        const data = await axios.get("/user/notificationInfo");
        console.log(data.data);
        if (data.data.data.length != 0) {
            data.data.data.forEach((ele) => {
                const info = document.createElement("div");
                info.classList.add("notiInfo");
                const wrapper = document.createElement("div");
                wrapper.setAttribute("onclick", `location.href="/profile?id=${ele.sender}"`);
                wrapper.setAttribute("style", "cursor:pointer;")
                wrapper.classList.add("profileWrapper");
                const img = document.createElement("img");
                img.setAttribute("src", ele['send.profile']);
                img.classList.add("notificationProfile");
                const nickName = document.createElement("span");
                nickName.innerText = ele['send.nickName'];
                nickName.classList.add("notificationNickName");
                let content = document.createElement("div");
                if (ele.type == "like") {
                    content.classList.add("typeLike");
                    content.setAttribute("onclick", `getItem(${ele.PostId})`);
                    content.innerText = "?????? ???????????? ???????????????";
                    info.setAttribute("url", ele.PostId);
                }
                else if (ele.type == "follow") {
                    content.classList.add("typeFollow");
                    content.innerText = "?????? ???????????? ????????? ??????";


                }
                else {
                    content.classList.add("typeComment");
                    content.setAttribute("onclick", `getItem(${ele.PostId})`);
                    content.innerText = "?????? ????????? ????????????"
                    info.setAttribute("url", ele.PostId);
                }
                const time = document.createElement("div");
                time.classList.add("notiTime");
                time.innerText = ele.time;

                wrapper.appendChild(img);
                wrapper.appendChild(nickName);
                info.appendChild(wrapper);
                info.appendChild(content);
                info.appendChild(time);
                div.appendChild(info);

            });

        }
        else {
            const noShow = document.createElement("div");
            noShow.classList.add("noNoti");
            const span = document.createElement("span");
            const span2 = document.createElement("span");
            span.classList.add("noShowTitle");
            span.innerText = "????????? ????????? ?????????!";
            span2.classList.add("noShowInfo");
            span2.innerText = "????????? ????????? 24??????????????? ????????? ????????????!";
            noShow.appendChild(span);
            noShow.appendChild(span2);
            div.appendChild(noShow);
        }

        event.target.appendChild(div);
    }
    else {
        event.target.setAttribute("value", '0');
        document.querySelector(".notificationInfo").remove();
    }

});

const chatNoti = document.querySelector(".fa-regular.fa-comments div");
axios.get("/chat/chatnoti").then(result=>{
    
    chatNoti.innerText=result.data.cnt;
});