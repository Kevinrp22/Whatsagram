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
  { key: "⇧", specialClass: "mayus-key" },
  { key: "z" },
  { key: "x" },
  { key: "c" },
  { key: "v" },
  { key: "b" },
  { key: "n" },
  { key: "m" },
  { key: "←", specialClass: "delete-key" },
  { key: "," },
  { key: "‎ ‏", specialClass: "space-key" },
  { key: "." },
  { key: "C" },
  { key: "CE" },
  { key: "→" },
  { key: "↲" },
];
const messages = [];
const inputMessage = document.querySelector("#keyboard__header__input");
const contentMessages = document.querySelector("#messages");

function renderButtons() {
  const buttons = document.querySelector("#keyboard__buttons");

  keys.forEach((element) => {
    buttons.innerHTML += `<button class="keyboard__buttons__key ${
      element.specialClass || ""
    }"
    onclick="pressKey('${element.key}')"
    >${element.key}</button>`;
  });
}

function pressKey(key) {
  inputMessage.value += key;
}

function sendMessage() {
  const date = new Date();
  const newMessage = {
    id: 1,
    date: {
      day: date.toLocaleDateString("es", { weekday: "long" }), // Lunes, martes, miercoles, jueves, viernes, etc..
      month: date.getMonth(),
      year: date.getFullYear(),
      hour: date.getHours(),
      minute: date.getMinutes(),
    },
    message: inputMessage.value,
  };
  messages.push(newMessage);
  console.log(messages);
  inputMessage.value = ""
  renderMessages();
}

function renderMessages() {
  messages.forEach((item) => {
    contentMessages.innerHTML += `
    <div class="message">
          <span class="message__text">${item.message}</span>
          <span class="message__date">${item.date.hour}:${item.date.minute > 10 ? item.date.minute : "0" + item.date.minute}</span>
    </div>
    `;
  });
}

window.addEventListener("load", renderButtons);
