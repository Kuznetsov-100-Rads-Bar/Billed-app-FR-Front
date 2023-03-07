/**
 * @jest-environment jsdom
 */

import { screen, waitFor } from "@testing-library/dom";
import BillsUI from "../views/BillsUI.js";
import { bills } from "../fixtures/bills.js";
import { ROUTES, ROUTES_PATH } from "../constants/routes.js";
import { localStorageMock } from "../__mocks__/localStorage.js";

import mockStore from "../__mocks__/store.js";
import Bills from "../containers/Bills.js";
import router from "../app/Router.js";
import userEvent from "@testing-library/user-event";

describe("Étant donné que je suis connecté en tant qu'employé", () => {
  describe("Quand je suis sur la page Factures", () => {
    test("Ensuite, l'icône de la facture dans la disposition verticale doit être mise en surbrillance", async () => {
      Object.defineProperty(window, "localStorage", {
        value: localStorageMock,
      });
      window.localStorage.setItem(
        "user",
        JSON.stringify({
          type: "Employee",
        })
      );
      const root = document.createElement("div");
      root.setAttribute("id", "root");
      document.body.append(root);
      router();
      window.onNavigate(ROUTES_PATH.Bills);
      await waitFor(() => screen.getByTestId("icon-window"));
      const windowIcon = screen.getByTestId("icon-window");
      //to-do write expect expression
      expect(windowIcon.className).toContain("active-icon");
    });
    test("Ensuite, les factures doivent être commandées du plus ancien au plus tard", () => {
      document.body.innerHTML = BillsUI({ data: bills });
      const dates = screen
        .getAllByText(
          /^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i
        )
        .map((a) => a.innerHTML);
      const antiChrono = (a, b) => (a < b ? 1 : 0);
      const datesSorted = [...dates].sort(antiChrono);
      expect(dates).toEqual(datesSorted);
    });
  });

  describe("Lorsque je clique sur le bouton 'Nouvelle note de frais'", () => {
    test("Ensuite, il devrait rediriger vers la page NewBill", () => {
      Object.defineProperty(window, "localStorage", {
        value: localStorageMock,
      });

      window.localStorage.setItem("user", JSON.stringify({ type: "Employee" }));
      const html = BillsUI({ data: bills });
      document.body.innerHTML = html;

      const onNavigate = (pathname) => {
        document.body.innerHTML = pathname;
      };

      const billsContainer = new Bills({
        document,
        onNavigate,
        store: mockStore,
        localStorage: window.localStorage,
      });

      const button = screen.getByTestId("btn-new-bill");
      const handleClickNewBill = jest.fn(billsContainer.handleClickNewBill);
      button.addEventListener("click", handleClickNewBill);
      userEvent.click(button);
      expect(handleClickNewBill).toHaveBeenCalled();
    });
  });

  describe("Lorsque je clique sur le bouton 'IconEye'", () => {
    test("Ensuite un modal devrait s'ouvrir", () => {
      Object.defineProperty(window, "localStorage", {
        value: localStorageMock,
      });
      window.localStorage.setItem("user", JSON.stringify({ type: "Employee" }));

      const html = BillsUI({ data: bills });
      document.body.innerHTML = html;

      const billsContainer = new Bills({
        document,
        onNavigate,
        store: mockStore,
        localStorage: window.localStorage,
      });

      $.fn.modal = jest.fn();
      const iconEye = screen.getAllByTestId("icon-eye")[0];
      const handleShowModalFile = jest.fn((e) => {
        billsContainer.handleClickIconEye(e.target);
      });

      iconEye.addEventListener("click", handleShowModalFile);
      userEvent.click(iconEye);

      expect(handleShowModalFile).toHaveBeenCalled();
      expect(screen.getAllByText("Justificatif")).toBeTruthy();
    });
  });

  describe("Fetch data", () => {
    test("Then fetch data", async () => {
      localStorage.setItem(
        "user",
        JSON.stringify({ type: "Employee", email: "joanna.binet@billed.com" })
      );

      const element = document.createElement("div");
      element.setAttribute("id", "root");
      document.body.append(element);
      router();

      window.onNavigate(ROUTES_PATH.Bills);
      await waitFor(() => screen.getByText("Mes notes de frais"));
      expect(screen.getByText("Mes notes de frais")).toBeTruthy();
    });

    describe("Quand je récupère les factures", () => {
      test("Ensuite, il devrait afficher les factures", async () => {
        const bills = new Bills({
          document,
          onNavigate,
          store: mockStore,
          localStorage: window.localStorage,
        });

        const getBills = jest.fn(() => bills.getBills());
        const result = await getBills();
        expect(getBills).toHaveBeenCalled();
        expect(result.length).toBe(4);
      });
    });

    test("Ensuite, il devrait renvoyer un message error 400", async () => {
      mockStore.bills = jest.fn().mockImplementation(() => {
        Promise.reject(new Error("Erreur 404"));
      });
      const html = BillsUI({ error: "Erreur 404" });
      document.body.innerHTML = html;
      const errorMessage = screen.getByText(/Erreur 404/);
      expect(errorMessage).toBeTruthy();
    });

    test("Ensuite, il devrait renvoyer un message error 500", async () => {
      mockStore.bills = jest.fn().mockImplementation(() => {
        Promise.reject(new Error("Erreur 500"));
      });
      const html = BillsUI({ error: "Erreur 500" });
      document.body.innerHTML = html;
      const errorMessage = screen.getByText(/Erreur 500/);
      expect(errorMessage).toBeTruthy;
    });
  });
});
