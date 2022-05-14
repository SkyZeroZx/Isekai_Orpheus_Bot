/// <reference types="cypress" />

context("Tramites Pruebas Funcionalidad", () => {
  // Asiganamos valor a nuestra url segun nuestra variable global en cypress.json
  const url = Cypress.env("url");
  const user = Cypress.env("userExito");
  beforeEach(() => {
    cy.visit(url.visit);
    //Ingresamos nuestras credenciales de logeo
    cy.get('input[formControlName="username"]')
      .click({ force: true })
      .type(user.username, { force: true })
      .should("have.value", user.username);

    cy.get('input[formControlName="password"]')
      .click({ force: true })
      .type(user.password, { force: true })
      .should("have.value", user.password);
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

  it("Dashboard validacion interfaz", () => {
    // Validamos placerholder de fecha Inicio y fin
    cy.get("input[formControlName=dateInit]")
      .invoke("attr", "placeholder")
      .should("contain", "Fecha Inicio");

    cy.get("input[formControlName=dateEnd]")
      .invoke("attr", "placeholder")
      .should("contain", "Fecha Fin");

    // Validamos el texto de los selectores
    cy.get("select[formControlName=tramite]")
      .invoke("text")
      .then((text) => {
        expect(text.trim()).to.equal("Elige un tramite");
      });

    cy.get("select[name=tramite1]")
      .invoke("text")
      .then((text) => {
        expect(text.trim()).to.equal("Tramite 1");
      });

    cy.get("select[name=tramite2]")
      .invoke("text")
      .then((text) => {
        expect(text.trim()).to.equal("Tramite 2");
      });

    cy.get("select[name=tramiteBarra]")
      .invoke("text")
      .then((text) => {
        expect(text.trim()).to.equal("Elige un tramite");
      });

    cy.get("select[name=tramitePie]")
      .invoke("text")
      .then((text) => {
        expect(text.trim()).to.equal("Elige un tramite");
      });
    // Validamos el span donde se encuentra el usuario logeado en el NavBar
    cy.get("span[id=usuarioLogeado]")
      .invoke("text")
      .then((text) => {
        expect(text.trim()).to.equal(user.username);
      });

    // Validamos en el sidebar nuestras rutas  Dashboard y Tramites
    cy.get("ul.navbar-nav  > li.nav-item.ng-star-inserted").then((element) => {
      expect(element[0].innerText).to.equal("Dashboard");
      expect(element[1].innerText).to.equal("Tramites");
    });
    // Validamos nuestro titulo sea Dashboard
    cy.get("#navbar-main")
      .invoke("text")
      .then((text) => {
        expect(text.trim()).to.contains("Dashboard");
      });
  });


  
});
