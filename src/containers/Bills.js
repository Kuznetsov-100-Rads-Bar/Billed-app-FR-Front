import { ROUTES_PATH } from "../constants/routes.js";
import { formatDate, formatStatus } from "../app/format.js";
import Logout from "./Logout.js";

export default class {
  constructor({ document, onNavigate, store, localStorage }) {
<<<<<<< HEAD
    this.document = document
    this.onNavigate = onNavigate
    this.store = store
    const buttonNewBill = document.querySelector(
      `button[data-testid="btn-new-bill"]`
      );
    if (buttonNewBill)
     buttonNewBill.addEventListener('click', this.handleClickNewBill);
    const iconEye = document.querySelectorAll(`div[data-testid="icon-eye"]`);
    if (iconEye)
      iconEye.forEach((icon) => {
      icon.addEventListener('click', () => this.handleClickIconEye(icon));
    });
=======
    this.document = document;
    this.onNavigate = onNavigate;
    this.store = store;
    const buttonNewBill = document.querySelector(
      `button[data-testid="btn-new-bill"]`
    );
    if (buttonNewBill)
      buttonNewBill.addEventListener("click", this.handleClickNewBill);
    const iconEye = document.querySelectorAll(`div[data-testid="icon-eye"]`);
    if (iconEye)
      iconEye.forEach((icon) => {
        icon.addEventListener("click", () => this.handleClickIconEye(icon));
      });
>>>>>>> 2743c392cc992bff907e01a1e8154ee72a35c1d6
    new Logout({ document, localStorage, onNavigate });
  }

  handleClickNewBill = () => {
<<<<<<< HEAD
    this.onNavigate(ROUTES_PATH['NewBill']);
=======
    this.onNavigate(ROUTES_PATH["NewBill"]);
>>>>>>> 2743c392cc992bff907e01a1e8154ee72a35c1d6
  };

  handleClickIconEye = (icon) => {
    const billUrl = icon.getAttribute("data-bill-url");
<<<<<<< HEAD
    const imgWidth = Math.floor($('#modaleFile').width() * 0.5);
    $('#modaleFile')
    .find(".modal-body")
    .html(
      `<div style='text-align: center;' class="bill-proof-container"><img width=${imgWidth} src=${billUrl} alt="Bill" /></div>`
      );
    $('#modaleFile').modal('show');
=======
    const imgWidth = Math.floor($("#modaleFile").width() * 0.5);
    $("#modaleFile")
      .find(".modal-body")
      .html(
        `<div style='text-align: center;' class="bill-proof-container"><img width=${imgWidth} src=${billUrl} alt="Bill" /></div>`
      );
    $("#modaleFile").modal("show");
>>>>>>> 2743c392cc992bff907e01a1e8154ee72a35c1d6
  };

  getBills = () => {
    if (this.store) {
      return this.store
<<<<<<< HEAD
      .bills()
      .list()
      .then(snapshot => {
        const bills = snapshot.map((doc) => {
=======
        .bills()
        .list()
        .then((snapshot) => {
          const bills = snapshot.map((doc) => {
>>>>>>> 2743c392cc992bff907e01a1e8154ee72a35c1d6
            try {
              return {
                ...doc,
                // date: formatDate(doc.date),
                status: formatStatus(doc.status),
              };
<<<<<<< HEAD
            } catch(e) {
=======
            } catch (e) {
>>>>>>> 2743c392cc992bff907e01a1e8154ee72a35c1d6
              // if for some reason, corrupted data was introduced, we manage here failing formatDate function
              // log the error and return unformatted date in that case
              console.log(e, "for", doc);
              return {
                ...doc,
                date: doc.date,
                status: formatStatus(doc.status),
              };
            }
          });
<<<<<<< HEAD
          console.log('length', bills.length);
        return bills;
      });
=======
          console.log("length", bills.length);
          return bills;
        });
>>>>>>> 2743c392cc992bff907e01a1e8154ee72a35c1d6
    }
  };
}
