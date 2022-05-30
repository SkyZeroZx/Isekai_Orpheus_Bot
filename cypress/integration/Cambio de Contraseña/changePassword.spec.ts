/// <reference types="cypress" />

context("Change Password Pruebas Funcionalidad", () => {
  // Asiganamos valor a nuestra url segun nuestra variable global en cypress.json
  const url = Cypress.env("url");
  const user = Cypress.env("users");
  const response = Cypress.env("response");

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

    cy.get("button.swal2-confirm").click({ force: true });
    //Verificamos que nos encontremos en la pantalla cambio de contraseña
    cy.url().should("include", "/change-password");
  });

  it("Change Password Exitoso (MOCK)", () => {
    cy.get('input[formControlName="oldPassword"]')
      .click({ force: true })
      .type(user.userFirstLogin.password, { force: true })
      .should("have.value", user.userFirstLogin.password);

    cy.get('input[formControlName="newPassword"]')
      .click({ force: true })
      .type("Admin123456", { force: true })
      .should("have.value", "Admin123456");

    cy.get('input[formControlName="confirmedPassword"]')
      .click({ force: true })
      .type("Admin123456", { force: true })
      .should("have.value", "Admin123456");
    // Interceptamos el servicio de change password y mockeamos su respuesta OK
    cy.intercept("POST", url.service + "/auth/change-password", response.ok).as(
      "ChangePasswordOK"
    );

    cy.get("button[type=submit]").click({ force: true });
    // Esperamos que se ejecute el servicio interceptado
    cy.wait("@ChangePasswordOK");

    // Verificamos nuestro toast EXITO
    cy.get("#toast-container")
      .find("div")
      .find("div")
      .contains("Exito")
      .invoke("text")
      .then((text) => {
        expect(text.trim()).to.equal("Exito");
      });
    // Verificamos el contenido de nuestro toast exito
    cy.get("#toast-container")
      .find("div")
      .find("div")
      .contains("contraseña")
      .invoke("text")
      .then((text) => {
        expect(text.trim()).to.contains("Se cambio con exitosa la contraseña");
      });

    //Verificamos que nos encontremos en la pantalla login despues del cambio de contraseña
    cy.url().should("include", "/login");
  });

  it("Change Password Other Response (MOCK)", () => {
    cy.get('input[formControlName="oldPassword"]')
      .click({ force: true })
      .type(user.userFirstLogin.password, { force: true })
      .should("have.value", user.userFirstLogin.password);

    cy.get('input[formControlName="newPassword"]')
      .click({ force: true })
      .type("Admin123456", { force: true })
      .should("have.value", "Admin123456");

    cy.get('input[formControlName="confirmedPassword"]')
      .click({ force: true })
      .type("Admin123456", { force: true })
      .should("have.value", "Admin123456");
    // Interceptamos el servicio de change password y mockeamos su respuesta como OtherResponse
    cy.intercept(
      "POST",
      url.service + "/auth/change-password",
      response.other
    ).as("ChangePasswordOther");
    cy.get("button[type=submit]").click({ force: true });
    // Esperamos que se ejecute el servicio interceptado
    cy.wait("@ChangePasswordOther");
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
      .contains("Other")
      .invoke("text")
      .then((text) => {
        expect(text.trim()).to.contains(response.other.message);
      });
    //Verificamos que nos encontremos en la pantalla login despues del cambio de contraseña
    cy.url().should("include", "/change-password");
  });

  it("Change Password Validaciones ReactiveForm", () => {
    // Validamos para el caso que los inputs se encuentren vacio
    cy.get('input[formControlName="oldPassword"]').click({ force: true });
    cy.get('input[formControlName="newPassword"]').click({ force: true });
    cy.get('input[formControlName="confirmedPassword"]').click({ force: true });
    cy.get('input[formControlName="oldPassword"]').click({ force: true });

    // Se valida el caso para cuando no se ingresa datos
    cy.get("#msgOldPasswordReq")
      .invoke("text")
      .then((text) => {
        expect(text.trim()).to.equal("Se requiere ingresar contraseña actual");
      });

    cy.get("#msgNewPassReq")
      .invoke("text")
      .then((text) => {
        expect(text.trim()).to.equal("Se requiere ingresar nueva contraseña");
      });

    cy.get("#msgConfirPassReq")
      .invoke("text")
      .then((text) => {
        expect(text.trim()).to.equal(
          "Se requiere ingresar confirmar nueva contraseña"
        );
      });

    // Validamos que el boton se mandenga deshbilitado
    cy.get("button[type=submit]").should("be.disabled");
    // Validamos la longitud minima requerida
    cy.get('input[formControlName="oldPassword"]')
      .click({ force: true })
      .type("123");
    cy.get('input[formControlName="newPassword"]')
      .click({ force: true })
      .type("123");
    cy.get('input[formControlName="confirmedPassword"]')
      .click({ force: true })
      .type("123");

    cy.get("#msgOldPasswordMin")
      .invoke("text")
      .then((text) => {
        expect(text.trim()).to.equal("La longitud minima es 6 caracteres");
      });

    cy.get("#msgNewPassMin")
      .invoke("text")
      .then((text) => {
        expect(text.trim()).to.equal("La longitud minima es 6 caracteres");
      });

    cy.get("#msgConfirPassMin")
      .invoke("text")
      .then((text) => {
        expect(text.trim()).to.equal("La longitud minima es 6 caracteres");
      });
    // Validamos que el boton se mandenga deshbilitado
    cy.get("button[type=submit]").should("be.disabled");

    // Validamos el caso que la nueva contraseña y confirmacion no sean iguales
    cy.get('input[formControlName="oldPassword"]')
      .click({ force: true })
      .type("12345678");
    cy.get('input[formControlName="newPassword"]')
      .click({ force: true })
      .type("12345678");
    cy.get('input[formControlName="confirmedPassword"]')
      .click({ force: true })
      .type("SomethingDiferent");

    // Validamos que el boton se habilite y hacemos click
    cy.get("button[type=submit]").should("be.enabled").click({ force: true });

    cy.get("#samePass")
      .invoke("text")
      .then((text) => {
        expect(text.trim()).to.equal(
          "La nueva contraseña y confirmacion contraseña no coinciden"
        );
      });
  });

  it("Change Password Validamos botones ShowPassword", () => {
    // Validamos el tipo de atributo type inicial debe ser password en los campos Old , New y Confirm Password
    cy.get('input[formControlName="oldPassword"]')
      .invoke("attr", "type")
      .should("eq", "password");

    cy.get('input[formControlName="newPassword"]')
      .invoke("attr", "type")
      .should("eq", "password");

    cy.get('input[formControlName="confirmedPassword"]')
      .invoke("attr", "type")
      .should("eq", "password");

    // Realizamos click en los eyes de sus respectivos campos
    cy.get("#showOldPassword").click({ force: true });
    cy.get("#showNewPassword").click({ force: true });
    cy.get("#showConfirmPassword").click({ force: true });
    // Validamos el tipo de atributo type que posee en este caso como se realizo click debe ser text
    cy.get('input[formControlName="oldPassword"]')
      .invoke("attr", "type")
      .should("eq", "text");

    cy.get('input[formControlName="newPassword"]')
      .invoke("attr", "type")
      .should("eq", "text");

    cy.get('input[formControlName="confirmedPassword"]')
      .invoke("attr", "type")
      .should("eq", "text");

    // Validamos que la clase de los eye fa icon cambien
    cy.get("i[id=eyeOldPassword]").then((res) => {
      // Validamos que sea el icon del ojo abierto
      expect(res[0].className).contains("fa ni fa-eye");
    });

    cy.get("i[id=eyeNewPassword]").then((res) => {
      // Validamos que sea el icon del ojo abierto
      expect(res[0].className).contains("fa ni fa-eye");
    });

    cy.get("i[id=eyeConfirmPassword]").then((res) => {
      // Validamos que sea el icon del ojo abierto
      expect(res[0].className).contains("fa ni fa-eye");
    });

    // Esperamos 500 milisegundos
    cy.wait(500);
    // Realizaos click en los ojos que ahora estam abiertos para cerrarlos
    cy.get("#showOldPassword").click({ force: true });
    cy.get("#showNewPassword").click({ force: true });
    cy.get("#showConfirmPassword").click({ force: true });

    // Validamos que la clase de los eye fa icon cambien
    cy.get("i[id=eyeOldPassword]").then((res) => {
      // Validamos que sea el icon del ojo cerrado
      expect(res[0].className).contains("fa ni fa-eye-slash");
    });

    cy.get("i[id=eyeNewPassword]").then((res) => {
      // Validamos que sea el icon del ojo cerrado
      expect(res[0].className).contains("fa ni fa-eye-slash");
    });

    cy.get("i[id=eyeConfirmPassword]").then((res) => {
      // Validamos que sea el icon del ojo cerrado
      expect(res[0].className).contains("fa ni fa-eye-slash");
    });
  });

  it("Change Password NetWork Error Response (MOCK)", () => {
    cy.get('input[formControlName="oldPassword"]')
      .click({ force: true })
      .type("FakePasswordTest", { force: true });
      

    cy.get('input[formControlName="newPassword"]')
      .click({ force: true })
      .type("Admin123456", { force: true })
      .should("have.value", "Admin123456");

    cy.get('input[formControlName="confirmedPassword"]')
      .click({ force: true })
      .type("Admin123456", { force: true })
      .should("have.value", "Admin123456");
    // Interceptamos el servicio de change password y mockeamos su respuesta como un error Network

    cy.intercept("POST", url.service + "/auth/change-password", {
      forceNetworkError: true,
    }).as("ChangePasswordError");

    cy.get("button[type=submit]").click({ force: true });
    // Esperamos que se ejecute el servicio interceptado
    cy.wait("@ChangePasswordError");
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
      .contains("contraseña")
      .invoke("text")
      .then((text) => {
        expect(text.trim()).to.contains("Error al cambiar contraseña");
      });
    //Verificamos que nos encontremos en la pantalla login despues del cambio de contraseña
    cy.url().should("include", "/change-password");
  });

});
