let tabs = document.querySelectorAll(".tabs div");
let line = document.getElementById("line");

console.log(tabs[0]);

for (let i = 1; i < tabs.length; i++) {
  tabs[i].addEventListener("click", function (event) {
    filter(event);
  });
}

function filter(event) {
  if (event) {
    mode = event.target.id;
    line.style.width = event.target.offsetWidth + "px";
    line.style.left = event.target.offsetLeft + "px";
    line.style.top =
      event.target.offsetTop + (event.target.offsetHeight - 58) + "px";
  }
}
