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

/**
 * Función que se ejecutará nada más iniciar la aplicación (main)
 */
function initApplication() {
  renderButtons(); // Mostrar el teclado.
  getEmojis().then((data) => {
    //Obtener los emojis
    emojis = data;
    renderEmojis();
  });

  getGifs().then((data) => {
    //Obtener los gifs
    gifs = data.results;
    renderGifs();
  });
}

/**
 * Mostrar el teclado con su teclas
 * @param {boolean} reset - Resetar los botones dejando el teclado vacío
 */
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

/**
 * Renderizar los emojis
 */
function renderEmojis() {
  const excludeEmojis = "🥸|🥲|☺️|🤌"; //Posibles emojis que no puede soportar un navegador en específico
  const numEmojis = 29; //cantidad de emojis a mostrar
  emojis
    .slice(0, numEmojis)
    .filter((emoji) => emoji.character != excludeEmojis.match(emoji.character))
    .forEach((emoji) => {
      content_emojis.innerHTML += `
    <button class="keyboard__buttons__key" onclick="pressKey('${emoji.character}')">${emoji.character}</button>
    `;
    });
}

/**
 * Función que al presionar una tecla, la pintará en el recuadro de texto
 * @param {string} key , la tecla presionada
 */
function pressKey(key) {
  changeInputMessageValue(inputMessage.value + key); // Actualizamos el valor del recuadro de texto con la tecla presionada
  if (forceMayus) return; // Si está activada las dobles mayúsculas, finaliza la ejecución.
  if (isMayus) handleKeySize("lower"); // si está activa la mayúsculas, pondrá el teclado en minúscula
}

/**
 * Función que envía el mensaje
 * @param {string} gif contendrá el gif (src)
 */
function sendMessage(gif) {
  if (inputMessage.value == "" && !gif) return false; // Condicional que filtra para no enviar algo vacío
  const newMessage = {
    id: 1,
    date: generateTodaysDate(), // Función helper que generá un objeto con la fecha.
    message: gif ? false : convertLineFeedHTML(inputMessage.value),
    media: {
      gif: gif ?? false,
    },
  };
  chat.displayDay = showDayInChat();
  setMessages(newMessage);
  changeInputMessageValue("");
}

/**
 * Función que renderiza los mensajes
 */
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

/**
 * Función que renderiza el dia en el contendor de mensajes.
 */
function renderDayBox() {
  const date = new Date();
  const today = date.getDate();
  const monthString = date.toLocaleDateString("es", { month: "long" });
  contentMessages.innerHTML += `<div class="day_chat">${today} de ${monthString} </div>`;
}

/**
 * Función que verifica si en el dia ya se ha enviado un mensaje, por lo que no tiene que volver a motrar el dia.
 * @returns boolean
 */
function showDayInChat() {
  const today = new Date().getDate();
  return chat.messages.find((msg) => msg.date.day === today) ? false : true;
}

/**
 * Función que según condición modificará el teclado de minúsculas a maýusulas y viceversa
 * @param {boolean} dblclick si ha hecho doble click.
 */
function mayusKey(dblclick) {
  if (dblclick) {
    handleKeySize("upper");
    forceMayus = true;
    return;
  }
  forceMayus ? (forceMayus = false) : forceMayus;
  isMayus ? handleKeySize("lower") : handleKeySize("upper");
}

/**
 * Función helper encargada de modificar a minúsculas a maýusulas y viceversa
 * @param {string} option string "upper" o "lower"
 */
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

/**
 * Función encargada de eliminar el contenedio del recuadro de texto
 */
function deleteValueInputMessage() {
  changeInputMessageValue("");
}

/**
 * Función encargada de eliminar la última palabra del recuadro de texto
 */
function deleteLastWordInputMessage() {
  const newTextMessage = inputMessage.value.trimEnd().split(" ");
  newTextMessage.pop();
  changeInputMessageValue(newTextMessage.join(" "));
}

/**
 * Función encargada de eliminar la última letra del recuadro de texto
 */
function deleteLastCharInputMessage() {
  changeInputMessageValue(inputMessage.value.slice(0, -1));
}

/**
 * Función encargada de eliminar la primera letra del recuadro de texto
 */
function deleteFirstCharInputMessage() {
  changeInputMessageValue(inputMessage.value.substring(1));
}

/**
 * Función encargada de agregar un salto de línea al recuadro de texto
 */
function addLineFeedtoInputMessage() {
  const newMessage = (inputMessage.value += "\n");
  changeInputMessageValue(newMessage);
}

/**
 * Función encargada de cambiar los saltos de línea "\n" por <br/>
 * @param {string} txt el valor del recuadro de texto
 * @returns nuevo texto con saltos de línea soportados por HTML
 */
function convertLineFeedHTML(txt) {
  return txt.replaceAll("\n", "<br/>");
}

/**
 * Función asíncronca encargada de hacer una peticíon para obtener los emojis
 * @description En un princípio obtenia los datos de una api, pero la api permite 
 * solo unas ciertas llamadas y luego no deja hacer peticiones, por lo que he optado 
 * por crear un archivo emoji.json para que no pase ese error.
 * @returns lista de emojis en formato JSON
 */
async function getEmojis() {
  const data = await fetch("emojis.json");
  return data.json();
}

/**
 * Función encargada de mostrar y/o ocultar los contenedores emojis y teclado
 */
function handleEmojiButton() {
  let emojiButtonClass = document.querySelector("#emoji-icon-btn").classList;
  let buttons_area = document.querySelector(".keyboard__buttons");
  let emojis_area = document.querySelector(".keyboard__emojis");

  emojiButtonClass.toggle("fa-keyboard");
  buttons_area.classList.toggle("hide");
  emojis_area.classList.toggle("show");
  content_emojis.classList.toggle("show");
}

/**
 * Función encargada de mover el cursor del recuadro de texto hasta abajo
 */
function moveCusorToBottom() {
  document.querySelector(".keyboard__content_input").scrollTop =
    document.querySelector(".keyboard__content_input").scrollHeight;
}

/**
 * Funcíon encargada de mover la vista hacia el último mensaje
 */
function moveViewToLastMessage() {
  contentMessages.scrollTop = contentMessages.scrollHeight;
}

/**
 * Función encargada de modificar el "height" del recuadro de texto.
 * @description Al hacer salto de línea o escribir mucho, el contenedor
 * del recuadro de texto, necesita crecer.
 */
function autoResizeInput() {
  inputMessage.style.height = "auto";
  inputMessage.style.height = inputMessage.scrollHeight + "px";
}

/**
 * Función helper que anida 2 funciones, calcular el "height" del recuadro de texto y 
 * mover el cursor del recuadro de texto hasta abajo
 */
function reloadChangesTextArea() {
  autoResizeInput();
  moveCusorToBottom();
}

/**
 * Función encargada de añadir el valor del parámetro al recuadro de texto
 * @param {string} txt texto para poner en el recuadro de texto. Se espera un Char
 */
function changeInputMessageValue(txt) {
  inputMessage.value = txt;
  inputMessage.focus();
  reloadChangesTextArea();
}

/**
 * Función asíncrona encargada de obtener los gifs
 * @param {string} req valor usado como búsqueda.
 * @returns 
 */
async function getGifs(req) {
  const KEY = "3E5Z53GVH0XY";
  const URL = "https://g.tenor.com/v1/search?";
  const data = await fetch(`${URL}q=${req}&key=${KEY}`);
  return data.json();
}

/**
 * Función encargada de mostrar el contenedor de los gifs y ocultar el de los emojis
 */
function handleGifsButton() {
  if (!content_gifs.classList.contains("show")) {
    content_gifs.classList.toggle("show-grid");
    content_emojis.classList.toggle("show");
  }
}

/**
 *  Función encargada de mostrar el contenedor de los emojis y ocultar el de los gifs
 */
function handleEmojiArea() {
  if (!content_emojis.classList.contains("show")) {
    content_emojis.classList.toggle("show");
    content_gifs.classList.toggle("show-grid");
  }
}

/**
 * Función encargada de renderizar los gifs
 */
function renderGifs() {
  gifs.forEach((gif) => {
    content_gifs.innerHTML += `
     <div class="keyboard__content__gifs__box" onclick="sendMessage('${gif.media[0].gif.url}')">
      <img class="keyboard__content__gifs__gif" src="${gif.media[0].gif.url}"/> 
     </div>

  `;
  });
}

/**
 * Función encargada de mostrar la camará
 */
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

/**
 * Función encargada de cerrar la camará
 */
function closeCamera() {
  window.localStream.getTracks().forEach(function (track) {
    track.stop();
  });
  document.querySelector(".phone__camera").classList.toggle("show");
}

/**
 * Función encargada de hacer una captura de video. "selfie"
 */
function takeASnapshot() {
  let canvas = document.querySelector("#canvas"); //Obtenemos el lienzo
  canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height); //generemos imagen a partir del lienzo con el video.
  let image = canvas.toDataURL("image/jpeg", 1.0);// Necesario para convertir en formato de imagen
  sendSnapshot(image); // Envíamos el selfie
  closeCamera(); // cerramos la camara
}

/**
 * Función que envía la foto capturada de la webcam
 * @param {string} photo  
 */
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

/**
 * Función encargada de devolver la fecha 
 * @returns objeto con los datos de la fecha
 */
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

/**
 * Función encargada de añadir el mensaje al array de mensajes
 * @param {string} newMessage mensaje
 */
function setMessages(newMessage) {
  chat.displayDay = showDayInChat();
  chat.messages = [...chat.messages, newMessage];
  renderMessages();
  moveViewToLastMessage();
}

window.addEventListener("load", initApplication);
