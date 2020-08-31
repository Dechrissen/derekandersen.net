// Get footer
var f = document.getElementsByTagName("footer");
var footer = f[0];

// Get last modified date and make string
const modified = new Date(document.lastModified);
let options = { year: 'numeric', month: 'long', day: 'numeric'};
var my_date = modified.toLocaleString('en-GB', options);
var updated = "Last updated " + my_date

// Insert copyright line and modified date into <i> within <footer>
var i_elem = document.createElement("i");
var copyright = document.createTextNode("© 2020 Derek Andersen – " + updated);
i_elem.appendChild(copyright);
footer.appendChild(i_elem);