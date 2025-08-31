const nameInput = document.getElementById("inp-name");
const contactInput = document.getElementById("inp-contact");
const btnSaveContact = document.getElementById("btn-save-contact");
const sectionContacList = document.getElementById("contact-list");
const messageError = document.getElementById("message-error");
const messageErroText = document.getElementById("message-error-text");
const inputElements = document.querySelectorAll(".inputElement");
const sessionStorageName = "contactList";

let hasErros = {};
let deleteItems = document.querySelectorAll(".btn-delete");
let contctsList = getListOnSession();

function getListOnSession() {
  let contactListSession =
    JSON.parse(sessionStorage.getItem(sessionStorageName)) ?? [];

  return contactListSession;
}

function saveOnSession() {
  let mylistString = JSON.stringify(contctsList);

  sessionStorage.setItem(sessionStorageName, mylistString);
}

window.addEventListener(
  "DOMContentLoaded",
  generateContactListProcess(contctsList)
);

btnSaveContact.addEventListener("click", (ev) => {
  let currentContact = { id: 0, name: "", contact: "" };

  currentContact.id = contctsList.length;
  currentContact.name = nameInput.value;
  currentContact.contact = contactInput.value;

  fillErrosList();

  hasErros ? showMessageError(hasErros.descption) : hideMessageError();

  if (hasErros) {
    return;
  }

  contctsList.push(currentContact);
  generateContactListProcess(contctsList);
});

function generateContactList(items) {
  let contactList = items.map((item) => {
    return `<div class="contact-registered">
    <div class="contact-info">
      <p class="name-contact">${item.name}</p>
      <p class="contact-number">${item.contact}</p>
    </div>
    <div class="contact-options">
      <button class="btn-delete" name="${item.id}">Delete</button>
    </div>
  </div>`;
  });

  contactList = contactList.join("");

  sectionContacList.innerHTML = contactList;
}

function generateContactListProcess(contctsList) {
  generateContactList(contctsList);
  deleteItems = document.querySelectorAll(".btn-delete");
  createClickContacts(deleteItems);
  saveOnSession();
}

function deleteItemByIndex(ev) {
  let itemId = ev.target.name;

  index = contctsList.findIndex((itemList) => {
    return itemList.id == itemId;
  });

  if (index >= 0) {
    contctsList.splice(index, 1);
    generateContactListProcess(contctsList);
  }
}

function createClickContacts(deleteItems) {
  deleteItems.forEach((item) => {
    item.addEventListener("click", (ev) => {
      deleteItemByIndex(ev);
    });
  });
}

function hideMessageError() {
  messageError.classList.remove("showMessageError");
  messageErroText.textContent = "";
}

function showMessageError(paramMessageError) {
  messageError.classList.add("showMessageError");
  messageErroText.textContent = paramMessageError;
}

function changeBorderInputIsWrong(inputElement) {
  if (!inputElement.value) {
    inputElement.classList.add("wrongInputChangeBorder");
  } else {
    inputElement.classList.remove("wrongInputChangeBorder");
  }
}

function hasInfoInputs() {
  let hasInfo = true;
  inputElements.forEach((element) => {
    hasInfo = hasInfo && element.value != "";
  });

  return hasInfo;
}

inputElements.forEach((element) => {
  element.addEventListener("input", (ev) => {
    hideMessageError();
    if (isNaN(ev.currentTarget.value)) {
      ev.currentTarget.value = "";
    }
  });
  element.addEventListener("focusout", (ev) => {
    changeBorderInputIsWrong(ev.currentTarget);
  });
});

function removeSpaces(prString) {
  return prString.split(" ").join("");
}

function contactAlreadyExists() {
  return contctsList.find((itemList) => {
    let ehIgual =
      itemList.name == nameInput.value &&
      removeSpaces(itemList.contact) == removeSpaces(contactInput.value);

    return ehIgual;
  });
}

function contactLengthIsCorrect() {
  console.log(contactInput.value.length >= contactInput.minLength);

  return contactInput.value.length >= contactInput.minLength;
}

function fillErrosList() {
  let hasErro = false;
  hasErros = null;

  hasErro = !hasInfoInputs();
  if (hasErro) {
    hasErros = {};
    hasErros.descption = "You must fill all the inputs to save a contact!";
    return;
  }

  hasErro = !contactLengthIsCorrect();
  if (hasErro) {
    hasErros = {};
    hasErros.descption =
      "The contact info must be equals or greater than 10 characters!";
    return;
  }

  hasErro = contactAlreadyExists();
  if (hasErro) {
    hasErros = {};
    hasErros.descption = "This contact info already exists!";
    return;
  }
}
