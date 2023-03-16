/**
 * @jest-environment jsdom
 */

import "@testing-library/jest-dom";
import { screen, waitFor, getByTestId, fireEvent } from "@testing-library/dom";
import NewBillUI from "../views/NewBillUI.js";
import NewBill from "../containers/NewBill.js";
import mockStore from "../__mocks__/store.js";
import { ROUTES_PATH } from "../constants/routes.js";
import { localStorageMock } from "../__mocks__/localStorage.js";
import router from "../app/Router.js";
import { bills } from "../fixtures/bills";
import { handle } from "express/lib/application";
import userEvent from "@testing-library/user-event";

describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
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

      window.onNavigate(ROUTES_PATH.NewBill);

      await waitFor(() => screen.getByTestId("icon-mail"));
      const mailIcon = screen.getByTestId("icon-mail");

      expect(mailIcon.className).toContain("active-icon");
    });

    test("Then I show the form ", () => {
      const html = NewBillUI();

      document.body.innerHTML = html;

      expect(screen.getByTestId("expense-name")).toBeTruthy();
      expect(screen.getByTestId("datepicker")).toBeTruthy();
      expect(screen.getByTestId("amount")).toBeTruthy();
      expect(screen.getByTestId("vat")).toBeTruthy();
      expect(screen.getByTestId("pct")).toBeTruthy();
      expect(screen.getByTestId("commentary")).toBeTruthy();
      expect(screen.getByTestId("file")).toBeTruthy();
      expect(screen.getByRole("button")).toBeTruthy();
    });

    describe("When I submit the form", () => {
      test("Then I upload a file in right format", () => {
        const html = NewBillUI();
        document.body.innerHTML = html;

        mockStore.bills = jest.fn().mockImplementation(() => {
          return {
            create: () => {
              return Promise.resolve({});
            },
          };
        });

        const onNavigate = (pathname) => {
          document.body.innerHTML = pathname;
        };

        const newBill = new NewBill({
          document,
          onNavigate,
          store: mockStore,
          bills,
          localStorage: window.localStorage,
        });

        const handleChangeFile = jest.fn(newBill.handleChangeFile);
        const inputFile = screen.getByTestId("file");

        inputFile.addEventListener("change", handleChangeFile);

        fireEvent.change(inputFile, {
          target: {
            files: [new File(["file.jpg"], "file.jpg", { type: "file/jpg" })],
          },
        });

        expect(inputFile).toBeTruthy();

        expect(handleChangeFile).toHaveBeenCalled();
      });
      test("Then I upload a file in wrong format", () => {
        const html = NewBillUI();

        document.body.innerHTML = html;

        mockStore.bills = jest.fn().mockImplementation(() => {
          return {
            create: () => {
              return Promise.resolve({});
            },
          };
        });

        const onNavigate = (pathname) => {
          document.body.innerHTML = pathname;
        };

        const newBill = new NewBill({
          document,
          onNavigate,
          store: mockStore,
          bills,
          localStorage: window.localStorage,
        });

        const handleChangeFile = jest.fn(newBill.handleChangeFile);
        const inputFile = screen.getByTestId("file");

        inputFile.addEventListener("change", handleChangeFile);

        // On fourni un fichier image invalide pour véri
        fireEvent.change(inputFile, {
          target: {
            files: [new File(["image.iso"], "image.iso", { type: "file/iso" })],
          },
        });

        const fileErrorMessage = screen.getByTestId("file-error-message");
        expect(fileErrorMessage).toHaveStyle("display: block");
        /*
        fireEvent.change(inputFile, {
          target: {
            files: [
              new File(["image.jpg"], "image.jpg", { type: "image/jpeg" }),
            ],
          },
        });

        expect(fileErrorMessage).toHaveStyle("display: none");
        */
        fireEvent.change(inputFile, {
          target: {
            files: [
              new File(["image.png"], "image.png", {
                type: "image/png",
              }),
            ],
          },
        });

        expect(fileErrorMessage).toHaveStyle("display: none");

        expect(inputFile).toBeTruthy();
        expect(handleChangeFile).toHaveBeenCalled();
      });
    });

    test("Then the new bill is created", () => {
      const html = NewBillUI();

      document.body.innerHTML = html;

      mockStore.bills = jest.fn().mockImplementation(() => {
        return {
          create: () => {
            return Promise.resolve({});
          },
        };
      });

      const onNavigate = (pathname) => {
        document.body.innerHTML = pathname;
      };

      const newBill = new NewBill({
        document,
        onNavigate,
        store: mockStore,
        localStorage: window.localStorage,
      });

      const bill = {
        email: "cedric.hiely@billed.com",
        type: "Restaurants et bars",
        name: "Repas d'affaire",
        amount: 60,
        date: "2021-11-22",
        vat: 10,
        pct: 20,
        commentary: "Repas pour la vente",
        fileUrl: "bill-efgh.jpg",
        fileName: "bill-efgh.jpg",
        status: "pending",
      };

      screen.getByTestId("expense-name").value = bill.name;
      screen.getByTestId("datepicker").value = bill.date;
      screen.getByTestId("amount").value = bill.amount;
      screen.getByTestId("vat").value = bill.vat;
      screen.getByTestId("pct").value = bill.pct;
      screen.getByTestId("commentary").value = bill.commentary;
      newBill.fileName = bill.fileName;
      newBill.fileUrl = bill.fileUrl;

      const form = screen.getByTestId("form-new-bill");
      newBill.updateBill = jest.fn();

      const submitForm = jest.fn((e) => {
        newBill.handleSubmit(e);
      });

      form.addEventListener("submit", submitForm);
      fireEvent.submit(form);

      expect(submitForm).toHaveBeenCalled();

      expect(newBill.updateBill).toHaveBeenCalled();
    });

    test("Then the Error 500", async () => {
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

      window.onNavigate(ROUTES_PATH.NewBill);

      const newBill = new NewBill({
        document,
        onNavigate,
        store: mockStore,
        localStorage: window.localStorage,
      });

      mockStore.bills = jest.fn().mockImplementation(() => {
        return {
          update: () => {
            return Promise.reject(new Error("Erreur 500"));
          },
        };
      });

      const form = screen.getByTestId("form-new-bill");

      newBill.updateBill = jest.fn();

      const submitForm = jest.fn((e) => {
        newBill.handleSubmit(e);
      });

      form.addEventListener("submit", submitForm);
      fireEvent.submit(form);

      jest.spyOn(console, "error").mockImplementation(() => {});

      await new Promise(process.nextTick);

      expect(console.error).toBeCalled();
    });
  });
});
