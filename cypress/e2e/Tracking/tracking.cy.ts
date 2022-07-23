/// <reference types="cypress" />

context("Tracking Pruebas Funcionalidad", () => {
  // Asiganamos valor a nuestra url segun nuestra variable global en cypress.json
  const url = Cypress.env("url");
  const tracking = Cypress.env("tracking");
  beforeEach(() => {
    // Visitamos la URL BASE y seleccionamos los campos
    cy.visit(url.tracking);
  });

  it("Tracking Exitoso", () => {
    //Ingresamos los datos numeroTramite y dniEstudiante
    cy.get('input[formControlName="idDocTramite"]')
      .click({ force: true })
      .type(tracking.numeroTramite, { force: true })
      .should("have.value", tracking.numeroTramite);

    cy.get('input[formControlName="dni"]')
      .click({ force: true })
      .type(tracking.dni, { force: true })
      .should("have.value", tracking.dni);
    //Interceptamos nuestro service signon
    cy.intercept({
      method: "POST",
      url: url.service + "/tramite/tracking",
    }).as("tracking");

    //Realizamos click en el boton entrar
    cy.get('button[type="submit"]').click({ force: true });
    //Esperamos la llamada y carga del servicio sigon
    cy.wait("@tracking");
  });

  it("Tracking Error Busqueda (MockResponse Error Network)", () => {
    //Ingresamos los datos numeroTramite y dniEstudiante
    cy.get('input[formControlName="idDocTramite"]')
      .click({ force: true })
      .type(tracking.numeroTramite, { force: true })
      .should("have.value", tracking.numeroTramite);

    cy.get('input[formControlName="dni"]')
      .click({ force: true })
      .type(tracking.dni, { force: true })
      .should("have.value", tracking.dni);
    //Interceptamos nuestro service signon y forzamos un error
    cy.intercept("POST", url.service + "/tramite/tracking", {
      forceNetworkError: true,
    }).as("tracking");
    //Realizamos click en el boton entrar
    cy.get('button[type="submit"]').click({ force: true });
    // Llamamos nuestro servicio mockeado
    cy.wait("@tracking");
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
      .contains("tramite")
      .invoke("text")
      .then((text) => {
        expect(text.trim()).to.contains(
          "Sucedio un error al buscar el tramite"
        );
      });
  });

  it("Tracking Tramite NO encontrado", () => {
    //Ingresamos los datos numeroTramite y dniEstudiante
    cy.get('input[formControlName="idDocTramite"]')
      .click({ force: true })
      .type(tracking.numeroTramite + "1", { force: true });
    cy.get('input[formControlName="dni"]')
      .click({ force: true })
      .type(tracking.dni, { force: true });
    //Interceptamos nuestro service signon
    cy.intercept({
      method: "POST",
      url: url.service + "/tramite/tracking",
    }).as("tracking");

    //Realizamos click en el boton entrar
    cy.get('button[type="submit"]').click({ force: true });
    //Esperamos la llamada y carga del servicio sigon
    cy.wait("@tracking");
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
      .contains("tramite")
      .invoke("text")
      .then((text) => {
        expect(text.trim()).to.equal(
          "No existe tramite que coincida con los datos ingresados"
        );
      });
  });

  it("Tracking Interfaz Login", () => {
    // Validamos nombre del titulo
    cy.get("h2")
      .invoke("text")
      .then((text) => {
        expect(text.trim()).to.equal("Seguimiento Tramites");
      });
    // Validamos nombre del boton
    cy.get("button[type=submit]")
      .invoke("text")
      .then((text) => {
        expect(text.trim()).to.equal("Buscar");
      });
    // Validamos placerholder del input Email
    cy.get('input[formControlName="idDocTramite"]')
      .invoke("attr", "placeholder")
      .should("contain", "N° Tramite");
    // Validamos placerholder del input Password
    cy.get('input[formControlName="dni"]')
      .invoke("attr", "placeholder")
      .should("contain", "DNI Estudiante");
  });

  it("Tracking Tramite Validacion Mensajes ReactiveForms", () => {
    //Ingresamos los datos numeroTramite y dniEstudiante
    cy.get('input[formControlName="idDocTramite"]').click({ force: true });
    cy.get('input[formControlName="dni"]').click({ force: true });
    cy.get('input[formControlName="idDocTramite"]').click({ force: true });
    //Validamos que boton entrar este deshabilitado
    cy.get("button[type=submit]").should("be.disabled");
    // Validamos mensajes  de requerimiento de N°Tramite y dniEstudiante
    cy.get("#reqlengthTramite")
      .invoke("text")
      .then((text) => {
        expect(text.trim()).to.equal(
          "Se requiere ingresar N° Tramite para seguimiento"
        );
      });
    cy.get("#reqDNI")
      .invoke("text")
      .then((text) => {
        expect(text.trim()).to.equal(
          "Se requiere ingresar dni para seguimiento"
        );
      });
    cy.get('input[formControlName="idDocTramite"]')
      .click({ force: true })
      .type("1234567890123");
    cy.get('input[formControlName="dni"]')
      .click({ force: true })
      .type("1234567");
    // Validamos mensajes  de longitud minima de N°Tramite y dniEstudiante
    cy.get("#minLenghtDNI")
      .invoke("text")
      .then((text) => {
        expect(text.trim()).to.equal("La longitud minima es 8 caracteres");
      });
    cy.get("#minlengthTramite")
      .invoke("text")
      .then((text) => {
        expect(text.trim()).to.equal("La longitud minima es 14 caracteres");
      });
  });

  it("Validamos Opciones Boton Hamburguer Options", () => {
    // Realizamos click en el boton
    cy.get("#button-dropup").click({ force: true });

    // Validamos las opciones del boton
    cy.get("ul.dropdown-menu > li").then((element) => {
      expect(element[0].innerText).to.contains("Activar notificaciones");
      expect(element[1].innerText).to.contains("Guardar Tramite");
      expect(element[2].innerText).to.contains("Ver historial");
    });
  });

  it("Busqueda Historial Error No Existe Tramite", () => {
    // Realizamos click en el boton hamburger
    cy.get("#button-dropup").click({ force: true });
    const mockHistory: any = [
      {
        id_est_doc: "1234567912345632",
        dni: "12345678",
      },
    ];
    // Seteamos data de prueba para que el modal nos cargue datos de historial
    localStorage.setItem("tracking", JSON.stringify(mockHistory));
    // Realizamos click en el boton visualizar historial
    cy.get("#historial").click({ force: true });

    // Validamos los datos del historial
    cy.get("tr > td.history").then((element) => {
      expect(element[0].innerText).to.equal(mockHistory[0].id_est_doc);
      expect(element[1].innerText).to.equal(mockHistory[0].dni);
    });

    // Probamos para el caso sin datos
    cy.get("i[role=search]").click({ force: true });
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
      .contains("tramite")
      .invoke("text")
      .then((text) => {
        expect(text.trim()).to.equal(
          "No existe tramite que coincida con los datos ingresados"
        );
      });
  });

  it("Busqueda Desde Historial Exitosa y Guardarlo", () => {
    localStorage.clear();
    // Realizamos click en el boton hamburger
    cy.get("#button-dropup").click({ force: true });
    // Cerramos el boton y borramos localStorage para setear un valor valido
    const mockHistoryOK: any = [
      {
        id_est_doc: tracking.numeroTramite,
        dni: tracking.dni,
      },
    ];
    localStorage.setItem("tracking", JSON.stringify(mockHistoryOK));
    // Realizamos click en el boton visualizar historial
    cy.get("#historial").click({ force: true });
    cy.get("i[role=search]").click({ force: true });

    //Interceptamos nuestro service signon
    cy.intercept({
      method: "POST",
      url: url.service + "/tramite/tracking",
    }).as("tracking");

    //Realizamos click en el boton entrar
    cy.get('button[type="submit"]').click({ force: true });
    //Esperamos la llamada y carga del servicio sigon
    cy.wait("@tracking");

    // Validamos que la pestaña adjuntos tenga los campos Fecha y Descargar
    cy.get("tab[heading=Adjuntos]")
      .invoke("text")
      .then((text) => {
        expect(text.trim()).to.contains("Fecha");
        expect(text.trim()).to.contains("Descargar");
      });
    // Validamos que la pestaña Detalles tenga los campos Estado , Observacion y Fecha
    cy.get("tab[heading=Detalles]")
      .invoke("text")
      .then((text) => {
        expect(text.trim()).to.contains("Observacion");
        expect(text.trim()).to.contains("Estado");
        expect(text.trim()).to.contains("Fecha");
      });

    // Validamos que la pestaña Certificado tenga los campos Fecha y Descargar
    cy.get("tab[heading=Certificado]")
      .invoke("text")
      .then((text) => {
        expect(text.trim()).to.contains("Fecha");
        expect(text.trim()).to.contains("Descargar");
      });

    // Realizamos click en el boton hamburger
    cy.get("#button-dropup").click({ force: true });

    cy.get("#guardar").click({ force: true });

    // Verificamos nuestro toast Exito
    cy.get("#toast-container")
      .find("div")
      .find("div")
      .contains("Exito")
      .invoke("text")
      .then((text) => {
        expect(text.trim()).to.equal("Exito");
      });
    // Verificamos el contenido de nuestro toast error
    cy.get("#toast-container")
      .find("div")
      .find("div")
      .contains("guardo")
      .invoke("text")
      .then((text) => {
        expect(text.trim()).to.equal("Se guardo su tramite");
      });
  });
});
