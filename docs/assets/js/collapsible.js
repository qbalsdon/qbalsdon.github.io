function setUpCollapsible() {
    var coll = document.getElementsByClassName("collapsible");
    var i;

    for (i = 0; i < coll.length; i++) {
      coll[i].addEventListener("click", function() {
        this.classList.toggle("active");
        // var content = this.nextElementSibling;

        var content = document.getElementById(this.dataset.expands)
        if (content.style.display === "block") {
          content.style.display = "none";
          this.classList.remove("expanded");
        } else {
          content.style.display = "block";
          this.classList.add("expanded");
        }
      });
    }
}
