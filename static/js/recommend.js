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