/// <reference types="cypress" />

context("Seguridad Rutas Pruebas Funcionalidad", () => {
  // Asiganamos valor a nuestra url segun nuestra variable global en cypress.json
  const url = Cypress.env("url");
  const user = Cypress.env("users");
  beforeEach(() => {
    // Visitamos la URL BASE 
    cy.visit(url.visit);
  });

  it("Seguridad Rutas General Tramitador - Admin", () => {
    //Ingresamos nuestras credenciales de logeo
    cy.get('input[formControlName="username"]')
      .click({ force: true })
      .type(user.userTramitador.username, { force: true })
      .should("have.value", user.userTramitador.username);

    cy.get('input[formControlName="password"]')
      .click({ force: true })
      .type(user.userTramitador.password, { force: true })
      .should("have.value", user.userTramitador.password);
    //Interceptamos nuestro service signon
    cy.intercept({
      method: "POST",
      url: url.service + "/auth/login",
    }).as("signon");

    //Realizamos click en el boton entrar
    cy.get('button[type="submit"]').click({ force: true });
    //Esperamos la llamada y carga del servicio sigon
    cy.wait("@signon");
    //Verificamos que nos encontremos en la pantalla cambio de dashboard
    cy.url().should("include", "/dashboard");
    //Verificamos en el localstorage que el item usuarioLogueado sea nuestro username

    // Intentamos entrar a la ruta de administracion de usuarios desde el tramitador
    cy.visit(url.visit + "/users");
    // Validamos que sigamos en dashboard
    cy.url().should("include", "/dashboard");
    // Intentamos entrar a la ruta de administracion de documentos desde el tramitador
    cy.visit(url.visit + "/documentos");
    // Validamos que sigamos en dashboard
    cy.url().should("include", "/dashboard");
    // Validamos Guard de Login
    cy.visit(url.visit + "/login");
    // Validamos que sigamos en dashboard por consecuencia no estamos deslogeado
    cy.url().should("include", "/dashboard");
  });

  it("Seguridad Rutas  General Admin - Tramitador", () => {
    // Intentamos entrar a ruta dashboard sin estar logeado
    cy.visit(url.visit + "/dashboard");
    // Validamos que sigamos en login
    cy.url().should("include", "/login");
    // Intentamos entrar a la ruta de administracion de usuarios
    cy.visit(url.visit + "/users");
    // Validamos que sigamos en login
    cy.url().should("include", "/login");
    // Intentamos entrar a la ruta de administracion de documentos
    cy.visit(url.visit + "/documentos");
    // Validamos que sigamos en login
    cy.url().should("include", "/login");
    // Intentamos entrar a la ruta de cambio de contraseña
    cy.visit(url.visit + "/change-password");
    // Validamos que sigamos en login
    cy.url().should("include", "/login");
  });

  it("Seguridad Rutas First Login", () => {
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
    // Esperamos medio segundo para que cargue el Alert
    cy.wait(500);
    // Realizamos click en confirmar para redirigirnos a change-password
    cy.get("button.swal2-confirm").click({ force: true });
    //Verificamos que nos encontremos en la pantalla cambio de contraseña
    cy.url().should("include", "/change-password");

    // Intentamos entrar a ruta dashboard
    cy.visit(url.visit + "/dashboard");
    // Validamos que sigamos en change-password
    cy.url().should("include", "/change-password");
    // Intentamos entrar a la ruta de administracion de usuarios
    cy.visit(url.visit + "/users");
    // Validamos que sigamos en change-password
    cy.url().should("include", "/change-password");
    // Intentamos entrar a la ruta de administracion de documentos
    cy.visit(url.visit + "/documentos");
    // Validamos que sigamos en change-password
    cy.url().should("include", "/change-password");

    // Intentamos entrar a la ruta de administracion de tramites
    cy.visit(url.visit + "/tramites");
    // Validamos que sigamos en change-password
    cy.url().should("include", "/change-password");
  });
});
