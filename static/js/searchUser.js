
$('#searchUser').bind("input",async (event)=>{   
    if(event.target.value.length==0){
        if (document.querySelectorAll(".searchUserInfo")){
            document.querySelectorAll(".searchUserInfo").forEach(ele=>{
                ele.remove();
            });
        }
    } 
    else{
        const form = document.querySelector("#searchUserForm");
        if(!document.querySelector(".searchUserInfo")){
            const div = document.createElement("div");
            div.classList.add("searchUserInfo");
            form.appendChild(div);
        }
        const data = await axios.get(`/user?search=${event.target.value}`);
        console.log(data.data);
        if (data.data.length==0){
            if(!document.querySelector(".noResult")){
                const p =  document.createElement("p");
                p.classList.add("noResult");
                p.innerText="검색 결과가 없습니다";
                document.querySelector(".searchUserInfo").appendChild(p);
            }
            if(document.querySelectorAll(".userLink")){
                document.querySelectorAll(".userLink").forEach(ele=>{
                    ele.remove();
                })
            }
        }
        else{
            if(document.querySelector(".noResult")){
                document.querySelector(".noResult").remove();
            }
            if(document.querySelectorAll(".userLink")){
                document.querySelectorAll(".userLink").forEach(ele=>{
                    ele.remove();
                });
            }
            data.data.forEach((ele)=>{
                const div = document.querySelector(".searchUserInfo");
                const a = document.createElement("a");
                const span = document.createElement("span");
                const email = document.createElement("span");
                email.classList.add("userEmail");
                email.innerText=ele.email;
                span.classList.add("userName");
                span.innerText=ele.nickName;
                a.setAttribute("href",`/profile?id=${ele.id}`);
                a.classList.add("userLink");
                const img = document.createElement("img");
                img.classList.add("userProfile");
                img.setAttribute("src",ele.profile);
                a.appendChild(img);
                a.appendChild(span);
                a.appendChild(email);
                div.appendChild(a);
            });
        }
    }


});