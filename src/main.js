const keys = [
  { key: "q" },
  { key: "w" },
  { key: "e" },
  { key: "r" },
  { key: "t" },
  { key: "y" },
  { key: "u" },
  { key: "i" },
  { key: "o" },
  { key: "p" },
  { key: "a" },
  { key: "s" },
  { key: "d" },
  { key: "f" },
  { key: "g" },
  { key: "h" },
  { key: "j" },
  { key: "k" },
  { key: "l" },
  { key: "ñ" },
  { key: "⇧" , specialClass:"mayus-key"},
  { key: "z" },
  { key: "x" },
  { key: "c" },
  { key: "v" },
  { key: "b" },
  { key: "n" },
  { key: "m" },
  { key: "←", specialClass:"delete-key" },
  { key: "," },
  { key: "‎ ‏", specialClass: "space-key" },
  { key: "." },
  { key: "C" },
  { key: "CE" },
  { key: "→" },
  { key: "↲" },
];
const buttons = document.querySelector(".keyboard__buttons");

keys.forEach((element) => {
  buttons.innerHTML += `<button class="keyboard__buttons__key ${
    element.specialClass || ''
  }">${element.key}</button>`;
});
