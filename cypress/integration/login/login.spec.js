/// <reference types="cypress" />

context("Login Pruebas Funcionalidad", () => {
  // Asiganamos valor a nuestra url segun nuestra variable global en cypress.json
  const url = Cypress.env("url");
  const user = Cypress.env("userExito");
  beforeEach(() => {
    // Visitamos la URL BASE y seleccionamos los campos
    cy.visit(url.visit);
  });

  it("Login Exitoso", () => {
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
    //Verificamos que nos encontremos en la pantalla cambio de dashboard
    cy.url().should("include", "/dashboard");
    //Verificamos en el localstorage que el item usuarioLogueado sea nuestro username
    cy.url().should(() => {
      expect(JSON.parse(localStorage.getItem("user")).username).to.eq(user.username);
    });
  });

  it("Login Usuario y/o contraseña incorrecta", () => {
    //Ingresamos nuestras credenciales de logeo erroneas
    cy.get('input[formControlName="username"]')
      .click({ force: true })
      .type("usernameTest@mail.com", { force: true });

    cy.get('input[formControlName="password"]')
      .click({ force: true })
      .type("TEST_PASSWORD", { force: true });

    //Interceptamos nuestro service signon
    cy.intercept({
      method: "POST",
      url: url.service + "/auth/login",
    }).as("signon");

    //Realizamos click en el boton entrar
    cy.get('button[type="submit"]').click({ force: true });
    //Esperamos la llamada y carga del servicio sigon
    cy.wait("@signon");
    // Verificamos nuestro toast error
    cy.get("#toast-container")
      .find("div")
      .find("div")
      .contains("Error")
      .invoke("text")
      .then((text) => {
        expect(text.trim()).to.equal("Error");
      });
    // Verificamos el contenido de nuestro toast error
    cy.get("#toast-container")
      .find("div")
      .find("div")
      .contains("incorrect")
      .invoke("text")
      .then((text) => {
        expect(text.trim()).to.equal("Username or password incorrect!");
      });
  });

  it("Error al loguear(Mock Service)", () => {
    //Ingresamos nuestras credenciales de logeo
    cy.get('input[formControlName="username"]')
      .click({ force: true })
      .type(user.username, { force: true })
      .should("have.value", user.username);

    cy.get('input[formControlName="password"]')
      .click({ force: true })
      .type(user.password, { force: true })
      .should("have.value", user.password);
    //Interceptamos nuestro service signon y forzamos un error
    cy.intercept("POST", url.service + "/auth/login", {
      forceNetworkError: true,
    }).as("signon");
    //Realizamos click en el boton entrar
    cy.get('button[type="submit"]').click({ force: true });
    // Llamamos nuestra intercepcion y esperamos
    cy.wait("@signon");
    // Verificamos nuestro toast error
    cy.get("#toast-container")
      .find("div")
      .find("div")
      .contains("Error")
      .invoke("text")
      .then((text) => {
        expect(text.trim()).to.equal("Error");
      });
    // Verificamos el contenido de nuestro toast error
    cy.get("#toast-container")
      .find("div")
      .find("div")
      .contains("logearse")
      .invoke("text")
      .then((text) => {
        expect(text.trim()).to.equal("Error al logearse");
      });
  });

  it("Login Validaciones Campos", () => {
    cy.get('input[formControlName="username"]')
      .click({ force: true })
      .type("12345", { force: true });

    cy.get('input[formControlName="password"]')
      .click({ force: true })
      .type("12345", { force: true });

    cy.get('input[formControlName="username"]').click({ force: true });
    //Validamos que boton entrar este deshabilitado
    cy.get("button[type=submit]").should("be.disabled");

    // Validamos mensajes  de longitud minima para password y validacion tipo email para username
    cy.get("#validEmail")
      .invoke("text")
      .then((text) => {
        expect(text.trim()).to.equal("Debe ingresar un Email valido");
      });
    cy.get("#minLenghtPass")
      .invoke("text")
      .then((text) => {
        expect(text.trim()).to.equal("La longitud minima es 6 caracteres");
      });

    cy.get('input[formControlName="username"]')
      .click({ force: true })
      .clear({ force: true });

    cy.get('input[formControlName="password"]')
      .click({ force: true })
      .clear({ force: true });

    // Validamos mensaje de requerir ingresar datos en los campos username y password
    cy.get("#requiredEmail")
      .invoke("text")
      .then((text) => {
        expect(text.trim()).to.equal("Se requiere ingresar Email");
      });

    cy.get("#requiredPass")
      .invoke("text")
      .then((text) => {
        expect(text.trim()).to.equal("Se requiere ingresar password");
      });

    //Validamos que boton entrar este deshabilitado
    cy.get("button[type=submit]").should("be.disabled");
  });

  it("Validamos longitud maxima de email", () => {
    // Se definen maxLength como 50
    //Validamos que solo existan 50 caracteres
    cy.get('input[formControlName="username"]')
      .click({ force: true })
      .type("123456789012345678901234567890123456789012345678901", {
        force: true,
      })
      .should(
        "have.value",
        "12345678901234567890123456789012345678901234567890"
      );
    //Validamos que boton entrar este deshabilitado
    cy.get("button[type=submit]").should("be.disabled");
  });

  it("Validamos Interfaz Login", () => {
    // Validamos nombre del titulo
    cy.get("h1")
      .invoke("text")
      .then((text) => {
        expect(text.trim()).to.equal("Bienvenido!");
      });
    // Validamos nombre del parrafo
    cy.get("p")
      .invoke("text")
      .then((text) => {
        expect(text.trim()).to.equal("Ingrese sus credenciales");
      });
    // Validamos nombre del boton
    cy.get("button[type=submit]")
      .invoke("text")
      .then((text) => {
        expect(text.trim()).to.equal("Ingresar");
      });
    // Validamos placerholder del input Email
    cy.get('input[formControlName="username"]')
      .invoke("attr", "placeholder")
      .should("contain", "Email");
    // Validamos placerholder del input Password
    cy.get('input[formControlName="password"]')
      .invoke("attr", "placeholder")
      .should("contain", "Password");
  });
});
