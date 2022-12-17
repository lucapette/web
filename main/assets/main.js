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

function toggleTheme() {
  document.documentElement.classList.toggle("dark");
  localStorage.setItem(
    "theme",
    localStorage.getItem("theme") == "light" ? "dark" : "light"
  );
}

window.toggleTheme = toggleTheme;

console.info(
  "Hi 👋👋👋. Grab the code here: https://github.com/lucapette/website"
);
