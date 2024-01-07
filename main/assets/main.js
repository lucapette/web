import {
  createIcons,
  Mail,
  Twitter,
  Linkedin,
  Github,
  Moon,
  Sun,
} from "lucide";

createIcons({
  icons: {
    Mail,
    Twitter,
    Linkedin,
    Github,
    Moon,
    Sun,
  },
});

const toggle = document.getElementById("toggle");

toggle.addEventListener("click", function () {
  e.preventDefault();
  document.documentElement.classList.toggle("dark");
  localStorage.setItem(
    "theme",
    localStorage.getItem("theme") == "light" ? "dark" : "light",
  );
});

console.info(
  "Hi 👋👋👋. Grab the code here: https://github.com/lucapette/website",
);
