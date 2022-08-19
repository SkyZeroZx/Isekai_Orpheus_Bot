/// <reference types="cypress" />

import { filter } from "cypress/types/lodash";

context("Modulo Tramitador Pruebas Funcionalidad", () => {
  // Asiganamos valor a nuestra url segun nuestra variable global en cypress.json
  const url = Cypress.env("url");
  const user = Cypress.env("users");
  const response = Cypress.env("response");
  const tracking = Cypress.env("tracking");
  // Ruta de la carpeta descargas previamente configurado en cypress.json
  const downloadsFolder = Cypress.config("downloadsFolder");
  beforeEach(() => {
    //Aumentando el TimeOut en caso de lentitud de la red
    Cypress.config({
      defaultCommandTimeout: 10000,
    });
    Cypress.config();
    cy.visit(url.visit);
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

    // Interceptamos y mockeamos graficos para evitar la demora al cargar
    cy.intercept(
      {
        method: "POST",
        url: url.service + "/grafico",
      },
      []
    ).as("grafico");

    //Realizamos click en el boton entrar
    cy.get('button[type="submit"]').click({ force: true });
    //Esperamos la llamada y carga del servicio sigon
    cy.wait("@signon");
    cy.url().should("include", "/dashboard");
    cy.wait("@grafico");
  });

  it("Dashboard validacion interfaz Tramitador", () => {
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
        expect(text.trim()).to.contains("Elige un tramite");
      });

    cy.get("select[name=tramite1]")
      .invoke("text")
      .then((text) => {
        expect(text.trim()).to.contains("Tramite 1");
      });

    cy.get("select[name=tramite2]")
      .invoke("text")
      .then((text) => {
        expect(text.trim()).to.contains("Tramite 2");
      });

    cy.get("select[name=tramiteBarra]")
      .invoke("text")
      .then((text) => {
        expect(text.trim()).to.contains("Elige un tramite");
      });

    cy.get("select[name=tramitePie]")
      .invoke("text")
      .then((text) => {
        expect(text.trim()).to.contains("Elige un tramite");
      });
    // Validamos el span donde se encuentra el usuario logeado en el NavBar
    cy.get("span[id=usuarioLogeado]")
      .invoke("text")
      .then((text) => {
        expect(text.trim()).to.equal(user.userTramitador.username);
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

  it("Cambio Contraseña a Demanda Tramitador Other Response (MOCK)", () => {
    // Realizamos click sobre nuestro nombre de usuario logeado
    cy.get("#usuarioLogeado").click({ force: true });
    // Realizamos click en changePassword
    cy.get("#navbarChangePassword").click({ force: true });
    // Validamos que nos encontramos en la ruta change-password
    cy.url().should("include", "/change-password");

    cy.wait(1000);
    cy.get('input[formControlName="oldPassword"]')
      .click({ force: true })
      .type("FakeTramitadorPass", { force: true });

    cy.get('input[formControlName="newPassword"]')
      .click({ force: true })
      .type("Admin123456", { force: true });

    cy.get('input[formControlName="confirmedPassword"]')
      .click({ force: true })
      .type("Admin123456", { force: true });

    // Interceptamos el servicio de change password y mockeamos su respuesta Other
    cy.intercept(
      "POST",
      url.service + "/auth/change-password",
      response.other
    ).as("ChangePasswordOtherResTramitador");

    // Realizamos click el boton cambiar contraseña
    cy.get("button[type=submit]").click({ force: true });

    // Esperamos que se ejecute el servicio interceptado
    cy.wait("@ChangePasswordOtherResTramitador");

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

    //Verificamos que nos encontremos en la pantalla change-password despues del error
    cy.url().should("include", "/change-password");
  });

  it("Cambio Contraseña a Demanda Tramitador NetWork Response (MOCK)", () => {
    // Realizamos click sobre nuestro nombre de usuario logeado
    cy.get("#usuarioLogeado").click({ force: true });
    // Realizamos click en changePassword
    cy.get("#navbarChangePassword").click({ force: true });
    // Validamos que nos encontramos en la ruta change-password
    cy.url().should("include", "/change-password");

    cy.get('input[formControlName="oldPassword"]')
      .click({ force: true })
      .type("FakeTramitadorPass", { force: true });

    cy.get('input[formControlName="newPassword"]')
      .click({ force: true })
      .type("Admin123456", { force: true });

    cy.get('input[formControlName="confirmedPassword"]')
      .click({ force: true })
      .type("Admin123456", { force: true });

    // Interceptamos el servicio de change password y forzamos a retornar forceNetworkError
    cy.intercept("POST", url.service + "/auth/change-password", {
      forceNetworkError: true,
    }).as("ChangePasswordErrorTramitador");

    // Realizamos click el boton cambiar contraseña
    cy.get("button[type=submit]").click({ force: true });
    // Esperamos que se ejecute el servicio interceptado
    cy.wait("@ChangePasswordErrorTramitador");

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
    //Verificamos que nos encontremos en la pantalla change-password despues del error
    cy.url().should("include", "/change-password");
  });

  it("Cambio Contraseña a Demanda Tramitador Exito (MOCK)", () => {
    // Realizamos click sobre nuestro nombre de usuario logeado
    cy.get("#usuarioLogeado").click({ force: true });
    // Realizamos click en changePassword
    cy.get("#navbarChangePassword").click({ force: true });
    // Validamos que nos encontramos en la ruta change-password
    cy.url().should("include", "/change-password");

    cy.get('input[formControlName="oldPassword"]')
      .click({ force: true })
      .type("FakeTramitadorPass", { force: true });

    cy.get('input[formControlName="newPassword"]')
      .click({ force: true })
      .type("Admin123456", { force: true });

    cy.get('input[formControlName="confirmedPassword"]')
      .click({ force: true })
      .type("Admin123456", { force: true });

    // Interceptamos el servicio de change password y mockeamos su respuesta OK
    cy.intercept("POST", url.service + "/auth/change-password", response.ok).as(
      "ChangePasswordOKTramitador"
    );

    cy.get("button[type=submit]").click({ force: true });
    // Esperamos que se ejecute el servicio interceptado
    cy.wait("@ChangePasswordOKTramitador");
    // Verificamos nuestro toast error
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
      .contains("contraseña")
      .invoke("text")
      .then((text) => {
        expect(text.trim()).to.contains("Se cambio con exitosa la contraseña");
      });
    //Verificamos que nos encontremos en la pantalla dashboard despues del cambio de contraseña
    cy.url().should("include", "/dashboard");
  });

  it("Cambio Contraseña a Demanda Tramitador Volver Atras", () => {
    // Realizamos click sobre nuestro nombre de usuario logeado
    cy.get("#usuarioLogeado").click({ force: true });
    // Realizamos click en changePassword
    cy.get("#navbarChangePassword").click({ force: true });
    // Validamos que nos encontramos en la ruta change-password
    cy.url().should("include", "/change-password");
    // Hacemos click en el boton atras
    cy.get("#atras").click({ force: true });
    //Verificamos que nos encontremos en la pantalla dashboard despues del click
    cy.url().should("include", "/dashboard");
  });

  it("Verificamos Interfaz Gestion Tramites", () => {
    // Interceptamos el servicio que carga la lista de tramites de los alumnos
    cy.intercept({
      method: "GET",
      url: url.service + "/tramite",
    }).as("listaTramites");

    // Realizamos click en la opcion tramites
    cy.get("a").contains("Tramites").click({ force: true });
    // Esperamos que se liste
    cy.wait("@listaTramites");
    //Validamos el titulo de nuestra interfaz
    cy.get("h3")
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("Gestion Tramites");
      });
    // Validamos la ruta donde nos encontramos
    cy.url().should("include", "/tramites");

    // Validamos los placeholder de nuestro filtros
    cy.get('input[formControlName="filterTramite"]')
      .invoke("attr", "placeholder")
      .should("contain", "N° Tramite");

    cy.get('input[formControlName="filterCodEstudiante"]')
      .invoke("attr", "placeholder")
      .should("contain", "Codigo Estudiante");

    cy.get('input[formControlName="filterApellidos"]')
      .invoke("attr", "placeholder")
      .should("contain", "Apellidos");
    cy.get('input[formControlName="filterNombres"]')
      .invoke("attr", "placeholder")
      .should("contain", "Nombres");

    cy.get('input[formControlName="filterTipoTramite"]')
      .invoke("attr", "placeholder")
      .should("contain", "Tipo Tramite");

    cy.get("#btnExcel")
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("Excel");
      });

    cy.get("#btnPDF")
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("PDF");
      });

    // Validamos las opciones del select Estado
    cy.get("#inputEstado").then((text) => {
      expect(text[0][0].innerText.trim()).equal("Elija Estado...");
      expect(text[0][1].innerText.trim()).equal("REGISTRADO");
      expect(text[0][2].innerText.trim()).equal("PROCESANDO");
      expect(text[0][3].innerText.trim()).equal("OBSERVADO");
      expect(text[0][4].innerText.trim()).equal("FINALIZADO");
    });

    cy.get("th[scope=col]").then((element) => {
      // Validamos cabeceras de la tabla
      expect(element[0].innerText.trim()).equal("N° TRAMITE");
      expect(element[1].innerText.trim()).equal("TIPO TRAMITE");
      expect(element[2].innerText.trim()).equal("CODIGO ESTUDIANTE");
      expect(element[3].innerText.trim()).equal("APELLIDOS");
      expect(element[4].innerText.trim()).equal("NOMBRES");
      expect(element[5].innerText.trim()).equal("ESTADO");
      expect(element[6].innerText.trim()).equal("FECHA");
      expect(element[7].innerText.trim()).equal("");
    });
  });

  it("Verificamos listar tramites Error Network (MOCK) ", () => {
    // Interceptamos el servicio que carga la lista de tramites de los alumnos
    cy.intercept(
      {
        method: "GET",
        url: url.service + "/tramite",
      },
      { forceNetworkError: true }
    ).as("listaTramites");
    // Realizamos click en la opcion tramites
    cy.get("a").contains("Tramites").click({ force: true });
    // Esperamos que se liste
    cy.wait("@listaTramites");

    // Verificamos nuestro toast ERROR
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
      .contains("listar")
      .invoke("text")
      .then((text) => {
        expect(text.trim()).to.contains("Sucedio un error al listar tramites");
      });
  });

  it("Verificamos busqueda dinamica de los Gestion Tramites (MOCK)", () => {
    // Interceptamos el servicio que carga la lista de tramites de los alumnos
    cy.intercept(
      {
        method: "GET",
        url: url.service + "/tramite",
      },
      { fixture: "tramites.json" }
    ).as("listaTramites");
    // Realizamos click en la opcion tramites
    cy.get("a").contains("Tramites").click({ force: true });
    // Esperamos que se liste
    cy.wait("@listaTramites");
    // Buscamos un registro existente
    cy.get('input[formControlName="filterTramite"]')
      .click({ force: true })
      .type(tracking.numeroTramite)
      .should("have.value", tracking.numeroTramite);

    // Validamos los valores en la grilla
    cy.get("td").then((element) => {
      expect(element[0].innerText.trim()).to.equal(tracking.numeroTramite);
      expect(element[1].innerText.trim()).to.equal(tracking.tipoTramite);
      expect(element[2].innerText.trim()).to.equal(tracking.codigoEstudiante);
      expect(element[3].innerText.trim()).to.equal(tracking.apellidos);
      expect(element[4].innerText.trim()).to.equal(tracking.nombres);
      expect(element[5].innerText.trim()).to.equal(tracking.estado);
      expect(element[6].innerText.trim()).contains(tracking.fecha);
    });
    // Borramos la data del input filter tramites
    cy.get('input[formControlName="filterTramite"]')
      .click({ force: true })
      .clear({ force: true })
      .should("have.value", "");

    // Buscamos un registro  por nombre del estudiante
    cy.get('input[formControlName="filterNombres"]')
      .click({ force: true })
      .type(tracking.nombres)
      .should("have.value", tracking.nombres);

    // Validamos los valores en la grilla
    cy.get("td").then((element) => {
      expect(element[0].innerText.trim()).to.equal(tracking.numeroTramite);
      expect(element[1].innerText.trim()).to.equal(tracking.tipoTramite);
      expect(element[2].innerText.trim()).to.equal(tracking.codigoEstudiante);
      expect(element[3].innerText.trim()).to.equal(tracking.apellidos);
      expect(element[4].innerText.trim()).to.equal(tracking.nombres);
      expect(element[5].innerText.trim()).to.equal(tracking.estado);
      expect(element[6].innerText.trim()).contains(tracking.fecha);
    });

    // Limpiamos el valor de filternombres
    cy.get('input[formControlName="filterNombres"]')
      .click({ force: true })
      .clear({ force: true })
      .should("have.value", "");

    // Buscamos un registro  por Apellidos del estudiante
    cy.get('input[formControlName="filterApellidos"]')
      .click({ force: true })
      .type(tracking.apellidos)
      .should("have.value", tracking.apellidos);

    // Validamos los valores en la grilla
    cy.get("td").then((element) => {
      expect(element[0].innerText.trim()).to.equal(tracking.numeroTramite);
      expect(element[1].innerText.trim()).to.equal(tracking.tipoTramite);
      expect(element[2].innerText.trim()).to.equal(tracking.codigoEstudiante);
      expect(element[3].innerText.trim()).to.equal(tracking.apellidos);
      expect(element[4].innerText.trim()).to.equal(tracking.nombres);
      expect(element[5].innerText.trim()).to.equal(tracking.estado);
      expect(element[6].innerText.trim()).contains(tracking.fecha);
    });

    // Limpiamos el valor de filterApellidos
    cy.get('input[formControlName="filterApellidos"]')
      .click({ force: true })
      .clear({ force: true })
      .should("have.value", "");

    // Buscamos un registro  por Codigo del estudiante
    cy.get('input[formControlName="filterCodEstudiante"]')
      .click({ force: true })
      .type(tracking.codigoEstudiante)
      .should("have.value", tracking.codigoEstudiante);

    // Validamos los valores en la grilla
    cy.get("td").then((element) => {
      expect(element[0].innerText.trim()).to.equal(tracking.numeroTramite);
      expect(element[1].innerText.trim()).to.equal(tracking.tipoTramite);
      expect(element[2].innerText.trim()).to.equal(tracking.codigoEstudiante);
      expect(element[3].innerText.trim()).to.equal(tracking.apellidos);
      expect(element[4].innerText.trim()).to.equal(tracking.nombres);
      expect(element[5].innerText.trim()).to.equal(tracking.estado);
      expect(element[6].innerText.trim()).contains(tracking.fecha);
    });
  });

  it("Verificamos Modal Detalle Tramite Estudiante", () => {
    // Interceptamos el servicio que carga la lista de tramites de los alumnos
    // Al interceptar el servicio que lista tramites los interceptamos y hacemos que responda el archivo tramites.json
    cy.intercept(
      {
        method: "GET",
        url: url.service + "/tramite",
      },
      { fixture: "tramites.json" }
    ).as("listaTramites");
    // Realizamos click en la opcion tramites
    cy.get("a").contains("Tramites").click({ force: true });
    // Esperamos que se liste
    cy.wait("@listaTramites");

    // Interceptamos los servicios del detalle tramite del estudiante , adjuntos y certificado
    // Al interceptar el servicio de detalle del estudiante mockeamos el response con nuestro detalleTramite.json que se encuentra en fixture
    cy.intercept(
      {
        method: "POST",
        url: url.service + "/tramite/id",
      },
      { fixture: "detalleTramite.json" }
    ).as("tramiteDetalle");

    cy.intercept(
      {
        method: "POST",
        url: url.service + "/tramite/adj",
      },
      { fixture: "adjuntos.json" }
    ).as("tramiteAdjunto");

    cy.intercept(
      {
        method: "POST",
        url: url.service + "/tramite/cer",
      },
      { fixture: "certificados.json" }
    ).as("tramiteCertificado");

    // Realizamos click en el primer registro
    cy.get("td > i.ni-bullet-list-67").first().click({ force: true });
    cy.wait(["@tramiteDetalle", "@tramiteAdjunto", "@tramiteCertificado"]);
    // Validamos campos del modal detalle tramite del estudiante
    cy.get("div.form-group > label").then((element) => {
      // Validamos los valores de los label de nuestros inputs
      expect(element[0].innerText.trim()).equal("N° Tramite");
      expect(element[1].innerText.trim()).equal("Codigo Estudiante");
      expect(element[2].innerText.trim()).equal("Estado Actual");
      expect(element[3].innerText.trim()).equal("Apellidos");
      expect(element[4].innerText.trim()).equal("Nombres");
      expect(element[5].innerText.trim()).equal("Fecha");
    });

    cy.fixture("tramites").then((estudiante) => {
      cy.get("input[formControlName=detalleTramite]").should(
        "have.value",
        estudiante[0].id_est_doc
      );

      cy.get("input[formControlName=detalleEstado]").should(
        "have.value",
        estudiante[0].estado
      );

      cy.get("input[formControlName=detalleCodEstudiante]").should(
        "have.value",
        estudiante[0].cod_est
      );

      cy.get("input[formControlName=detalleApellidos]").should(
        "have.value",
        estudiante[0].apellidos
      );

      cy.get("input[formControlName=detalleNombres]").should(
        "have.value",
        estudiante[0].estudiante
      );

      cy.get("input[formControlName=detalleFecha]").should(
        "have.value",
        estudiante[0].fecha_doc
      );
    });

    // Validamos los subtitulos de DetalleTramite Registrar y Adjuntas certificado para un nuevo estado
    cy.get("h4").then((element) => {
      expect(element[0].innerText.trim()).equal("DetalleTramite");
      expect(element[1].innerText.trim()).equal("Registrar Nuevo Estado");
      expect(element[2].innerText.trim()).equal("Adjuntar Certificado");
    });
    // Para Nuevo Estado del tramite validamos los placeholder
    cy.get("textarea[formControlName=observaciones]")
      .invoke("attr", "placeholder")
      .should("eq", "Observacion");

    // Validamos el texto de los selectores
    cy.get("select[formControlName=estado]")
      .invoke("text")
      .then((text) => {
        expect(text.trim()).to.contains("Seleccione un estado");
        expect(text.trim()).to.contains("PROCESANDO");
        expect(text.trim()).to.contains("OBSERVADO");
        expect(text.trim()).to.contains("FINALIZADO");
      });

    // Validamos los valores de los botones
    cy.get("button[type=submit]").then((element) => {
      expect(element[0].innerText.trim()).equals("Registrar");
      expect(element[1].innerText.trim()).equals("Subir");
    });

    // Validamos las pestaña de detalleTramite del estudiante
    cy.get("tr.detalles > th").then((element) => {
      expect(element[0].innerText.trim().toLocaleUpperCase()).equals(
        "N° TRAMITE"
      );
      expect(element[1].innerText.trim().toLocaleUpperCase()).equals("FECHA");
      expect(element[2].innerText.trim().toLocaleUpperCase()).equals("ESTADO");
      expect(element[3].innerText.trim().toLocaleUpperCase()).equals(
        "OBSERVACION"
      );
      expect(element[4].innerText.trim().toLocaleUpperCase()).equals("EDITAR");
      expect(element[5].innerText.trim().toLocaleUpperCase()).equals(
        "ELIMINAR"
      );
    });

    cy.get("tbody.detallesTramite > tr >td").then((element) => {
      cy.fixture("detalleTramite").then((estudiante) => {
        expect(element[0].innerText.trim()).equals(estudiante[0].id_est_doc);
        expect(element[1].innerText.trim()).equals(estudiante[0].fecha);
        expect(element[2].innerText.trim()).equals(estudiante[0].estado);
        expect(element[3].innerText.trim()).equals(estudiante[0].observaciones);
      });
    });

    // Validamos click en el tab Adjuntos
    cy.get("span").contains("Adjuntos").click({ force: true });

    // Validamos los valores en los th de la tabla
    cy.get("tr.adjuntos > th").then((element) => {
      expect(element[0].innerText.trim().toLocaleUpperCase()).equals(
        "N° TRAMITE"
      );
      expect(element[1].innerText.trim().toLocaleUpperCase()).equals("FECHA");
      expect(element[2].innerText.trim().toLocaleUpperCase()).equals(
        "DESCARGAR"
      );
    });

    // Validamos las pestaña de detalleAdjuntos del estudiante
    cy.get("tr.detalleAdjuntos > td ").then((element) => {
      cy.fixture("adjuntos").then((adjuntos) => {
        expect(element[0].innerText.trim()).equals(adjuntos[0].ID_EST_DOC);
        expect(element[1].innerText.trim()).equals(adjuntos[0].FECHA);
        // Validamos que el enlace incluya la ruta del hosting donde se encuentra alojado el archivo
        expect(element[2].innerHTML).includes(adjuntos[0].URL);
      });
    });

    // Validamos click en el tab Certificado
    cy.get("span").contains("Certificado").click({ force: true });

    // Validamos los valores en los th de la tabla
    cy.get("tr.certificados > th").then((element) => {
      expect(element[0].innerText.trim().toLocaleUpperCase()).equals(
        "N° TRAMITE"
      );
      expect(element[1].innerText.trim().toLocaleUpperCase()).equals("FECHA");
      expect(element[2].innerText.trim().toLocaleUpperCase()).equals(
        "DESCARGAR"
      );
      expect(element[3].innerText.trim().toLocaleUpperCase()).equals(
        "ELIMINAR"
      );
    });

    // Validamos las pestaña de detalleAdjuntos del estudiante
    cy.get("tr.detalleCertificados > td ").then((element) => {
      cy.fixture("certificados").then((certificados) => {
        expect(element[0].innerText.trim()).equals(certificados[0].id_est_doc);
        expect(element[1].innerText.trim()).equals(certificados[0].fecha);
        // Validamos que el enlace incluya la ruta del hosting donde se encuentra alojado el archivo
        expect(element[2].innerHTML).includes(certificados[0].url);
      });
    });

    // Validamos el caso cuando cerramos el modal detalle estudiante se refresquen los datos de la grilla de tramites

    cy.get("#closeDetalleTramite").click({ force: true });
    // Esperamos que se liste
    cy.wait("@listaTramites");
  });

  it("Verificamos Eliminar Estado Tramite Interfaz", () => {
    // Interceptamos el servicio que carga la lista de tramites de los alumnos
    // Al interceptar el servicio que lista tramites los interceptamos y hacemos que responda el archivo tramites.json
    cy.intercept(
      {
        method: "GET",
        url: url.service + "/tramite",
      },
      { fixture: "tramites.json" }
    ).as("listaTramites");
    // Realizamos click en la opcion tramites
    cy.get("a").contains("Tramites").click({ force: true });
    // Esperamos que se liste
    cy.wait("@listaTramites");

    // Interceptamos los servicios del detalle tramite del estudiante , adjuntos y certificado
    // Al interceptar el servicio de detalle del estudiante mockeamos el response con nuestro detalleTramite.json que se encuentra en fixture
    cy.intercept(
      {
        method: "POST",
        url: url.service + "/tramite/id",
      },
      { fixture: "detalleTramite.json" }
    ).as("tramiteDetalle");

    cy.intercept(
      {
        method: "POST",
        url: url.service + "/tramite/adj",
      },
      { fixture: "adjuntos.json" }
    ).as("tramiteAdjunto");

    cy.intercept(
      {
        method: "POST",
        url: url.service + "/tramite/cer",
      },
      { fixture: "certificados.json" }
    ).as("tramiteCertificado");

    // Realizamos click en el primer registro
    cy.get("td > i.ni-bullet-list-67").first().click({ force: true });

    cy.wait(["@tramiteDetalle", "@tramiteAdjunto", "@tramiteCertificado"]);
    // Esperamos 3 seg cargue el modal
    cy.wait(3000);

    cy.get("td > i.ni-fat-remove").first().click({ force: true });

    // Validamos nombres del titulo , mensaje
    cy.get("#swal2-title")
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equals("¿Estas seguro de eliminar este registro?");
      });

    cy.get("#swal2-html-container")
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equals("Esta acción no puede revertirse");
      });
    // Validamos los nombres de nuestros botones
    cy.get("button.swal2-confirm")
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equals("Confirmar");
      });

    cy.get("button.swal2-cancel")
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equals("Cancelar");
      });

    cy.get("button.swal2-cancel").click({ force: true });
    // Realizamos click en cancelar por lo cual el sweet alert desparecera validamos que no exista el titulo o contenido
    cy.get("#swal2-title").should("not.exist");
    cy.get("#swal2-html-container").should("not.exist");
    cy.get("button.swal2-confirm").should("not.exist");
    cy.get("button.swal2-cancel").should("not.exist");
  });

  it("Verificamos Eliminar Estado Tramite OK (MOCK)", () => {
    // Interceptamos el servicio que carga la lista de tramites de los alumnos
    // Al interceptar el servicio que lista tramites los interceptamos y hacemos que responda el archivo tramites.json
    cy.intercept(
      {
        method: "GET",
        url: url.service + "/tramite",
      },
      { fixture: "tramites.json" }
    ).as("listaTramites");
    // Realizamos click en la opcion tramites
    cy.get("a").contains("Tramites").click({ force: true });
    // Esperamos que se liste
    cy.wait("@listaTramites");

    // Interceptamos los servicios del detalle tramite del estudiante , adjuntos y certificado
    // Al interceptar el servicio de detalle del estudiante mockeamos el response con nuestro detalleTramite.json que se encuentra en fixture
    cy.intercept(
      {
        method: "POST",
        url: url.service + "/tramite/id",
      },
      { fixture: "detalleTramite.json" }
    ).as("tramiteDetalle");

    cy.intercept(
      {
        method: "POST",
        url: url.service + "/tramite/adj",
      },
      { fixture: "adjuntos.json" }
    ).as("tramiteAdjunto");

    cy.intercept(
      {
        method: "POST",
        url: url.service + "/tramite/cer",
      },
      { fixture: "certificados.json" }
    ).as("tramiteCertificado");

    // Realizamos click en el primer registro
    cy.get("td > i.ni-bullet-list-67").first().click({ force: true });

    cy.wait(["@tramiteDetalle", "@tramiteAdjunto", "@tramiteCertificado"]);
    // Esperamos 3 seg cargue el modal
    cy.wait(3000);

    cy.get("td > i.ni-fat-remove").first().click({ force: true });

    // Validamos nombres del titulo , mensaje
    cy.get("#swal2-title")
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equals("¿Estas seguro de eliminar este registro?");
      });

    cy.get("#swal2-html-container")
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equals("Esta acción no puede revertirse");
      });
    // Validamos los nombres de nuestros botones
    cy.get("button.swal2-confirm")
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equals("Confirmar");
      });

    cy.get("button.swal2-cancel")
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equals("Cancelar");
      });
    // Interceptamos y forzamos a devolver un OK
    cy.intercept("DELETE", url.service + "/tramite", response.ok).as(
      "deleteMockTramite"
    );
    // Realizamos click en confirmar eliminacion
    cy.get("button.swal2-confirm").click({ force: true });
    cy.wait("@deleteMockTramite");
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
      .contains("correctamente")
      .invoke("text")
      .then((text) => {
        expect(text.trim()).to.contains("Se elimino correctamente el detalle");
      });

    // Validamos el alert de confirmacion
    cy.get("#swal2-title")
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equals("Eliminado!");
      });

    cy.get("#swal2-html-container")
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equals("El registro fue eliminado con exito");
      });
  });

  it("Verificamos Eliminar Estado Tramite Other Response (MOCK)", () => {
    // Interceptamos el servicio que carga la lista de tramites de los alumnos
    // Al interceptar el servicio que lista tramites los interceptamos y hacemos que responda el archivo tramites.json
    cy.intercept(
      {
        method: "GET",
        url: url.service + "/tramite",
      },
      { fixture: "tramites.json" }
    ).as("listaTramites");
    // Realizamos click en la opcion tramites
    cy.get("a").contains("Tramites").click({ force: true });
    // Esperamos que se liste
    cy.wait("@listaTramites");

    // Interceptamos los servicios del detalle tramite del estudiante , adjuntos y certificado
    // Al interceptar el servicio de detalle del estudiante mockeamos el response con nuestro detalleTramite.json que se encuentra en fixture
    cy.intercept(
      {
        method: "POST",
        url: url.service + "/tramite/id",
      },
      { fixture: "detalleTramite.json" }
    ).as("tramiteDetalle");

    cy.intercept(
      {
        method: "POST",
        url: url.service + "/tramite/adj",
      },
      { fixture: "adjuntos.json" }
    ).as("tramiteAdjunto");

    cy.intercept(
      {
        method: "POST",
        url: url.service + "/tramite/cer",
      },
      { fixture: "certificados.json" }
    ).as("tramiteCertificado");

    // Realizamos click en el primer registro
    cy.get("td > i.ni-bullet-list-67").first().click({ force: true });

    cy.wait(["@tramiteDetalle", "@tramiteAdjunto", "@tramiteCertificado"]);
    // Esperamos 3 seg cargue el modal
    cy.wait(3000);

    cy.get("td > i.ni-fat-remove").first().click({ force: true });

    // Validamos nombres del titulo , mensaje
    cy.get("#swal2-title")
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equals("¿Estas seguro de eliminar este registro?");
      });

    cy.get("#swal2-html-container")
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equals("Esta acción no puede revertirse");
      });
    // Validamos los nombres de nuestros botones
    cy.get("button.swal2-confirm")
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equals("Confirmar");
      });

    cy.get("button.swal2-cancel")
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equals("Cancelar");
      });
    // Interceptamos y forzamos a devolver un other response
    cy.intercept("DELETE", url.service + "/tramite", response.other).as(
      "deleteMockTramite"
    );
    // Realizamos click en confirmar eliminacion
    cy.get("button.swal2-confirm").click({ force: true });
    cy.wait("@deleteMockTramite");
    // Verificamos nuestro toast Error
    cy.get("#toast-container")
      .find("div")
      .find("div")
      .contains("Error")
      .invoke("text")
      .then((text) => {
        expect(text.trim()).to.equal("Error");
      });
    // Verificamos el contenido de nuestro toast Error
    cy.get("#toast-container")
      .find("div")
      .find("div")
      .contains(response.other.message)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).to.contains(response.other.message);
      });
  });

  it("Registro Nuevo Estado Tramite Estudiante OK", () => {
    // Interceptamos el servicio que carga la lista de tramites de los alumnos
    // Al interceptar el servicio que lista tramites los interceptamos y hacemos que responda el archivo tramites.json
    cy.intercept({
      method: "GET",
      url: url.service + "/tramite",
    }).as("listaTramites");
    // Realizamos click en la opcion tramites
    cy.get("a").contains("Tramites").click({ force: true });
    // Esperamos que se liste
    cy.wait("@listaTramites");

    // Interceptamos los servicios del detalle tramite del estudiante , adjuntos y certificado
    // Al interceptar el servicio de detalle del estudiante mockeamos el response con nuestro detalleTramite.json que se encuentra en fixture
    cy.intercept({
      method: "POST",
      url: url.service + "/tramite/id",
    }).as("tramiteDetalle");

    cy.intercept({
      method: "POST",
      url: url.service + "/tramite/adj",
    }).as("tramiteAdjunto");

    cy.intercept({
      method: "POST",
      url: url.service + "/tramite/cer",
    }).as("tramiteCertificado");

    // Realizamos click en el primer registro
    cy.get("td > i.ni-bullet-list-67").first().click({ force: true });

    cy.wait(["@tramiteDetalle", "@tramiteAdjunto", "@tramiteCertificado"]);
    // Esperamos 3 seg cargue el modal
    cy.wait(3000);
    cy.get("textarea[formControlName=observaciones]").type(
      "Esto una prueba escrita en Cypress E2E"
    );
    cy.get("select[formControlName=estado]").select("FINALIZADO", {
      force: true,
    });

    // Previamente a realizar el click interceptamos nuestro servicio
    cy.intercept("POST", url.service + "/tramite").as("registerStatusTramite");
    cy.get("#registerNewStatusTramite").click({ force: true });
    cy.wait("@registerStatusTramite");

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
      .contains("exitosamente")
      .invoke("text")
      .then((text) => {
        expect(text.trim()).to.contains(
          "Se registro exitosamente un nuevo estado para "
        );
      });
    // Validamos que se limpien los campos de registrar tramite
    cy.get("textarea[formControlName=observaciones]").should("have.value", "");
    cy.get("select[formControlName=estado] option:selected").should(
      "have.value",
      ""
    );
  });

  it("Registro Nuevo Estado Tramite Estudiante OK (MOCK)", () => {
    // Interceptamos el servicio que carga la lista de tramites de los alumnos
    // Al interceptar el servicio que lista tramites los interceptamos y hacemos que responda el archivo tramites.json
    cy.intercept(
      {
        method: "GET",
        url: url.service + "/tramite",
      },
      { fixture: "tramites.json" }
    ).as("listaTramites");
    // Realizamos click en la opcion tramites
    cy.get("a").contains("Tramites").click({ force: true });
    // Esperamos que se liste
    cy.wait("@listaTramites");

    // Interceptamos los servicios del detalle tramite del estudiante , adjuntos y certificado
    // Al interceptar el servicio de detalle del estudiante mockeamos el response con nuestro detalleTramite.json que se encuentra en fixture
    cy.intercept(
      {
        method: "POST",
        url: url.service + "/tramite/id",
      },
      { fixture: "detalleTramite.json" }
    ).as("tramiteDetalle");

    cy.intercept(
      {
        method: "POST",
        url: url.service + "/tramite/adj",
      },
      { fixture: "adjuntos.json" }
    ).as("tramiteAdjunto");

    cy.intercept(
      {
        method: "POST",
        url: url.service + "/tramite/cer",
      },
      { fixture: "certificados.json" }
    ).as("tramiteCertificado");

    // Realizamos click en el primer registro
    cy.get("td > i.ni-bullet-list-67").first().click({ force: true });

    cy.wait(["@tramiteDetalle", "@tramiteAdjunto", "@tramiteCertificado"]);
    // Esperamos 3 seg cargue el modal
    cy.wait(3000);
    cy.get("textarea[formControlName=observaciones]").type(
      "Esto una prueba escrita en Cypress E2E"
    );
    cy.get("select[formControlName=estado]").select("FINALIZADO", {
      force: true,
    });

    // Previamente a realizar el click interceptamos nuestro servicio y forzamos a retonar una respuesta OK mockeado
    cy.intercept("POST", url.service + "/tramite", response.ok).as(
      "registerStatusTramiteMockOK"
    );
    cy.get("#registerNewStatusTramite").click({ force: true });
    cy.wait("@registerStatusTramiteMockOK");

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
      .contains("exitosamente")
      .invoke("text")
      .then((text) => {
        expect(text.trim()).to.contains(
          "Se registro exitosamente un nuevo estado para "
        );
      });
    // Validamos que se limpien los campos de registrar tramite
    cy.get("textarea[formControlName=observaciones]").should("have.value", "");
    cy.get("select[formControlName=estado] option:selected").should(
      "have.value",
      ""
    );
  });

  it("Subir Nuevo Certificado Tramite Estudiante OK ", () => {
    // Interceptamos el servicio que carga la lista de tramites de los alumnos
    // Al interceptar el servicio que lista tramites los interceptamos y hacemos que responda el archivo tramites.json
    cy.intercept({
      method: "GET",
      url: url.service + "/tramite",
    }).as("listaTramites");
    // Realizamos click en la opcion tramites
    cy.get("a").contains("Tramites").click({ force: true });
    // Esperamos que se liste
    cy.wait("@listaTramites");

    // Interceptamos los servicios del detalle tramite del estudiante , adjuntos y certificado
    // Al interceptar el servicio de detalle del estudiante mockeamos el response con nuestro detalleTramite.json que se encuentra en fixture
    cy.intercept({
      method: "POST",
      url: url.service + "/tramite/id",
    }).as("tramiteDetalle");

    cy.intercept({
      method: "POST",
      url: url.service + "/tramite/adj",
    }).as("tramiteAdjunto");

    cy.intercept({
      method: "POST",
      url: url.service + "/tramite/cer",
    }).as("tramiteCertificado");

    // Realizamos click en el primer registro
    cy.get("td > i.ni-bullet-list-67").first().click({ force: true });

    cy.wait(["@tramiteDetalle", "@tramiteAdjunto", "@tramiteCertificado"]);
    // Esperamos 3 seg cargue el modal
    cy.wait(3000);
    // Previamente interceptamos el servicio de subir certitficado , mockeamos un response OK
    cy.intercept("POST", url.service + "/tramite/updatecertificado").as(
      "uploadCertificado"
    );
    // Validamos que el boton este inhabilitado hasta que se suba un archivo
    cy.get("#inputGroupFileAddon03").contains("Subir").should("be.disabled");
    // Subimos nuestro archivo example
    cy.get("input[type=file]").attachFile("example.pdf");
    // Cuando se sube el archivo en el selector del input file validar que se active
    cy.get("#inputGroupFileAddon03").contains("Subir").should("be.enabled");
    cy.wait(500);
    cy.get("#inputGroupFileAddon03").contains("Subir").click({ force: true });
    cy.wait("@uploadCertificado");
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
      .contains("correctamente")
      .invoke("text")
      .then((text) => {
        expect(text.trim()).to.contains(
          "Se subio correctamente certificado para el tramite"
        );
      });
    // Validamos que el boton este inhabilitado ya que se limpia el input file
    cy.get("#inputGroupFileAddon03").contains("Subir").should("be.disabled");
  });

  it("Subir Nuevo Certificado Tramite Estudiante OK (MOCK)", () => {
    // Interceptamos el servicio que carga la lista de tramites de los alumnos
    // Al interceptar el servicio que lista tramites los interceptamos y hacemos que responda el archivo tramites.json
    cy.intercept(
      {
        method: "GET",
        url: url.service + "/tramite",
      },
      { fixture: "tramites.json" }
    ).as("listaTramites");
    // Realizamos click en la opcion tramites
    cy.get("a").contains("Tramites").click({ force: true });
    // Esperamos que se liste
    cy.wait("@listaTramites");

    // Interceptamos los servicios del detalle tramite del estudiante , adjuntos y certificado
    // Al interceptar el servicio de detalle del estudiante mockeamos el response con nuestro detalleTramite.json que se encuentra en fixture
    cy.intercept(
      {
        method: "POST",
        url: url.service + "/tramite/id",
      },
      { fixture: "detalleTramite.json" }
    ).as("tramiteDetalle");

    cy.intercept(
      {
        method: "POST",
        url: url.service + "/tramite/adj",
      },
      { fixture: "adjuntos.json" }
    ).as("tramiteAdjunto");

    cy.intercept(
      {
        method: "POST",
        url: url.service + "/tramite/cer",
      },
      { fixture: "certificados.json" }
    ).as("tramiteCertificado");

    // Realizamos click en el primer registro
    cy.get("td > i.ni-bullet-list-67").first().click({ force: true });

    cy.wait(["@tramiteDetalle", "@tramiteAdjunto", "@tramiteCertificado"]);
    // Esperamos 3 seg cargue el modal
    cy.wait(3000);
    // Previamente interceptamos el servicio de subir certitficado , mockeamos un response OK
    cy.intercept(
      "POST",
      url.service + "/tramite/updatecertificado",
      response.ok
    ).as("uploadCertificadoMockOK");
    // Validamos que el boton este inhabilitado hasta que se suba un archivo
    cy.get("#inputGroupFileAddon03").contains("Subir").should("be.disabled");
    // Subimos nuestro archivo example
    cy.get("input[type=file]").attachFile("example.pdf");
    // Cuando se sube el archivo en el selector del input file validar que se active
    cy.get("#inputGroupFileAddon03").contains("Subir").should("be.enabled");
    cy.wait(500);
    cy.get("#inputGroupFileAddon03").contains("Subir").click({ force: true });
    cy.wait("@uploadCertificadoMockOK");
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
      .contains("correctamente")
      .invoke("text")
      .then((text) => {
        expect(text.trim()).to.contains(
          "Se subio correctamente certificado para el tramite"
        );
      });
    // Validamos que el boton este inhabilitado ya que se limpia el input file
    cy.get("#inputGroupFileAddon03").contains("Subir").should("be.disabled");
  });

  it("Subir Nuevo Certificado Tramite Estudiante Other Response (MOCK)", () => {
    // Interceptamos el servicio que carga la lista de tramites de los alumnos
    // Al interceptar el servicio que lista tramites los interceptamos y hacemos que responda el archivo tramites.json
    cy.intercept(
      {
        method: "GET",
        url: url.service + "/tramite",
      },
      { fixture: "tramites.json" }
    ).as("listaTramites");
    // Realizamos click en la opcion tramites
    cy.get("a").contains("Tramites").click({ force: true });
    // Esperamos que se liste
    cy.wait("@listaTramites");

    // Interceptamos los servicios del detalle tramite del estudiante , adjuntos y certificado
    // Al interceptar el servicio de detalle del estudiante mockeamos el response con nuestro detalleTramite.json que se encuentra en fixture
    cy.intercept(
      {
        method: "POST",
        url: url.service + "/tramite/id",
      },
      { fixture: "detalleTramite.json" }
    ).as("tramiteDetalle");

    cy.intercept(
      {
        method: "POST",
        url: url.service + "/tramite/adj",
      },
      { fixture: "adjuntos.json" }
    ).as("tramiteAdjunto");

    cy.intercept(
      {
        method: "POST",
        url: url.service + "/tramite/cer",
      },
      { fixture: "certificados.json" }
    ).as("tramiteCertificado");

    // Realizamos click en el primer registro
    cy.get("td > i.ni-bullet-list-67").first().click({ force: true });

    cy.wait(["@tramiteDetalle", "@tramiteAdjunto", "@tramiteCertificado"]);
    // Esperamos 3 seg cargue el modal
    cy.wait(3000);
    // Previamente interceptamos el servicio de subir certitficado , mockeamos un response OK
    cy.intercept(
      "POST",
      url.service + "/tramite/updatecertificado",
      response.other
    ).as("uploadCertificadoMockOther");
    // Validamos que el boton este inhabilitado hasta que se suba un archivo
    cy.get("#inputGroupFileAddon03").contains("Subir").should("be.disabled");
    // Subimos nuestro archivo example
    cy.get("input[type=file]").attachFile("example.pdf");
    // Cuando se sube el archivo en el selector del input file validar que se active
    cy.get("#inputGroupFileAddon03").contains("Subir").should("be.enabled");
    cy.wait(500);
    cy.get("#inputGroupFileAddon03").contains("Subir").click({ force: true });
    cy.wait("@uploadCertificadoMockOther");
    // Verificamos nuestro toast Error
    cy.get("#toast-container")
      .find("div")
      .find("div")
      .contains("Error")
      .invoke("text")
      .then((text) => {
        expect(text.trim()).to.equal("Error");
      });
    // Verificamos el contenido de nuestro toast exito
    cy.get("#toast-container")
      .find("div")
      .find("div")
      .contains(response.other.message)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).to.contains(response.other.message);
      });
    // Validamos que el boton este inhabilitado ya que queda adjunto el archivo y nos permite volver realizar otro intento
    cy.get("#inputGroupFileAddon03").contains("Subir").should("be.enabled");
  });

  it("Subir Nuevo Certificado Tramite Estudiante NetWork Error (MOCK)", () => {
    // Interceptamos el servicio que carga la lista de tramites de los alumnos
    // Al interceptar el servicio que lista tramites los interceptamos y hacemos que responda el archivo tramites.json
    cy.intercept(
      {
        method: "GET",
        url: url.service + "/tramite",
      },
      { fixture: "tramites.json" }
    ).as("listaTramites");
    // Realizamos click en la opcion tramites
    cy.get("a").contains("Tramites").click({ force: true });
    // Esperamos que se liste
    cy.wait("@listaTramites");

    // Interceptamos los servicios del detalle tramite del estudiante , adjuntos y certificado
    // Al interceptar el servicio de detalle del estudiante mockeamos el response con nuestro detalleTramite.json que se encuentra en fixture
    cy.intercept(
      {
        method: "POST",
        url: url.service + "/tramite/id",
      },
      { fixture: "detalleTramite.json" }
    ).as("tramiteDetalle");

    cy.intercept(
      {
        method: "POST",
        url: url.service + "/tramite/adj",
      },
      { fixture: "adjuntos.json" }
    ).as("tramiteAdjunto");

    cy.intercept(
      {
        method: "POST",
        url: url.service + "/tramite/cer",
      },
      { fixture: "certificados.json" }
    ).as("tramiteCertificado");

    // Realizamos click en el primer registro
    cy.get("td > i.ni-bullet-list-67").first().click({ force: true });

    cy.wait(["@tramiteDetalle", "@tramiteAdjunto", "@tramiteCertificado"]);
    // Esperamos 3 seg cargue el modal
    cy.wait(3000);
    // Previamente interceptamos el servicio de subir certitficado , mockeamos un response OK
    cy.intercept("POST", url.service + "/tramite/updatecertificado", {
      forceNetworkError: true,
    }).as("uploadCertificadoMockOther");
    // Validamos que el boton este inhabilitado hasta que se suba un archivo
    cy.get("#inputGroupFileAddon03").contains("Subir").should("be.disabled");
    // Subimos nuestro archivo example
    cy.get("input[type=file]").attachFile("example.pdf");
    // Cuando se sube el archivo en el selector del input file validar que se active
    cy.get("#inputGroupFileAddon03").contains("Subir").should("be.enabled");
    cy.wait(500);
    cy.get("#inputGroupFileAddon03").contains("Subir").click({ force: true });
    cy.wait("@uploadCertificadoMockOther");
    // Verificamos nuestro toast Error
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
      .contains("certificado")
      .invoke("text")
      .then((text) => {
        expect(text.trim()).to.contains(
          "Ocurrio un error al subir el certificado"
        );
      });
  });

  it("Registro Nuevo Estado Tramite Estudiante Other Response (MOCK)", () => {
    // Interceptamos el servicio que carga la lista de tramites de los alumnos
    // Al interceptar el servicio que lista tramites los interceptamos y hacemos que responda el archivo tramites.json
    cy.intercept(
      {
        method: "GET",
        url: url.service + "/tramite",
      },
      { fixture: "tramites.json" }
    ).as("listaTramites");
    // Realizamos click en la opcion tramites
    cy.get("a").contains("Tramites").click({ force: true });
    // Esperamos que se liste
    cy.wait("@listaTramites");

    // Interceptamos los servicios del detalle tramite del estudiante , adjuntos y certificado
    // Al interceptar el servicio de detalle del estudiante mockeamos el response con nuestro detalleTramite.json que se encuentra en fixture
    cy.intercept(
      {
        method: "POST",
        url: url.service + "/tramite/id",
      },
      { fixture: "detalleTramite.json" }
    ).as("tramiteDetalle");

    cy.intercept(
      {
        method: "POST",
        url: url.service + "/tramite/adj",
      },
      { fixture: "adjuntos.json" }
    ).as("tramiteAdjunto");

    cy.intercept(
      {
        method: "POST",
        url: url.service + "/tramite/cer",
      },
      { fixture: "certificados.json" }
    ).as("tramiteCertificado");

    // Realizamos click en el primer registro
    cy.get("td > i.ni-bullet-list-67").first().click({ force: true });

    cy.wait(["@tramiteDetalle", "@tramiteAdjunto", "@tramiteCertificado"]);
    // Esperamos 3 seg cargue el modal
    cy.wait(3000);
    cy.get("textarea[formControlName=observaciones]").type(
      "Esto una prueba escrita en Cypress E2E"
    );
    cy.get("select[formControlName=estado]").select("FINALIZADO", {
      force: true,
    });

    // Previamente a realizar el click interceptamos nuestro servicio y forzamos a retonar una respuesta diferente a OK
    cy.intercept("POST", url.service + "/tramite", response.other).as(
      "registerStatusTramiteMockOther"
    );
    cy.get("#registerNewStatusTramite").click({ force: true });
    cy.wait("@registerStatusTramiteMockOther");

    // Verificamos nuestro toast Error
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
      .contains(response.other.message)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).to.contains(response.other.message);
      });
    // Validamos que se mantengan los valores en nuestros inputs de registro
    cy.get("textarea[formControlName=observaciones]").should(
      "have.value",
      "Esto una prueba escrita en Cypress E2E"
    );
    cy.get("select[formControlName=estado] option:selected").should(
      "have.value",
      "FINALIZADO"
    );
  });

  it("Registro Nuevo Estado Tramite Estudiante NetWork Error (MOCK)", () => {
    // Interceptamos el servicio que carga la lista de tramites de los alumnos
    // Al interceptar el servicio que lista tramites los interceptamos y hacemos que responda el archivo tramites.json
    cy.intercept(
      {
        method: "GET",
        url: url.service + "/tramite",
      },
      { fixture: "tramites.json" }
    ).as("listaTramites");
    // Realizamos click en la opcion tramites
    cy.get("a").contains("Tramites").click({ force: true });
    // Esperamos que se liste
    cy.wait("@listaTramites");

    // Interceptamos los servicios del detalle tramite del estudiante , adjuntos y certificado
    // Al interceptar el servicio de detalle del estudiante mockeamos el response con nuestro detalleTramite.json que se encuentra en fixture
    cy.intercept(
      {
        method: "POST",
        url: url.service + "/tramite/id",
      },
      { fixture: "detalleTramite.json" }
    ).as("tramiteDetalle");

    cy.intercept(
      {
        method: "POST",
        url: url.service + "/tramite/adj",
      },
      { fixture: "adjuntos.json" }
    ).as("tramiteAdjunto");

    cy.intercept(
      {
        method: "POST",
        url: url.service + "/tramite/cer",
      },
      { fixture: "certificados.json" }
    ).as("tramiteCertificado");

    // Realizamos click en el primer registro
    cy.get("td > i.ni-bullet-list-67").first().click({ force: true });

    cy.wait(["@tramiteDetalle", "@tramiteAdjunto", "@tramiteCertificado"]);
    // Esperamos 3 seg cargue el modal
    cy.wait(3000);
    cy.get("textarea[formControlName=observaciones]").type(
      "Esto una prueba escrita en Cypress E2E"
    );
    cy.get("select[formControlName=estado]").select("FINALIZADO", {
      force: true,
    });

    // Previamente a realizar el click interceptamos nuestro servicio y forzamos un error de red
    cy.intercept("POST", url.service + "/tramite", {
      forceNetworkError: true,
    }).as("registerStatusTramiteMockOK");
    cy.get("#registerNewStatusTramite").click({ force: true });
    cy.wait("@registerStatusTramiteMockOK");

    // Verificamos nuestro toast Error
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
      .contains("nuevo estado")
      .invoke("text")
      .then((text) => {
        expect(text.trim()).to.contains(
          "Sucedio un error al registrar el nuevo estado"
        );
      });
    // Validamos que se mantengan los valores en nuestros inputs de registro
    cy.get("textarea[formControlName=observaciones]").should(
      "have.value",
      "Esto una prueba escrita en Cypress E2E"
    );
    cy.get("select[formControlName=estado] option:selected").should(
      "have.value",
      "FINALIZADO"
    );
  });

  it("Verficamos ReactiveForms Registrar Nuevo Estado", () => {
    // Interceptamos el servicio que carga la lista de tramites de los alumnos
    // Al interceptar el servicio que lista tramites los interceptamos y hacemos que responda el archivo tramites.json
    cy.intercept(
      {
        method: "GET",
        url: url.service + "/tramite",
      },
      { fixture: "tramites.json" }
    ).as("listaTramites");
    // Realizamos click en la opcion tramites
    cy.get("a").contains("Tramites").click({ force: true });
    // Esperamos que se liste
    cy.wait("@listaTramites");

    // Interceptamos los servicios del detalle tramite del estudiante , adjuntos y certificado
    // Al interceptar el servicio de detalle del estudiante mockeamos el response con nuestro detalleTramite.json que se encuentra en fixture
    cy.intercept(
      {
        method: "POST",
        url: url.service + "/tramite/id",
      },
      { fixture: "detalleTramite.json" }
    ).as("tramiteDetalle");

    cy.intercept(
      {
        method: "POST",
        url: url.service + "/tramite/adj",
      },
      { fixture: "adjuntos.json" }
    ).as("tramiteAdjunto");

    cy.intercept(
      {
        method: "POST",
        url: url.service + "/tramite/cer",
      },
      { fixture: "certificados.json" }
    ).as("tramiteCertificado");

    // Realizamos click en el primer registro
    cy.get("td > i.ni-bullet-list-67").first().click({ force: true });

    cy.wait(["@tramiteDetalle", "@tramiteAdjunto", "@tramiteCertificado"]);
    // Esperamos 3 seg cargue el modal
    cy.wait(3000);
    cy.get("textarea[formControlName=observaciones]").click({ force: true });

    cy.get("select[formControlName=estado]").select("Seleccione un estado", {
      force: true,
    });
    cy.get("textarea[formControlName=observaciones]").click({ force: true });

    // Validamos nuestros mensajes de restriccion requeridos
    cy.get("#msgReqEstadoNew")
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equals("Se requiere seleccionar estado");
      });

    cy.get("#msgReqObsNew")
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equals("Se requiere ingresar observacion");
      });
    // Validamos que se mantenga desactiviado nuestro boton
    cy.get("#registerNewStatusTramite").should("be.disabled");
  });

  it("Verificamos Interfaz Editar Tramite Estudiante", () => {
    // Interceptamos el servicio que carga la lista de tramites de los alumnos
    // Al interceptar el servicio que lista tramites los interceptamos y hacemos que responda el archivo tramites.json
    cy.intercept(
      {
        method: "GET",
        url: url.service + "/tramite",
      },
      { fixture: "tramites.json" }
    ).as("listaTramites");
    // Realizamos click en la opcion tramites
    cy.get("a").contains("Tramites").click({ force: true });
    // Esperamos que se liste
    cy.wait("@listaTramites");

    // Interceptamos los servicios del detalle tramite del estudiante , adjuntos y certificado
    // Al interceptar el servicio de detalle del estudiante mockeamos el response con nuestro detalleTramite.json que se encuentra en fixture
    cy.intercept(
      {
        method: "POST",
        url: url.service + "/tramite/id",
      },
      { fixture: "detalleTramite.json" }
    ).as("tramiteDetalle");

    cy.intercept(
      {
        method: "POST",
        url: url.service + "/tramite/adj",
      },
      { fixture: "adjuntos.json" }
    ).as("tramiteAdjunto");

    cy.intercept(
      {
        method: "POST",
        url: url.service + "/tramite/cer",
      },
      { fixture: "certificados.json" }
    ).as("tramiteCertificado");

    // Realizamos click en el primer registro
    cy.get("td > i.ni-bullet-list-67").first().click({ force: true });

    cy.wait(["@tramiteDetalle", "@tramiteAdjunto", "@tramiteCertificado"]);
    // Esperamos 3 seg cargue el modal
    cy.wait(3000);

    cy.get("td > i.fa-edit").first().click({ force: true });

    cy.fixture("detalleTramite").then((tramiteEdit) => {
      // Validamos el valor seleccionado
      cy.get("select.form-control.edit")
        .invoke("val")
        .then((val) => {
          expect(val).equals(tramiteEdit[0].estado);
        });
      cy.get("input[formControlName=fecha]").should(
        "have.value",
        tramiteEdit[0].fecha
      );
      cy.get("input[formControlName=id_est_doc]").should(
        "have.value",
        tramiteEdit[0].id_est_doc
      );
      cy.get("#editTramite").should("have.value", tramiteEdit[0].observaciones);
    });

    cy.get("div.modal-body > div.form-group > label").then((element) => {
      expect(element[0].innerText.trim().toLocaleUpperCase()).equals(
        "N° TRAMITE"
      );
      expect(element[1].innerText.trim().toLocaleUpperCase()).equals("FECHA");
      expect(element[2].innerText.trim().toLocaleUpperCase()).equals("ESTADO");
      expect(element[3].innerText.trim().toLocaleUpperCase()).equals(
        "OBSERVACIÓN"
      );
    });

    cy.get("#btnEditTramite")
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equals("Actualizar");
      });
  });

  it("Verificamos Editar Tramite Estudiante OK", () => {
    // Interceptamos el servicio que carga la lista de tramites de los alumnos
    // Al interceptar el servicio que lista tramites los interceptamos y hacemos que responda el archivo tramites.json
    cy.intercept({
      method: "GET",
      url: url.service + "/tramite",
    }).as("listaTramites");
    // Realizamos click en la opcion tramites
    cy.get("a").contains("Tramites").click({ force: true });
    // Esperamos que se liste
    cy.wait("@listaTramites");

    // Interceptamos los servicios del detalle tramite del estudiante , adjuntos y certificado
    // Al interceptar el servicio de detalle del estudiante mockeamos el response con nuestro detalleTramite.json que se encuentra en fixture
    cy.intercept({
      method: "POST",
      url: url.service + "/tramite/id",
    }).as("tramiteDetalle");

    cy.intercept({
      method: "POST",
      url: url.service + "/tramite/adj",
    }).as("tramiteAdjunto");

    cy.intercept({
      method: "POST",
      url: url.service + "/tramite/cer",
    }).as("tramiteCertificado");

    // Realizamos click en el primer registro
    cy.get("td > i.ni-bullet-list-67").first().click({ force: true });

    cy.wait(["@tramiteDetalle", "@tramiteAdjunto", "@tramiteCertificado"]);
    // Esperamos 3 seg cargue el modal
    cy.wait(3000);

    cy.get("td > i.fa-edit").first().click({ force: true });

    cy.intercept("PATCH", url.service + "/tramite").as("editTramite");

    cy.get("#btnEditTramite").click({ force: true });

    cy.wait("@editTramite");
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
      .contains("correctamente")
      .invoke("text")
      .then((text) => {
        expect(text.trim()).to.contains(
          "Se actualizo correctamente el estado para "
        );
      });
    cy.wait("@tramiteDetalle");
  });

  it("Verificamos Editar Tramite Estudiante OK (MOCK)", () => {
    // Interceptamos el servicio que carga la lista de tramites de los alumnos
    // Al interceptar el servicio que lista tramites los interceptamos y hacemos que responda el archivo tramites.json
    cy.intercept(
      {
        method: "GET",
        url: url.service + "/tramite",
      },
      { fixture: "tramites.json" }
    ).as("listaTramites");
    // Realizamos click en la opcion tramites
    cy.get("a").contains("Tramites").click({ force: true });
    // Esperamos que se liste
    cy.wait("@listaTramites");

    // Interceptamos los servicios del detalle tramite del estudiante , adjuntos y certificado
    // Al interceptar el servicio de detalle del estudiante mockeamos el response con nuestro detalleTramite.json que se encuentra en fixture
    cy.intercept(
      {
        method: "POST",
        url: url.service + "/tramite/id",
      },
      { fixture: "detalleTramite.json" }
    ).as("tramiteDetalle");

    cy.intercept(
      {
        method: "POST",
        url: url.service + "/tramite/adj",
      },
      { fixture: "adjuntos.json" }
    ).as("tramiteAdjunto");

    cy.intercept(
      {
        method: "POST",
        url: url.service + "/tramite/cer",
      },
      { fixture: "certificados.json" }
    ).as("tramiteCertificado");

    // Realizamos click en el primer registro
    cy.get("td > i.ni-bullet-list-67").first().click({ force: true });

    cy.wait(["@tramiteDetalle", "@tramiteAdjunto", "@tramiteCertificado"]);
    // Esperamos 3 seg cargue el modal
    cy.wait(3000);

    cy.get("td > i.fa-edit").first().click({ force: true });

    cy.intercept("PATCH", url.service + "/tramite", response.ok).as(
      "editTramite"
    );

    cy.get("#btnEditTramite").click({ force: true });

    cy.wait("@editTramite");
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
      .contains("correctamente")
      .invoke("text")
      .then((text) => {
        expect(text.trim()).to.contains(
          "Se actualizo correctamente el estado para "
        );
      });
    cy.wait("@tramiteDetalle");
  });

  it("Verificamos Editar Tramite Estudiante Other Response (MOCK)", () => {
    // Interceptamos el servicio que carga la lista de tramites de los alumnos
    // Al interceptar el servicio que lista tramites los interceptamos y hacemos que responda el archivo tramites.json
    cy.intercept(
      {
        method: "GET",
        url: url.service + "/tramite",
      },
      { fixture: "tramites.json" }
    ).as("listaTramites");
    // Realizamos click en la opcion tramites
    cy.get("a").contains("Tramites").click({ force: true });
    // Esperamos que se liste
    cy.wait("@listaTramites");

    // Interceptamos los servicios del detalle tramite del estudiante , adjuntos y certificado
    // Al interceptar el servicio de detalle del estudiante mockeamos el response con nuestro detalleTramite.json que se encuentra en fixture
    cy.intercept(
      {
        method: "POST",
        url: url.service + "/tramite/id",
      },
      { fixture: "detalleTramite.json" }
    ).as("tramiteDetalle");

    cy.intercept(
      {
        method: "POST",
        url: url.service + "/tramite/adj",
      },
      { fixture: "adjuntos.json" }
    ).as("tramiteAdjunto");

    cy.intercept(
      {
        method: "POST",
        url: url.service + "/tramite/cer",
      },
      { fixture: "certificados.json" }
    ).as("tramiteCertificado");

    // Realizamos click en el primer registro
    cy.get("td > i.ni-bullet-list-67").first().click({ force: true });

    cy.wait(["@tramiteDetalle", "@tramiteAdjunto", "@tramiteCertificado"]);
    // Esperamos 3 seg cargue el modal
    cy.wait(3000);

    cy.get("td > i.fa-edit").first().click({ force: true });

    // Mockeamos para que nos responda un caso diferente a OK
    cy.intercept("PATCH", url.service + "/tramite", response.other).as(
      "editTramite"
    );

    cy.get("#btnEditTramite").click({ force: true });

    cy.wait("@editTramite");
    // Verificamos nuestro toast ERROR
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
      .contains(response.other.message)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).to.contains(response.other.message);
      });
    cy.wait("@tramiteDetalle");
  });

  it("Verificamos Editar Tramite Estudiante NetWork Error (MOCK)", () => {
    // Interceptamos el servicio que carga la lista de tramites de los alumnos
    // Al interceptar el servicio que lista tramites los interceptamos y hacemos que responda el archivo tramites.json
    cy.intercept(
      {
        method: "GET",
        url: url.service + "/tramite",
      },
      { fixture: "tramites.json" }
    ).as("listaTramites");
    // Realizamos click en la opcion tramites
    cy.get("a").contains("Tramites").click({ force: true });
    // Esperamos que se liste
    cy.wait("@listaTramites");

    // Interceptamos los servicios del detalle tramite del estudiante , adjuntos y certificado
    // Al interceptar el servicio de detalle del estudiante mockeamos el response con nuestro detalleTramite.json que se encuentra en fixture
    cy.intercept(
      {
        method: "POST",
        url: url.service + "/tramite/id",
      },
      { fixture: "detalleTramite.json" }
    ).as("tramiteDetalle");

    cy.intercept(
      {
        method: "POST",
        url: url.service + "/tramite/adj",
      },
      { fixture: "adjuntos.json" }
    ).as("tramiteAdjunto");

    cy.intercept(
      {
        method: "POST",
        url: url.service + "/tramite/cer",
      },
      { fixture: "certificados.json" }
    ).as("tramiteCertificado");

    // Realizamos click en el primer registro
    cy.get("td > i.ni-bullet-list-67").first().click({ force: true });

    cy.wait(["@tramiteDetalle", "@tramiteAdjunto", "@tramiteCertificado"]);
    // Esperamos 3 seg cargue el modal
    cy.wait(3000);

    cy.get("td > i.fa-edit").first().click({ force: true });

    // Mockeamos para que nos responda un network Error
    cy.intercept("PATCH", url.service + "/tramite", {
      forceNetworkError: true,
    }).as("editTramiteError");

    cy.get("#btnEditTramite").click({ force: true });

    cy.wait("@editTramiteError");
    // Verificamos nuestro toast ERROR
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
      .contains("modificar")
      .invoke("text")
      .then((text) => {
        expect(text.trim()).to.contains(
          "Sucedio un error al modificar el estado"
        );
      });
    cy.wait("@tramiteDetalle");
  });

  it("Verificamos Eliminar Certificado Tramite OK", () => {
    // Interceptamos el servicio que carga la lista de tramites de los alumnos
    // Al interceptar el servicio que lista tramites los interceptamos y hacemos que responda el archivo tramites.json
    cy.intercept({
      method: "GET",
      url: url.service + "/tramite",
    }).as("listaTramites");
    // Realizamos click en la opcion tramites
    cy.get("a").contains("Tramites").click({ force: true });
    // Esperamos que se liste
    cy.wait("@listaTramites");

    // Interceptamos los servicios del detalle tramite del estudiante , adjuntos y certificado
    // Al interceptar el servicio de detalle del estudiante mockeamos el response con nuestro detalleTramite.json que se encuentra en fixture
    cy.intercept({
      method: "POST",
      url: url.service + "/tramite/id",
    }).as("tramiteDetalle");

    cy.intercept({
      method: "POST",
      url: url.service + "/tramite/adj",
    }).as("tramiteAdjunto");

    cy.intercept({
      method: "POST",
      url: url.service + "/tramite/cer",
    }).as("tramiteCertificado");

    // Realizamos click en el primer registro
    cy.get("td > i.ni-bullet-list-67").first().click({ force: true });

    cy.wait(["@tramiteDetalle", "@tramiteAdjunto", "@tramiteCertificado"]);
    // Esperamos 3 seg cargue el modal
    cy.wait(3000);

    // Validamos click en el tab Certificado
    cy.get("span").contains("Certificado").click({ force: true });

    cy.get("td.delete > i.ni-fat-remove").first().click({ force: true });

    // Validamos nombres del titulo , mensaje
    cy.get("#swal2-title")
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equals("¿Estas seguro de eliminar este registro?");
      });

    cy.get("#swal2-html-container")
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equals("Esta acción no puede revertirse");
      });
    // Validamos los nombres de nuestros botones
    cy.get("button.swal2-confirm")
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equals("Confirmar");
      });

    cy.get("button.swal2-cancel")
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equals("Cancelar");
      });
    // Interceptamos y forzamos a devolver un OK
    cy.intercept("DELETE", url.service + "/tramite/cer/", response.ok).as(
      "deleteCertificado"
    );
    // Realizamos click en confirmar eliminacion
    cy.get("button.swal2-confirm").click({ force: true });
    cy.wait("@deleteCertificado");
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
      .contains("correctamente")
      .invoke("text")
      .then((text) => {
        expect(text.trim()).to.contains(
          "Se elimino correctamente el certificado"
        );
      });

    // Validamos el alert de confirmacion
    cy.get("#swal2-title")
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equals("Eliminado!");
      });

    cy.get("#swal2-html-container")
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equals("El registro fue eliminado con exito");
      });
  });

  it("Verificamos Eliminar Certificado Tramite OK (MOCK)", () => {
    // Interceptamos el servicio que carga la lista de tramites de los alumnos
    // Al interceptar el servicio que lista tramites los interceptamos y hacemos que responda el archivo tramites.json
    cy.intercept(
      {
        method: "GET",
        url: url.service + "/tramite",
      },
      { fixture: "tramites.json" }
    ).as("listaTramites");
    // Realizamos click en la opcion tramites
    cy.get("a").contains("Tramites").click({ force: true });
    // Esperamos que se liste
    cy.wait("@listaTramites");

    // Interceptamos los servicios del detalle tramite del estudiante , adjuntos y certificado
    // Al interceptar el servicio de detalle del estudiante mockeamos el response con nuestro detalleTramite.json que se encuentra en fixture
    cy.intercept(
      {
        method: "POST",
        url: url.service + "/tramite/id",
      },
      { fixture: "detalleTramite.json" }
    ).as("tramiteDetalle");

    cy.intercept(
      {
        method: "POST",
        url: url.service + "/tramite/adj",
      },
      { fixture: "adjuntos.json" }
    ).as("tramiteAdjunto");

    cy.intercept(
      {
        method: "POST",
        url: url.service + "/tramite/cer",
      },
      { fixture: "certificados.json" }
    ).as("tramiteCertificado");

    // Realizamos click en el primer registro
    cy.get("td > i.ni-bullet-list-67").first().click({ force: true });

    cy.wait(["@tramiteDetalle", "@tramiteAdjunto", "@tramiteCertificado"]);
    // Esperamos 3 seg cargue el modal
    cy.wait(3000);

    // Validamos click en el tab Certificado
    cy.get("span").contains("Certificado").click({ force: true });

    cy.get("td.delete > i.ni-fat-remove").first().click({ force: true });

    // Validamos nombres del titulo , mensaje
    cy.get("#swal2-title")
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equals("¿Estas seguro de eliminar este registro?");
      });

    cy.get("#swal2-html-container")
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equals("Esta acción no puede revertirse");
      });
    // Validamos los nombres de nuestros botones
    cy.get("button.swal2-confirm")
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equals("Confirmar");
      });

    cy.get("button.swal2-cancel")
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equals("Cancelar");
      });
    // Interceptamos y forzamos a devolver un OK
    cy.intercept("DELETE", url.service + "/tramite/cer/", response.ok).as(
      "deleteMockCer"
    );
    // Realizamos click en confirmar eliminacion
    cy.get("button.swal2-confirm").click({ force: true });
    cy.wait("@deleteMockCer");
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
      .contains("correctamente")
      .invoke("text")
      .then((text) => {
        expect(text.trim()).to.contains(
          "Se elimino correctamente el certificado"
        );
      });

    // Validamos el alert de confirmacion
    cy.get("#swal2-title")
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equals("Eliminado!");
      });

    cy.get("#swal2-html-container")
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equals("El registro fue eliminado con exito");
      });
  });

  it("Verificamos Eliminar Certificado Tramite Other Response (MOCK)", () => {
    // Interceptamos el servicio que carga la lista de tramites de los alumnos
    // Al interceptar el servicio que lista tramites los interceptamos y hacemos que responda el archivo tramites.json
    cy.intercept(
      {
        method: "GET",
        url: url.service + "/tramite",
      },
      { fixture: "tramites.json" }
    ).as("listaTramites");
    // Realizamos click en la opcion tramites
    cy.get("a").contains("Tramites").click({ force: true });
    // Esperamos que se liste
    cy.wait("@listaTramites");

    // Interceptamos los servicios del detalle tramite del estudiante , adjuntos y certificado
    // Al interceptar el servicio de detalle del estudiante mockeamos el response con nuestro detalleTramite.json que se encuentra en fixture
    cy.intercept(
      {
        method: "POST",
        url: url.service + "/tramite/id",
      },
      { fixture: "detalleTramite.json" }
    ).as("tramiteDetalle");

    cy.intercept(
      {
        method: "POST",
        url: url.service + "/tramite/adj",
      },
      { fixture: "adjuntos.json" }
    ).as("tramiteAdjunto");

    cy.intercept(
      {
        method: "POST",
        url: url.service + "/tramite/cer",
      },
      { fixture: "certificados.json" }
    ).as("tramiteCertificado");

    // Realizamos click en el primer registro
    cy.get("td > i.ni-bullet-list-67").first().click({ force: true });

    cy.wait(["@tramiteDetalle", "@tramiteAdjunto", "@tramiteCertificado"]);
    // Esperamos 3 seg cargue el modal
    cy.wait(3000);

    // Validamos click en el tab Certificado
    cy.get("span").contains("Certificado").click({ force: true });

    cy.get("td.delete > i.ni-fat-remove").first().click({ force: true });

    // Validamos nombres del titulo , mensaje
    cy.get("#swal2-title")
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equals("¿Estas seguro de eliminar este registro?");
      });

    cy.get("#swal2-html-container")
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equals("Esta acción no puede revertirse");
      });
    // Validamos los nombres de nuestros botones
    cy.get("button.swal2-confirm")
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equals("Confirmar");
      });

    cy.get("button.swal2-cancel")
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equals("Cancelar");
      });
    // Interceptamos y forzamos a devolver un other response
    cy.intercept("DELETE", url.service + "/tramite/cer/", response.other).as(
      "deleteMockTramite"
    );
    // Realizamos click en confirmar eliminacion
    cy.get("button.swal2-confirm").click({ force: true });
    cy.wait("@deleteMockTramite");
    // Verificamos nuestro toast Error
    cy.get("#toast-container")
      .find("div")
      .find("div")
      .contains("Error")
      .invoke("text")
      .then((text) => {
        expect(text.trim()).to.equal("Error");
      });
    // Verificamos el contenido de nuestro toast Error
    cy.get("#toast-container")
      .find("div")
      .find("div")
      .contains(response.other.message)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).to.contains(response.other.message);
      });
  });

  it("Verificamos Eliminar Certificado Tramite NetWork Error (MOCK)", () => {
    // Interceptamos el servicio que carga la lista de tramites de los alumnos
    // Al interceptar el servicio que lista tramites los interceptamos y hacemos que responda el archivo tramites.json
    cy.intercept(
      {
        method: "GET",
        url: url.service + "/tramite",
      },
      { fixture: "tramites.json" }
    ).as("listaTramites");
    // Realizamos click en la opcion tramites
    cy.get("a").contains("Tramites").click({ force: true });
    // Esperamos que se liste
    cy.wait("@listaTramites");

    // Interceptamos los servicios del detalle tramite del estudiante , adjuntos y certificado
    // Al interceptar el servicio de detalle del estudiante mockeamos el response con nuestro detalleTramite.json que se encuentra en fixture
    cy.intercept(
      {
        method: "POST",
        url: url.service + "/tramite/id",
      },
      { fixture: "detalleTramite.json" }
    ).as("tramiteDetalle");

    cy.intercept(
      {
        method: "POST",
        url: url.service + "/tramite/adj",
      },
      { fixture: "adjuntos.json" }
    ).as("tramiteAdjunto");

    cy.intercept(
      {
        method: "POST",
        url: url.service + "/tramite/cer",
      },
      { fixture: "certificados.json" }
    ).as("tramiteCertificado");

    // Realizamos click en el primer registro
    cy.get("td > i.ni-bullet-list-67").first().click({ force: true });

    cy.wait(["@tramiteDetalle", "@tramiteAdjunto", "@tramiteCertificado"]);
    // Esperamos 3 seg cargue el modal
    cy.wait(3000);
    // Validamos click en el tab Certificado
    cy.get("span").contains("Certificado").click({ force: true });

    cy.get("td.delete > i.ni-fat-remove").first().click({ force: true });

    // Validamos nombres del titulo , mensaje
    cy.get("#swal2-title")
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equals("¿Estas seguro de eliminar este registro?");
      });

    cy.get("#swal2-html-container")
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equals("Esta acción no puede revertirse");
      });
    // Validamos los nombres de nuestros botones
    cy.get("button.swal2-confirm")
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equals("Confirmar");
      });

    cy.get("button.swal2-cancel")
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equals("Cancelar");
      });
    // Interceptamos y forzamos a devolver un other response
    cy.intercept("DELETE", url.service + "/tramite/cer", {
      forceNetworkError: true,
    }).as("deleteMockTramite");
    // Realizamos click en confirmar eliminacion
    cy.get("button.swal2-confirm").click({ force: true });
    cy.wait("@deleteMockTramite");
    // Verificamos nuestro toast Error
    cy.get("#toast-container")
      .find("div")
      .find("div")
      .contains("Error")
      .invoke("text")
      .then((text) => {
        expect(text.trim()).to.equal("Error");
      });
    // Verificamos el contenido de nuestro toast Error
    cy.get("#toast-container")
      .find("div")
      .find("div")
      .contains("Sucedio")
      .invoke("text")
      .then((text) => {
        expect(text.trim()).to.contains(
          "Sucedio un error al eliminar el certificado"
        );
      });
  });

  it("Validamos Generacion Reporte Excel Gestion Tramites", () => {
    // Interceptamos el servicio que carga la lista de tramites de los alumnos
    cy.intercept({
      method: "GET",
      url: url.service + "/tramite",
    }).as("listaTramites");
    // Realizamos click en la opcion tramites
    cy.get("a").contains("Tramites").click({ force: true });
    // Esperamos que se liste
    cy.wait("@listaTramites");
    let rutaXLS;
    cy.task("filesInDownload", downloadsFolder).then((files1: any) => {
      cy.get("button[id=btnExcel]").click({ force: true });
      cy.wait(5000);
      cy.task("filesInDownload", downloadsFolder).then((files2: any) => {
        // Validamos la descarga del documento y validamos el nombre
        let difference = files2.filter((x: any) => !files1.includes(x));
        expect(difference.length).to.be.gt(0);
        const newFile = files2.filter((y) => !files1.includes(y))[0];
        // Validamos el nombre de nuestro archivo incluya un patron previamente declarado en la funcion downloadFileName
        expect(newFile).to.include(downloadFileName());
        rutaXLS = (downloadsFolder + "/" + newFile).replace(/\\/g, "/");
        // Llamamos nuestro task parseXlsx que leera el archivo descargado
        cy.task("parseXlsx", rutaXLS).then((jsonData) => {
          //Cabeceras del documento
          expect(jsonData[0]["data"][0][0]).to.include("id_est_doc");
          expect(jsonData[0]["data"][0][1]).to.include("fecha_doc");
          expect(jsonData[0]["data"][0][2]).to.include("estado");
          expect(jsonData[0]["data"][0][3]).to.include("nombre");
          expect(jsonData[0]["data"][0][4]).to.include("cod_est");
          expect(jsonData[0]["data"][0][5]).to.include("estudiante");
          expect(jsonData[0]["data"][0][6]).to.include("apellidos");
        });
      });
    });
  });

  it.only("Validamos Generacion Reporte PDF Gestion Tramites", () => {
    // Interceptamos el servicio que carga la lista de tramites de los alumnos
    cy.intercept({
      method: "GET",
      url: url.service + "/tramite",
    }).as("listaTramites");
    // Realizamos click en la opcion tramites
    cy.get("a").contains("Tramites").click({ force: true });
    // Esperamos que se liste
    cy.wait("@listaTramites");
    let rutaPDF;

    cy.task("filesInDownload", downloadsFolder).then((files1: any) => {
      cy.get("button[id=btnPDF]").click({ force: true });
      cy.wait(5000);
      cy.task("filesInDownload", downloadsFolder).then((files2: any) => {
        // Validamos la descarga del documento y validamos el nombre
        let difference = files2.filter((x) => !files1.includes(x));
        expect(difference.length).to.be.gt(0);
        const newFile = files2.filter((y) => !files1.includes(y))[0];
        expect(newFile).to.include(downloadFileName());
        rutaPDF = downloadsFolder.replace(/\\/g, "/");
        console.log("La ruta PDF es : ");
        console.log(rutaPDF);
        cy.task("parsePdf", { patch: rutaPDF, fileName: newFile }).then(
          (jsonData) => {
            console.log("Reporte PDF es : ");
            console.log(jsonData);
            //Titulo del documento
            expect(jsonData["text"]).to.include("REPORTE TRAMITES");
            // CABECERAS
            expect(jsonData["text"]).to.include("N° TRAMITE");
            expect(jsonData["text"]).to.include("ESTADO ACTUAL");
            expect(jsonData["text"]).to.include("CODIGO ESTUDIANTE");
            expect(jsonData["text"]).to.include("NOMBRES");
            expect(jsonData["text"]).to.include("APELLIDOS");
          }
        );
      });
    });
  });

  // Funcion que genera el nombre del archivo de REPORTE TRAMITES
  function downloadFileName() {
    /*  let fecha = new Date();
    let mes = "" + (fecha.getMonth() + 1);
    let dia = "" + fecha.getDate();
    let fechaReporte =
      fecha.getFullYear() +
      "" +
      mes.padStart(2, "0") +
      "" +
      dia.padStart(2, "0");*/
    const fileName = "REPORTE TRAMITES";
    return fileName;
  }
});
