function follow(id) {
    var data = {
        id: id,
    };
    console.log(id);
    axios({
        url: "/recommend/follow",
        method: "post",
        data: data,
    }).then((response) => {
        window.location.href = `http://localhost:8000/`;
    });
}

function unfollow(id) {
    var data = {
        id: id,
    };
    console.log(id);
    axios({
        url: "/recommend/unfollow",
        method: "post",
        data: data,
    }).then((response) => {
        window.location.href = `http://localhost:8000/`;
    });
}

function getRecList() {
    axios({
        url: "/recommend",
        method: "get"
      }).then((response) => {
        otherD = response.data.otherData;
        console.log("oD", response);
        myD = response.data.myData;
        $("#recModal #recommendList").empty();
        $("#recModal .myprofile").empty();
        var myForm = $("#recModal .myprofile");
        var myDiv = document.createElement("div");
        myDiv.innerHTML =
          `<div class="recUser">
                      <div style="cursor: pointer"  onclick="location.href='profile?id=${myD.id}';" >
                        <img class="recProfile" src="${myD.profile}" alt="">
                        <span class="recUserName">${myD.nickName}</span>
                      </div>
                        &nbsp;
                        <span class="recUserEmail">${myD.email}</span>
                      </div>`;
        myForm.append(myDiv);
        

        // 팔로우 추천 기능
        var form = $("#recModal #recommendList");
        for (var i = 0; i < otherD.length; i++) {
          var div = document.createElement("div");
          var text;
          text =
            `<div class="recUser">
                      <div style="cursor: pointer"  onclick="location.href='profile?id=${otherD[i].id}';" >
                        <img class="recProfile" src="${otherD[i].profile}" alt="">
                        <span class="recUserName">${otherD[i].nickName}</span>
                      </div>
                        &nbsp;
                        <span class="recUserEmail">${otherD[i].email}</span>
                      </div>`;
          if (response.data.hasFriend == false){
            text += `<div class = "recBottmom"><span class="recCnt">TOP ${i+1}. ${otherD[i].cnt}명이 팔로우중입니다.</span><button class = "followButton" onclick ="follow(${otherD[i].id});">팔로우</button></div>`
          }
          else if (otherD[i].cnt > 1) {
            text += `<div class = "recBottmom"><span class="recCnt">${otherD[i].friend}님 외 ${otherD[i].cnt-1} 명이 팔로우중입니다.</span><button class = "followButton" onclick ="follow(${otherD[i].id});">팔로우</button></div>`
          } else {
            text += `<div class = "recBottmom"><span class="recCnt">${otherD[i].friend}님이 팔로우중입니다.</span><button class = "followButton" onclick ="follow(${otherD[i].id});">팔로우</button></div>`
          };
          div.innerHTML = text;
          form.append(div);
        }
      })
    $("#recModal").modal('show');
}