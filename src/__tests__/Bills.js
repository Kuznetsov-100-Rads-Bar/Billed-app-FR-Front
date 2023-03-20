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

describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    test("Then bill icon in vertical layout should be highlighted", async () => {
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
    test("Then bills should be ordered from earliest to latest", () => {
      document.body.innerHTML = BillsUI({ data: bills });
      const dates = screen
        .getAllByText(
          /^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i
        )
        .map((a) => a.innerHTML);
      const antiChrono = (a, b) => (a < b ? 1 : -1);
      const datesSorted = [...dates].sort(antiChrono);
      expect(dates).toEqual(datesSorted);
    });
  });

  describe("When I click on 'Nouvelle note de frais' button", () => {
    test("Then it should redirect to NewBill page", () => {
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

  describe("When I click on the 'IconEye' button", () => {
    test("Then a modal should open", () => {
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

    describe("When I fetch bills", () => {
      test("Then it should display bills", async () => {
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

    test("Then it should return error 404 message", async () => {
      mockStore.bills = jest.fn().mockImplementation(() => {
        Promise.reject(new Error("Erreur 404"));
      });
      const html = BillsUI({ error: "Erreur 404" });
      document.body.innerHTML = html;
      const errorMessage = screen.getByText(/Erreur 404/);
      expect(errorMessage).toBeTruthy();
    });

    test("Then it should return error 500 message", async () => {
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
