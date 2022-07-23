/// <reference types="cypress" />

context("First Login Pruebas Funcionalidad", () => {
  // Asiganamos valor a nuestra url segun nuestra variable global en cypress.json
  const url = Cypress.env("url");
  const user = Cypress.env("users");
  beforeEach(() => {
    // Visitamos la URL BASE y seleccionamos los campos
    cy.visit(url.visit);
    //Ingresamos nuestras credenciales de logeo
    cy.get('input[formControlName="username"]')
      .click({ force: true })
      .type(user.userFirstLogin.username, { force: true })
      .should("have.value", user.userFirstLogin.username);

    cy.get('input[formControlName="password"]')
      .click({ force: true })
      .type(user.userFirstLogin.password, { force: true })
      .should("have.value", user.userFirstLogin.password);
    //Interceptamos nuestro service signon
    cy.intercept({
      method: "POST",
      url: url.service + "/auth/login",
    }).as("signon");

    //Realizamos click en el boton entrar
    cy.get('button[type="submit"]').click({ force: true });
    //Esperamos la llamada y carga del servicio sigon
    cy.wait("@signon");
  });

  it("Primer Login Cancelar", () => {
    //Verificamos que llame nuestro SweetAlert First Login
    cy.get("h2.swal2-title")
      .invoke("text")
      .then((text) => {
        expect(text.trim()).to.equal("Es su primer login");
      });
    cy.get("div.swal2-html-container")
      .invoke("text")
      .then((text) => {
        expect(text.trim()).to.equal("Se recomienda cambiar su contraseña");
      });
    cy.get("button.swal2-cancel")
      .invoke("text")
      .then((text) => {
        expect(text.trim()).to.equal("Cancelar");
      });
    cy.get("button.swal2-cancel").click({ force: true });
    //Verificamos que nos encontremos en la pantalla cambio de login
    cy.url().should("include", "/login");
  });

  it("Primer Login Confirmed", () => {
    //Verificamos que llame nuestro SweetAlert First Login
    cy.get("h2.swal2-title")
      .invoke("text")
      .then((text) => {
        expect(text.trim()).to.equal("Es su primer login");
      });
    cy.get("div.swal2-html-container")
      .invoke("text")
      .then((text) => {
        expect(text.trim()).to.equal("Se recomienda cambiar su contraseña");
      });
    cy.get("button.swal2-confirm")
      .invoke("text")
      .then((text) => {
        expect(text.trim()).to.equal("Confirmar");
      });
    cy.get("button.swal2-confirm").click({ force: true });
    //Verificamos que nos encontremos en la pantalla cambio de contraseña
    cy.url().should("include", "/change-password");
  });

  it("Primer Login ChangePassword volver a login a demanda", () => {
    //Verificamos que llame nuestro SweetAlert First Login
    cy.get("h2.swal2-title")
      .invoke("text")
      .then((text) => {
        expect(text.trim()).to.equal("Es su primer login");
      });
    cy.get("div.swal2-html-container")
      .invoke("text")
      .then((text) => {
        expect(text.trim()).to.equal("Se recomienda cambiar su contraseña");
      });
    cy.get("button.swal2-confirm")
      .invoke("text")
      .then((text) => {
        expect(text.trim()).to.equal("Confirmar");
      });
    cy.get("button.swal2-confirm").click({ force: true });
    //Verificamos que nos encontremos en la pantalla cambio de contraseña
    cy.url().should("include", "/change-password");

    // Realizamos click en el boton Atras
    cy.get("#atras").click({ force: true });

    //Verificamos que nos encontremos en la pantalla de login
    cy.url().should("include", "/login");
  });

  it("Confirmamos cambios de contraseña en primer login", () => {
    //Verificamos que llame nuestro SweetAlert First Login
    cy.get("h2.swal2-title")
      .invoke("text")
      .then((text) => {
        expect(text.trim()).to.equal("Es su primer login");
      });
    cy.get("div.swal2-html-container")
      .invoke("text")
      .then((text) => {
        expect(text.trim()).to.equal("Se recomienda cambiar su contraseña");
      });
    cy.get("button.swal2-confirm")
      .invoke("text")
      .then((text) => {
        expect(text.trim()).to.equal("Confirmar");
      });
    cy.get("button.swal2-confirm").click({ force: true });
    //Verificamos que nos encontremos en la pantalla cambio de login
    cy.url().should("include", "/change-password");
  });
});
