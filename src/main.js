let keys = [
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
  {
    key: "⇧",
    specialClass: "mayus-key",
    functionName: "mayusKey",
    extraEvents: "ondblclick",
    extraParameters: true,
  },
  { key: "z" },
  { key: "x" },
  { key: "c" },
  { key: "v" },
  { key: "b" },
  { key: "n" },
  { key: "m" },
  {
    key: "←",
    specialClass: "delete-key",
    functionName: "deleteLastCharInputMessage",
  },
  { key: "," },
  { key: "‎ ‏", specialClass: "space-key" },
  { key: "." },
  { key: "C", functionName: "deleteValueInputMessage" },
  { key: "CE", functionName: "deleteLastWordInputMessage" },
  { key: "→", functionName: "deleteFirstCharInputMessage" },
  { key: "↲", functionName: "addLineFeedtoInputMessage" },
];
let isMayus = false;
let forceMayus = false;
let emojis = [];
let gifs = [];
const chat = { displayDay: false, messages: [] };
const inputMessage = document.querySelector("#keyboard__header__input");
const contentMessages = document.querySelector("#messages");
const content_emojis = document.querySelector(".keyboard__content__emojis");
const content_gifs = document.querySelector(".keyboard__content__gifs");

let video = document.querySelector("#phone__camera__video");

function initApplication() {
  renderButtons();

  getEmojis().then((data) => {
    emojis = data;
    renderEmojis();
  });

  getGifs().then((data) => {
    gifs = data.results;
    renderGifs();
  });
}

function renderButtons(reset) {
  const buttons = document.querySelector(".keyboard__buttons");
  if (reset) {
    buttons.innerHTML = "";
  }
  keys.forEach((element) => {
    buttons.innerHTML += `
    <button class="keyboard__buttons__key ${element.specialClass || ""}"
    ${
      element.functionName
        ? `onclick="${element.functionName}()"`
        : `onclick="pressKey('${element.key}')"`
    }
    ${
      element.extraEvents
        ? `${element.extraEvents}="${element.functionName}(${
            element.extraParameters && element.extraParameters
          })"`
        : ""
    }
    
    >${element.key}</button>`;
  });
}

function renderEmojis() {
  const excludeEmojis = "🥸|🥲|☺️|🤌";
  const numEmojis = 29;
  emojis
    .slice(0, numEmojis)
    .filter((emoji) => emoji.character != excludeEmojis.match(emoji.character))
    .forEach((emoji) => {
      content_emojis.innerHTML += `
    <button class="keyboard__buttons__key" onclick="pressKey('${emoji.character}')">${emoji.character}</button>
    `;
    });
}

function pressKey(key) {
  changeInputMessageValue(inputMessage.value + key);
  if (forceMayus) return;
  if (isMayus) handleKeySize("lower");
}

function sendMessage(gif) {
  if (inputMessage.value == "" && !gif) return false;
  const date = new Date();
  const newMessage = {
    id: 1,
    date: {
      day: date.getDate(),
      dayString: date.toLocaleDateString("es", { weekday: "long" }), // Lunes, martes, miercoles, jueves, viernes, etc..
      month: date.getMonth(),
      year: date.getFullYear(),
      hour: date.getHours(),
      minute: date.getMinutes(),
    },
    message: gif ? false : convertLineFeedHTML(inputMessage.value),
    media: {
      gif: gif ?? false,
    },
  };
  chat.displayDay = showDayInChat();
  setMessages(newMessage);
  changeInputMessageValue("");
}

function renderMessages() {
  contentMessages.innerHTML = "";
  renderDayBox();
  chat.messages.forEach((item) => {
  
    contentMessages.innerHTML += ` 
    <div class="message">
          <span class="message__text">${
            item.media.gif
              ? `<img class="message__gif" src="${item.media.gif}" />`
              : item.media.photo
              ? `<img class="message__photo" src="${item.media.photo}" />`
              : item.message
          }</span>
          <span class="message__date">${item.date.hour}:${
      item.date.minute >= 10 ? item.date.minute : "0" + item.date.minute
    }</span>
    <span class="message__check"><i class="fas fa-check"></i></span>
    </div>
    `;
  });
}

function renderDayBox() {
  const date = new Date();
  const today = date.getDate();
  const monthString = date.toLocaleDateString("es", { month: "long" });
  contentMessages.innerHTML += `<div class="day_chat">${today} de ${monthString} </div>`;
}

function showDayInChat() {
  const today = new Date().getDate();
  return chat.messages.find((msg) => msg.date.day === today) ? false : true;
}

function mayusKey(dblclick) {
  if (dblclick) {
    handleKeySize("upper");
    forceMayus = true;
    return;
  }

  forceMayus ? (forceMayus = false) : forceMayus;

  isMayus ? handleKeySize("lower") : handleKeySize("upper");
}

function handleKeySize(option) {
  keys = keys.map((item) => {
    return option == "upper"
      ? { ...item, key: item.key.toUpperCase() }
      : option == "lower"
      ? { ...item, key: item.key.toLowerCase() }
      : console.warn("Error pasando los parámetros en la función.");
  });
  isMayus = !isMayus;
  renderButtons(true);
}

function deleteValueInputMessage() {
  changeInputMessageValue("");
}

function deleteLastWordInputMessage() {
  const newTextMessage = inputMessage.value.trimEnd().split(" ");
  newTextMessage.pop();
  changeInputMessageValue(newTextMessage.join(" "));
}

function deleteLastCharInputMessage() {
  changeInputMessageValue(inputMessage.value.slice(0, -1));
}

function deleteFirstCharInputMessage() {
  changeInputMessageValue(inputMessage.value.substring(1));
}

function addLineFeedtoInputMessage() {
  const newMessage = (inputMessage.value += "\n");
  changeInputMessageValue(newMessage);
}

function convertLineFeedHTML(txt) {
  return txt.replaceAll("\n", "<br/>");
}

async function getEmojis() {
  const data = await fetch("emojis.json");

  return data.json();
}

function handleEmojiButton() {
  let emojiButtonClass = document.querySelector("#emoji-icon-btn").classList;
  let buttons_area = document.querySelector(".keyboard__buttons");
  let emojis_area = document.querySelector(".keyboard__emojis");

  emojiButtonClass.toggle("fa-keyboard");
  buttons_area.classList.toggle("hide");
  emojis_area.classList.toggle("show");
  content_emojis.classList.toggle("show");
}
function moveCusorToBottom() {
  document.querySelector(".keyboard__content_input").scrollTop =
    document.querySelector(".keyboard__content_input").scrollHeight;
}

function moveViewToLastMessage() {
  contentMessages.scrollTop = contentMessages.scrollHeight;
}

function autoResizeInput() {
  inputMessage.style.height = "auto";
  inputMessage.style.height = inputMessage.scrollHeight + "px";
}
function reloadChangesTextArea() {
  autoResizeInput();
  moveCusorToBottom();
}
function changeInputMessageValue(txt) {
  inputMessage.value = txt;
  inputMessage.focus();
  reloadChangesTextArea();
}
async function getGifs(req) {
  const KEY = "3E5Z53GVH0XY";
  const URL = "https://g.tenor.com/v1/search?";
  const data = await fetch(`${URL}q=${req}&key=${KEY}`);
  return data.json();
}

function handleGifsButton() {
  if (!content_gifs.classList.contains("show")) {
    content_gifs.classList.toggle("show-grid");
    content_emojis.classList.toggle("show");
  }
}

function handleEmojiArea() {
  if (!content_emojis.classList.contains("show")) {
    content_emojis.classList.toggle("show");
    content_gifs.classList.toggle("show-grid");
  }
}

function renderGifs() {
  gifs.forEach((gif) => {
    content_gifs.innerHTML += `
     <div class="keyboard__content__gifs__box" onclick="sendMessage('${gif.media[0].gif.url}')">
      <img class="keyboard__content__gifs__gif" src="${gif.media[0].gif.url}"/> 
     </div>

  `;
  });
}

function showCamera() {
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
      window.localStream = stream;
      video.srcObject = stream;
      video.play();
      document.querySelector(".phone__camera").classList.toggle("show");
    });
  } else {
    alert("Tu dispositivo no es compatible para mostrar la cámara");
  }
}

function closeCamera() {
  window.localStream.getTracks().forEach(function (track) {
    track.stop();
  });
   document.querySelector(".phone__camera").classList.toggle("show");
}

function takeASnapshot() {
  let canvas = document.querySelector("#canvas");
  canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);
  let image = canvas.toDataURL("image/jpeg", 1.0);
  sendSnapshot(image);
  closeCamera();
}

function sendSnapshot(photo) {
  const newMessage = {
    id: 1,
    date: generateTodaysDate(),
    message: false,
    media: {
      gif: false,
      photo,
    },
  };
  setMessages(newMessage);
}

function generateTodaysDate() {
  const date = new Date();
  return {
    day: date.getDate(),
    dayString: date.toLocaleDateString("es", { weekday: "long" }), // Lunes, martes, miercoles, jueves, viernes, etc..
    month: date.getMonth(),
    year: date.getFullYear(),
    hour: date.getHours(),
    minute: date.getMinutes(),
  };
}

function setMessages(newMessage) {
  chat.displayDay = showDayInChat();
  chat.messages = [...chat.messages, newMessage];
  renderMessages();
  moveViewToLastMessage();
}

window.addEventListener("load", initApplication);
