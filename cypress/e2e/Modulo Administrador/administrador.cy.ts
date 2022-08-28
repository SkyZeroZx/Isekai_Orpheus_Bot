/// <reference types="cypress" />

context("Modulo Administrador Pruebas Funcionalidad", () => {
  // Asiganamos valor a nuestra url segun nuestra variable global en cypress.json
  const url = Cypress.env("url");
  const user = Cypress.env("users");
  const response = Cypress.env("response");
  const documento = Cypress.env("documento");
  // Ruta de la carpeta descargas previamente configurado en cypress.json
  const downloadsFolder = Cypress.config("downloadsFolder");
  // Generador de cadena "random" para creacion de usuario y documentos
  const generateRandomString = (num) => {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = Math.random().toString(36).substring(0, num);
    return result;
  };

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
      .type(user.userAdministrador.username, { force: true })
      .should("have.value", user.userAdministrador.username);

    cy.get('input[formControlName="password"]')
      .click({ force: true })
      .type(user.userAdministrador.password, { force: true })
      .should("have.value", user.userAdministrador.password);
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

  it("Dashboard Validacion Interfaz Administrador", () => {
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
        expect(text.trim()).to.equal(user.userAdministrador.username);
      });

    // Validamos en el sidebar nuestras rutas  Dashboard , Documentos, Usuarios
    cy.get("ul.navbar-nav  > li.nav-item.ng-star-inserted").then((element) => {
      expect(element[0].innerText).to.equal("Dashboard");
      expect(element[1].innerText).to.equal("Usuarios");
      expect(element[2].innerText).to.equal("Documentos");
    });
    // Validamos nuestro titulo sea Dashboard
    cy.get("#navbar-main")
      .invoke("text")
      .then((text) => {
        expect(text.trim()).to.contains("Dashboard");
      });
  });

  it("Cambio Contraseña a Demanda Administrador Other Response (MOCK)", () => {
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

  it("Cambio Contraseña a Demanda Administrador NetWork Response (MOCK)", () => {
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

  it("Cambio Contraseña a Demanda Administrador Exito (MOCK)", () => {
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

  it("Cambio Contraseña a Demanda Administrador Volver Atras", () => {
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

  it("Verificamos Interfaz Gestion Usuarios", () => {
    // Interceptamos el servicio que carga la lista de tramites de los alumnos
    cy.intercept({
      method: "GET",
      url: url.service + "/users",
    }).as("listarUsuarios");

    // Realizamos click en la opcion tramites
    cy.get("a").contains("Usuarios").click({ force: true });
    // Esperamos que se liste
    cy.wait("@listarUsuarios");
    //Validamos el titulo de nuestra interfaz
    cy.get("h3")
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("Gestion Usuarios");
      });
    // Validamos la ruta donde nos encontramos
    cy.url().should("include", "/users");

    // Validamos los placeholder de nuestro filtros
    cy.get('input[formControlName="filterNombreUser"]')
      .invoke("attr", "placeholder")
      .should("eq", "Nombres");

    cy.get('input[formControlName="filterPaternoUser"]')
      .invoke("attr", "placeholder")
      .should("eq", "Apellido Paterno");

    cy.get('input[formControlName="filterMaternoUser"]')
      .invoke("attr", "placeholder")
      .should("eq", "Apellido Materno");
    cy.get('input[formControlName="filterCodUser"]')
      .invoke("attr", "placeholder")
      .should("eq", "Codigo Usuario");

    cy.get('input[formControlName="filterEmailUser"]')
      .invoke("attr", "placeholder")
      .should("eq", "Email Usuario");

    cy.get('input[formControlName="filterRolUser"]')
      .invoke("attr", "placeholder")
      .should("eq", "Rol Usuario");

    cy.get("button.btn-outline-success")
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("Excel");
      });

    cy.get("button.btn-outline-danger")
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("PDF");
      });

    // Validamos las opciones del select Estado
    cy.get("select[formControlName=filterEstado]").then((text) => {
      expect(text[0][0].innerText.trim()).equal("Elija Estado...");
      expect(text[0][1].innerText.trim()).equal("CREADO");
      expect(text[0][2].innerText.trim()).equal("HABILITADO");
      expect(text[0][3].innerText.trim()).equal("RESETEADO");
      expect(text[0][4].innerText.trim()).equal("BLOQUEADO");
    });

    cy.get("th[scope=col]").then((element) => {
      // Validamos cabeceras de la tabla
      expect(element[0].innerText.trim().toLocaleUpperCase()).equal("CODIGO");
      expect(element[1].innerText.trim().toLocaleUpperCase()).equal("EMAIL");
      expect(element[2].innerText.trim().toLocaleUpperCase()).equal("NOMBRES");
      expect(element[3].innerText.trim().toLocaleUpperCase()).equal(
        "APELLIDO PATERNO"
      );
      expect(element[4].innerText.trim().toLocaleUpperCase()).equal(
        "APELLIDO MATERNO"
      );
      expect(element[5].innerText.trim().toLocaleUpperCase()).equal("ROL");
      expect(element[6].innerText.trim().toLocaleUpperCase()).equal("ESTADO");
      expect(element[7].innerText.trim().toLocaleUpperCase()).equal(
        "FECHA CREACION"
      );
      expect(element[8].innerText.trim().toLocaleUpperCase()).equal(
        "FECHA MODIFICADO"
      );
      expect(element[9].innerText.trim().toLocaleUpperCase()).equal("RESETEO");
      expect(element[10].innerText.trim().toLocaleUpperCase()).equal("EDITAR");
      expect(element[11].innerText.trim().toLocaleUpperCase()).equal(
        "ELIMINAR"
      );
    });
  });

  it("Verificamos listar usuarios Error Network (MOCK) ", () => {
    // Interceptamos el servicio que carga la lista de tramites de los alumnos
    cy.intercept(
      {
        method: "GET",
        url: url.service + "/users",
      },
      { forceNetworkError: true }
    ).as("listarUsuarios");
    // Realizamos click en la opcion tramites
    cy.get("a").contains("Usuarios").click({ force: true });
    // Esperamos que se liste
    cy.wait("@listarUsuarios");

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
        expect(text.trim()).to.contains("Error al listar usuarios");
      });
  });

  it("Verificamos Busqueda Dinamica Usuarios - Gestion Usuarios", () => {
    // Interceptamos el servicio que carga la lista de tramites de los alumnos
    cy.intercept({
      method: "GET",
      url: url.service + "/users",
    }).as("listarUsuarios");
    // Realizamos click en la opcion usuarios
    cy.get("a").contains("Usuarios").click({ force: true });
    // Esperamos que se liste
    cy.wait("@listarUsuarios");
    // Buscamos un registro existente
    cy.get('input[formControlName="filterNombreUser"]')
      .click({ force: true })
      .type(user.userFiltrado.nombre)
      .should("have.value", user.userFiltrado.nombre);

    // Validamos los valores en la grilla
    cy.get("td").then((element) => {
      expect(element[0].innerText.trim()).to.equal(user.userFiltrado.codigo);
      expect(element[1].innerText.trim()).to.equal(user.userFiltrado.email);
      expect(element[2].innerText.trim()).to.equal(user.userFiltrado.nombre);
      expect(element[3].innerText.trim()).to.equal(user.userFiltrado.paterno);
      expect(element[4].innerText.trim()).to.equal(user.userFiltrado.materno);
      expect(element[5].innerText.trim()).to.equal(user.userFiltrado.rol);
      expect(element[6].innerText.trim()).to.equal(user.userFiltrado.estado);
      expect(element[7].innerText.trim()).contains(
        user.userFiltrado.fechaCreacion
      );
      expect(element[8].innerText.trim()).contains(
        user.userFiltrado.fechaModificacion
      );
    });

    // Borramos la data del input filter nombre user
    cy.get('input[formControlName="filterNombreUser"]')
      .click({ force: true })
      .clear({ force: true })
      .should("have.value", "");

    // Buscamos un registro por apellido paterno del usuario
    cy.get('input[formControlName="filterPaternoUser"]')
      .click({ force: true })
      .type(user.userFiltrado.paterno)
      .should("have.value", user.userFiltrado.paterno);

    // Validamos los valores en la grilla
    cy.get("td").then((element) => {
      expect(element[0].innerText.trim()).to.equal(user.userFiltrado.codigo);
      expect(element[1].innerText.trim()).to.equal(user.userFiltrado.email);
      expect(element[2].innerText.trim()).to.equal(user.userFiltrado.nombre);
      expect(element[3].innerText.trim()).to.equal(user.userFiltrado.paterno);
      expect(element[4].innerText.trim()).to.equal(user.userFiltrado.materno);
      expect(element[5].innerText.trim()).to.equal(user.userFiltrado.rol);
      expect(element[6].innerText.trim()).to.equal(user.userFiltrado.estado);
      expect(element[7].innerText.trim()).contains(
        user.userFiltrado.fechaCreacion
      );
      expect(element[8].innerText.trim()).contains(
        user.userFiltrado.fechaModificacion
      );
    });

    // Limpiamos el valor de filterPaternoUser
    cy.get('input[formControlName="filterPaternoUser"]')
      .click({ force: true })
      .clear({ force: true })
      .should("have.value", "");

    // Buscamos un registro por el apellidoMaterno
    cy.get('input[formControlName="filterMaternoUser"]')
      .click({ force: true })
      .type(user.userFiltrado.materno)
      .should("have.value", user.userFiltrado.materno);

    // Validamos los valores en la grilla
    cy.get("td").then((element) => {
      expect(element[0].innerText.trim()).to.equal(user.userFiltrado.codigo);
      expect(element[1].innerText.trim()).to.equal(user.userFiltrado.email);
      expect(element[2].innerText.trim()).to.equal(user.userFiltrado.nombre);
      expect(element[3].innerText.trim()).to.equal(user.userFiltrado.paterno);
      expect(element[4].innerText.trim()).to.equal(user.userFiltrado.materno);
      expect(element[5].innerText.trim()).to.equal(user.userFiltrado.rol);
      expect(element[6].innerText.trim()).to.equal(user.userFiltrado.estado);
      expect(element[7].innerText.trim()).contains(
        user.userFiltrado.fechaCreacion
      );
      expect(element[8].innerText.trim()).contains(
        user.userFiltrado.fechaModificacion
      );
    });

    // Limpiamos el valor de filterMaternoUser
    cy.get('input[formControlName="filterMaternoUser"]')
      .click({ force: true })
      .clear({ force: true })
      .should("have.value", "");

    // Buscamos un registro  por Codigo del usuario
    cy.get('input[formControlName="filterCodUser"]')
      .click({ force: true })
      .type(user.userFiltrado.codigo)
      .should("have.value", user.userFiltrado.codigo);

    // Validamos los valores en la grilla
    cy.get("td").then((element) => {
      expect(element[0].innerText.trim()).to.equal(user.userFiltrado.codigo);
      expect(element[1].innerText.trim()).to.equal(user.userFiltrado.email);
      expect(element[2].innerText.trim()).to.equal(user.userFiltrado.nombre);
      expect(element[3].innerText.trim()).to.equal(user.userFiltrado.paterno);
      expect(element[4].innerText.trim()).to.equal(user.userFiltrado.materno);
      expect(element[5].innerText.trim()).to.equal(user.userFiltrado.rol);
      expect(element[6].innerText.trim()).to.equal(user.userFiltrado.estado);
      expect(element[7].innerText.trim()).contains(
        user.userFiltrado.fechaCreacion
      );
      expect(element[8].innerText.trim()).contains(
        user.userFiltrado.fechaModificacion
      );
    });

    // Limpiamos el valor de filterCodUser
    cy.get('input[formControlName="filterCodUser"]')
      .click({ force: true })
      .clear({ force: true })
      .should("have.value", "");

    // Buscamos un registro  por EMAIL del usuario
    cy.get('input[formControlName="filterEmailUser"]')
      .click({ force: true })
      .type(user.userFiltrado.email)
      .should("have.value", user.userFiltrado.email);

    // Validamos los valores en la grilla
    cy.get("td").then((element) => {
      expect(element[0].innerText.trim()).to.equal(user.userFiltrado.codigo);
      expect(element[1].innerText.trim()).to.equal(user.userFiltrado.email);
      expect(element[2].innerText.trim()).to.equal(user.userFiltrado.nombre);
      expect(element[3].innerText.trim()).to.equal(user.userFiltrado.paterno);
      expect(element[4].innerText.trim()).to.equal(user.userFiltrado.materno);
      expect(element[5].innerText.trim()).to.equal(user.userFiltrado.rol);
      expect(element[6].innerText.trim()).to.equal(user.userFiltrado.estado);
      expect(element[7].innerText.trim()).contains(
        user.userFiltrado.fechaCreacion
      );
      expect(element[8].innerText.trim()).contains(
        user.userFiltrado.fechaModificacion
      );
    });

    // Limpiamos el valor de filterEmailUser
    cy.get('input[formControlName="filterEmailUser"]')
      .click({ force: true })
      .clear({ force: true })
      .should("have.value", "");
  });

  it("Verificamos Busqueda Dinamica Usuarios - Gestion Usuarios (MOCK)", () => {
    // Interceptamos el servicio que carga la lista de tramites de los alumnos
    cy.intercept(
      {
        method: "GET",
        url: url.service + "/users",
      },
      { fixture: "users.json" }
    ).as("listarUsuarios");
    // Realizamos click en la opcion usuarios
    cy.get("a").contains("Usuarios").click({ force: true });
    // Esperamos que se liste
    cy.wait("@listarUsuarios");
    // Buscamos un registro existente
    cy.get('input[formControlName="filterNombreUser"]')
      .click({ force: true })
      .type(user.userFiltradoMock.nombre)
      .should("have.value", user.userFiltradoMock.nombre);

    // Validamos los valores en la grilla
    cy.get("td").then((element) => {
      expect(element[0].innerText.trim()).to.equal(
        user.userFiltradoMock.codigo
      );
      expect(element[1].innerText.trim()).to.equal(user.userFiltradoMock.email);
      expect(element[2].innerText.trim()).to.equal(
        user.userFiltradoMock.nombre
      );
      expect(element[3].innerText.trim()).to.equal(
        user.userFiltradoMock.paterno
      );
      expect(element[4].innerText.trim()).to.equal(
        user.userFiltradoMock.materno
      );
      expect(element[5].innerText.trim()).to.equal(user.userFiltradoMock.rol);
      expect(element[6].innerText.trim()).to.equal(
        user.userFiltradoMock.estado
      );
      expect(element[7].innerText.trim()).contains(
        user.userFiltradoMock.fechaCreacion
      );
      expect(element[8].innerText.trim()).contains(
        user.userFiltradoMock.fechaModificacion
      );
    });

    // Borramos la data del input filter nombre user
    cy.get('input[formControlName="filterNombreUser"]')
      .click({ force: true })
      .clear({ force: true })
      .should("have.value", "");

    // Buscamos un registro por apellido paterno del usuario
    cy.get('input[formControlName="filterPaternoUser"]')
      .click({ force: true })
      .type(user.userFiltradoMock.paterno)
      .should("have.value", user.userFiltradoMock.paterno);

    // Validamos los valores en la grilla
    cy.get("td").then((element) => {
      expect(element[0].innerText.trim()).to.equal(
        user.userFiltradoMock.codigo
      );
      expect(element[1].innerText.trim()).to.equal(user.userFiltradoMock.email);
      expect(element[2].innerText.trim()).to.equal(
        user.userFiltradoMock.nombre
      );
      expect(element[3].innerText.trim()).to.equal(
        user.userFiltradoMock.paterno
      );
      expect(element[4].innerText.trim()).to.equal(
        user.userFiltradoMock.materno
      );
      expect(element[5].innerText.trim()).to.equal(user.userFiltradoMock.rol);
      expect(element[6].innerText.trim()).to.equal(
        user.userFiltradoMock.estado
      );
      expect(element[7].innerText.trim()).contains(
        user.userFiltradoMock.fechaCreacion
      );
      expect(element[8].innerText.trim()).contains(
        user.userFiltradoMock.fechaModificacion
      );
    });

    // Limpiamos el valor de filterPaternoUser
    cy.get('input[formControlName="filterPaternoUser"]')
      .click({ force: true })
      .clear({ force: true })
      .should("have.value", "");

    // Buscamos un registro por el apellidoMaterno
    cy.get('input[formControlName="filterMaternoUser"]')
      .click({ force: true })
      .type(user.userFiltradoMock.materno)
      .should("have.value", user.userFiltradoMock.materno);

    // Validamos los valores en la grilla
    cy.get("td").then((element) => {
      expect(element[0].innerText.trim()).to.equal(
        user.userFiltradoMock.codigo
      );
      expect(element[1].innerText.trim()).to.equal(user.userFiltradoMock.email);
      expect(element[2].innerText.trim()).to.equal(
        user.userFiltradoMock.nombre
      );
      expect(element[3].innerText.trim()).to.equal(
        user.userFiltradoMock.paterno
      );
      expect(element[4].innerText.trim()).to.equal(
        user.userFiltradoMock.materno
      );
      expect(element[5].innerText.trim()).to.equal(user.userFiltradoMock.rol);
      expect(element[6].innerText.trim()).to.equal(
        user.userFiltradoMock.estado
      );
      expect(element[7].innerText.trim()).contains(
        user.userFiltradoMock.fechaCreacion
      );
      expect(element[8].innerText.trim()).contains(
        user.userFiltradoMock.fechaModificacion
      );
    });

    // Limpiamos el valor de filterMaternoUser
    cy.get('input[formControlName="filterMaternoUser"]')
      .click({ force: true })
      .clear({ force: true })
      .should("have.value", "");

    // Buscamos un registro  por Codigo del usuario
    cy.get('input[formControlName="filterCodUser"]')
      .click({ force: true })
      .type(user.userFiltradoMock.codigo)
      .should("have.value", user.userFiltradoMock.codigo);

    // Validamos los valores en la grilla
    cy.get("td").then((element) => {
      expect(element[0].innerText.trim()).to.equal(
        user.userFiltradoMock.codigo
      );
      expect(element[1].innerText.trim()).to.equal(user.userFiltradoMock.email);
      expect(element[2].innerText.trim()).to.equal(
        user.userFiltradoMock.nombre
      );
      expect(element[3].innerText.trim()).to.equal(
        user.userFiltradoMock.paterno
      );
      expect(element[4].innerText.trim()).to.equal(
        user.userFiltradoMock.materno
      );
      expect(element[5].innerText.trim()).to.equal(user.userFiltradoMock.rol);
      expect(element[6].innerText.trim()).to.equal(
        user.userFiltradoMock.estado
      );
      expect(element[7].innerText.trim()).contains(
        user.userFiltradoMock.fechaCreacion
      );
      expect(element[8].innerText.trim()).contains(
        user.userFiltradoMock.fechaModificacion
      );
    });

    // Buscamos un registro  por ROL del usuario
    cy.get('input[formControlName="filterRolUser"]')
      .click({ force: true })
      .type(user.userFiltradoMock.rol)
      .should("have.value", user.userFiltradoMock.rol);

    // Validamos los valores en la grilla
    cy.get("td").then((element) => {
      expect(element[0].innerText.trim()).to.equal(
        user.userFiltradoMock.codigo
      );
      expect(element[1].innerText.trim()).to.equal(user.userFiltradoMock.email);
      expect(element[2].innerText.trim()).to.equal(
        user.userFiltradoMock.nombre
      );
      expect(element[3].innerText.trim()).to.equal(
        user.userFiltradoMock.paterno
      );
      expect(element[4].innerText.trim()).to.equal(
        user.userFiltradoMock.materno
      );
      expect(element[5].innerText.trim()).to.equal(user.userFiltradoMock.rol);
      expect(element[6].innerText.trim()).to.equal(
        user.userFiltradoMock.estado
      );
      expect(element[7].innerText.trim()).contains(
        user.userFiltradoMock.fechaCreacion
      );
      expect(element[8].innerText.trim()).contains(
        user.userFiltradoMock.fechaModificacion
      );
    });

    // Limpiamos el valor de filteRol
    cy.get('input[formControlName="filterRolUser"]')
      .click({ force: true })
      .clear({ force: true })
      .should("have.value", "");

    // Buscamos un registro  por ESTADO del usuario
    cy.get('select[formControlName="filterEstado"]').select(
      user.userFiltradoMock.estado,
      {
        force: true,
      }
    );

    // Validamos los valores en la grilla
    cy.get("td").then((element) => {
      expect(element[0].innerText.trim()).to.equal(
        user.userFiltradoMock.codigo
      );
      expect(element[1].innerText.trim()).to.equal(user.userFiltradoMock.email);
      expect(element[2].innerText.trim()).to.equal(
        user.userFiltradoMock.nombre
      );
      expect(element[3].innerText.trim()).to.equal(
        user.userFiltradoMock.paterno
      );
      expect(element[4].innerText.trim()).to.equal(
        user.userFiltradoMock.materno
      );
      expect(element[5].innerText.trim()).to.equal(user.userFiltradoMock.rol);
      expect(element[6].innerText.trim()).to.equal(
        user.userFiltradoMock.estado
      );
      expect(element[7].innerText.trim()).contains(
        user.userFiltradoMock.fechaCreacion
      );
      expect(element[8].innerText.trim()).contains(
        user.userFiltradoMock.fechaModificacion
      );
    });
  });

  it("Verificamos Interfaz Modal Editar Usuario ", () => {
    // Interceptamos el servicio que carga la lista de tramites de los alumnos
    cy.intercept(
      {
        method: "GET",
        url: url.service + "/users",
      },
      { fixture: "users.json" }
    ).as("listarUsuarios");
    // Realizamos click en la opcion usuarios
    cy.get("a").contains("Usuarios").click({ force: true });
    // Esperamos que se liste
    cy.wait("@listarUsuarios");
    // Buscamos un registro existente

    // Realizamos click en el primer registro
    cy.get("td > i.ni-bullet-list-67").first().click({ force: true });
    // Validamos campos del modal editar usuario
    cy.get("div.form-group > label").then((element) => {
      // Validamos los valores de los label de nuestros inputs
      expect(element[0].innerText.trim()).equal("UserID");
      expect(element[1].innerText.trim()).equal("Email");
      expect(element[2].innerText.trim()).equal("Fecha Creacion");
      expect(element[3].innerText.trim()).equal("Fecha Modificacion");
      expect(element[4].innerText.trim()).equal("Nombres");
      expect(element[5].innerText.trim()).equal("Apellido Paterno");
      expect(element[6].innerText.trim()).equal("Apellido Materno");
      expect(element[7].innerText.trim()).equal("Estado");
      expect(element[8].innerText.trim()).equal("Rol");
    });

    // Validamos nombre del boton del modal editar usuario
    cy.get("#updateUser")
      .invoke("text")
      .then((text) => {
        expect(text).to.equal("Actualizar");
      });

    cy.fixture("users").then((user) => {
      cy.get("input[formControlName=id]").should("have.value", user[0].id);

      cy.get("input[formControlName=username]").should(
        "have.value",
        user[0].username
      );

      cy.get("input[formControlName=fechaCreacion]").should(
        "have.value",
        user[0].createdAt
      );

      cy.get("input[formControlName=fechaModificacion]").should(
        "have.value",
        user[0].updateAt
      );

      cy.get("input[formControlName=nombre]").should(
        "have.value",
        user[0].nombre
      );

      cy.get("input[formControlName=apellidoPaterno]").should(
        "have.value",
        user[0].apellidoPaterno
      );

      cy.get("input[formControlName=apellidoMaterno]").should(
        "have.value",
        user[0].apellidoMaterno
      );

      cy.get("select[formControlName=estado]").should(
        "have.value",
        user[0].estado
      );

      cy.get("select[formControlName=role]").should("have.value", user[0].role);
    });

    // Validamos mensajes de los ReactiveForms

    cy.get("input[formControlName=nombre]")
      .click({ force: true })
      .clear({ force: true });

    cy.get("input[formControlName=apellidoPaterno]")
      .click({ force: true })
      .clear({ force: true });

    cy.get("input[formControlName=apellidoMaterno]")
      .click({ force: true })
      .clear({ force: true });

    cy.get("input[formControlName=nombre]")
      .click({ force: true })
      .clear({ force: true });

    cy.get("input[formControlName=apellidoMaterno]")
      .click({ force: true })
      .clear({ force: true });
    cy.wait(200);

    cy.get("#requiredNombres")
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equals("Se requiere ingresar nombres");
      });

    cy.get("#requiredPaterno")
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equals("Se requiere ingresar apellido paterno");
      });

    cy.get("#requiredMaterno")
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equals("Se requiere ingresar apellido materno");
      });

    cy.get("input[formControlName=nombre]").click({ force: true }).type("A");
    cy.get("input[formControlName=apellidoPaterno]")
      .click({ force: true })
      .type("A");
    cy.get("input[formControlName=apellidoMaterno]")
      .click({ force: true })
      .type("A");
    cy.get("input[formControlName=nombre]").click({ force: true });

    cy.get("#minlengthNombres")
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equals(
          "La longitud minima del nombre es de 2 caracteres"
        );
      });

    cy.get("#minlengthPaterno")
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equals(
          "La longitud minima del apellido paterno es de 2 caracteres"
        );
      });

    cy.get("#minlengthMaterno")
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equals(
          "La longitud minima del apellido materno es de 2 caracteres"
        );
      });
  });

  it("Verificamos Editar Usuario OK", () => {
    // Interceptamos el servicio que carga la lista de tramites de los alumnos
    cy.intercept({
      method: "GET",
      url: url.service + "/users",
    }).as("listarUsuarios");
    // Realizamos click en la opcion usuarios
    cy.get("a").contains("Usuarios").click({ force: true });
    // Esperamos que se liste
    cy.wait("@listarUsuarios");
    // Buscamos un registro existente
    // Buscamos un registro  por EMAIL del usuario
    cy.get('input[formControlName="filterEmailUser"]')
      .click({ force: true })
      .type(user.userEdit.email)
      .should("have.value", user.userEdit.email);
    // Realizamos click en el primer registro
    cy.get("td > i.ni-bullet-list-67").first().click({ force: true });
    // Esperamos aparezca el modal
    cy.wait(2000);
    // Interceptamos el servicio update
    cy.intercept("PATCH", url.service + "/users").as("editTramite");

    // Realizamos click en el boton actualizar
    cy.get("#updateUser").click({ force: true });
    // Esperamos se ejecute la peticion de actualizacion
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
      .contains("exitosamente")
      .invoke("text")
      .then((text) => {
        expect(text.trim()).to.contains("Se actualizo exitosamente el usuario");
      });
    // Cerramos el modal edit y valodamos cargue nuestra lista de usuarios

    cy.get("#modalEditClose").click({ force: true });

    cy.wait("@listarUsuarios");
  });

  it("Verificamos Editar Usuario Other Response (MOCK)", () => {
    // Interceptamos el servicio que carga la lista de tramites de los alumnos
    cy.intercept({
      method: "GET",
      url: url.service + "/users",
    }).as("listarUsuarios");
    // Realizamos click en la opcion usuarios
    cy.get("a").contains("Usuarios").click({ force: true });
    // Esperamos que se liste
    cy.wait("@listarUsuarios");
    // Buscamos un registro existente
    // Buscamos un registro  por EMAIL del usuario
    cy.get('input[formControlName="filterEmailUser"]')
      .click({ force: true })
      .type(user.userEdit.email)
      .should("have.value", user.userEdit.email);
    // Realizamos click en el primer registro
    cy.get("td > i.ni-bullet-list-67").first().click({ force: true });
    // Esperamos aparezca el modal
    cy.wait(2000);
    // Interceptamos el servicio update
    cy.intercept("PATCH", url.service + "/users", response.other).as(
      "editTramiteMockOther"
    );

    // Realizamos click en el boton actualizar
    cy.get("#updateUser").click({ force: true });
    // Esperamos se ejecute la peticion de actualizacion
    cy.wait("@editTramiteMockOther");
    // Verificamos nuestro toast EXITO
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
        expect(text.trim()).to.contains("Sucedio un error al editar");
      });
  });

  it("Verificamos Editar Usuario NetWork Error (MOCK)", () => {
    // Interceptamos el servicio que carga la lista de tramites de los alumnos
    cy.intercept({
      method: "GET",
      url: url.service + "/users",
    }).as("listarUsuarios");
    // Realizamos click en la opcion usuarios
    cy.get("a").contains("Usuarios").click({ force: true });
    // Esperamos que se liste
    cy.wait("@listarUsuarios");
    // Buscamos un registro existente
    // Buscamos un registro  por EMAIL del usuario
    cy.get('input[formControlName="filterEmailUser"]')
      .click({ force: true })
      .type(user.userEdit.email)
      .should("have.value", user.userEdit.email);
    // Realizamos click en el primer registro
    cy.get("td > i.ni-bullet-list-67").first().click({ force: true });
    // Esperamos aparezca el modal
    cy.wait(2000);
    // Interceptamos el servicio update
    cy.intercept("PATCH", url.service + "/users", {
      forceNetworkError: true,
    }).as("editTramiteMockError");

    // Realizamos click en el boton actualizar
    cy.get("#updateUser").click({ force: true });
    // Esperamos se ejecute la peticion de actualizacion
    cy.wait("@editTramiteMockError");
    // Verificamos nuestro toast EXITO
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
      .contains("editar")
      .invoke("text")
      .then((text) => {
        expect(text.trim()).to.contains("Error al editar usuario");
      });
  });

  it("Verificamos Interfaz Crear Usuario", () => {
    // Interceptamos el servicio que carga la lista de tramites de los alumnos
    cy.intercept({
      method: "GET",
      url: url.service + "/users",
    }).as("listarUsuarios");

    // Realizamos click en la opcion tramites
    cy.get("a").contains("Usuarios").click({ force: true });
    // Esperamos que se liste
    cy.wait("@listarUsuarios");

    // Realizamos click en el boton nuevo para crear un nuevo usuario
    cy.get("button.btn-outline-primary").click({ force: true });
    // Esperamos 2 seg que aparezca el modal
    cy.wait(2000);
    // Validamos campos del modal crear usuario
    cy.get("div.form-group > label").then((element) => {
      // Validamos los valores de los label de nuestros inputs
      expect(element[0].innerText.trim()).equal("Email");
      expect(element[1].innerText.trim()).equal("Estado");
      expect(element[2].innerText.trim()).equal("Rol");
      expect(element[3].innerText.trim()).equal("Nombres");
      expect(element[4].innerText.trim()).equal("Apellido Paterno");
      expect(element[5].innerText.trim()).equal("Apellido Materno");
    });
    // Validamos los placerholder de nuestro inputs
    cy.get("input[formControlName=username]")
      .invoke("attr", "placeholder")
      .should("eq", "Email");

    cy.get("input[name=newEstado]")
      .invoke("attr", "placeholder")
      .should("eq", "CREADO");

    cy.get("input[formControlName=nombre]")
      .invoke("attr", "placeholder")
      .should("eq", "Nombres");

    cy.get("input[formControlName=apellidoPaterno]")
      .invoke("attr", "placeholder")
      .should("eq", "Apellido Paterno");

    cy.get("input[formControlName=apellidoMaterno]")
      .invoke("attr", "placeholder")
      .should("eq", "Apellido Materno");

    // Validamos  que el boton crear usuario este deshabilitado
    cy.get("button.btn-primary")
      .contains("Crear Usuario")
      .should("be.disabled");

    cy.get("input[formControlName=username]").click({ force: true });
    cy.get("input[formControlName=nombre]").click({ force: true });
    cy.get("input[formControlName=apellidoPaterno]").click({ force: true });
    cy.get("input[formControlName=apellidoMaterno]").click({ force: true });
    cy.get("input[formControlName=username]").click({ force: true });
    // Validamos restricciones de nuestro reactiveForm
    cy.get("#requiredNewUsername")
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equals("Se requiere email");
      });
    cy.get("#requiredNewNombres")
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equals("Se requiere ingresar nombres");
      });
    cy.get("#requiredNewPaterno")
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equals("Se requiere ingresar apellido paterno");
      });
    cy.get("#requiredNewMaterno")
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equals("Se requiere ingresar apellido materno");
      });
    // Validamos  que el boton crear usuario este deshabilitado
    cy.get("button.btn-primary")
      .contains("Crear Usuario")
      .should("be.disabled");

    cy.get("input[formControlName=username]").click({ force: true }).type("A");
    cy.get("input[formControlName=nombre]").click({ force: true }).type("A");
    cy.get("input[formControlName=apellidoPaterno]")
      .click({ force: true })
      .type("A");
    cy.get("input[formControlName=apellidoMaterno]")
      .click({ force: true })
      .type("A");
    cy.get("input[formControlName=username]").click({ force: true });

    cy.get("#patternNewUsername")
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equals("El email ingresado tiene formato invalido");
      });

    cy.get("#minlengthNewNombres")
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equals(
          "La longitud minima del nombre es de 2 caracteres"
        );
      });

    cy.get("#minlengthNewPaterno")
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equals(
          "La longitud minima del apellido paterno es de 2 caracteres"
        );
      });

    cy.get("#minlengthNewMaterno")
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equals(
          "La longitud minima del apellido materno es de 2 caracteres"
        );
      });

    // Validamos  que el boton crear usuario este deshabilitado
    cy.get("button.btn-primary")
      .contains("Crear Usuario")
      .should("be.disabled");
  });

  it("Crear Usuario OK", () => {
    // Interceptamos el servicio que carga la lista de tramites de los alumnos
    cy.intercept({
      method: "GET",
      url: url.service + "/users",
    }).as("listarUsuarios");

    // Realizamos click en la opcion tramites
    cy.get("a").contains("Usuarios").click({ force: true });
    // Esperamos que se liste
    cy.wait("@listarUsuarios");

    // Realizamos click en el boton nuevo para crear un nuevo usuario
    cy.get("button.btn-outline-primary").click({ force: true });
    // Esperamos 2 seg que aparezca el modal
    cy.wait(2000);
    // Creamos nuestro correo test "random"
    const randomMail = generateRandomString(10) + "@mail.com";
    // Seteamos los valores a nuestros inputs
    cy.get("input[formControlName=username]")
      .click({ force: true })
      .type(randomMail);
    cy.get("input[formControlName=nombre]")
      .click({ force: true })
      .type("Test Name");
    cy.get("input[formControlName=apellidoPaterno]")
      .click({ force: true })
      .type("Test Paterno");
    cy.get("input[formControlName=apellidoMaterno]")
      .click({ force: true })
      .type("Test Materno");
    // Interceptamos nuestro servicio
    cy.intercept("POST", url.service + "/users").as("createUser");

    // Validamos  que el boton crear usuario este habilitado
    cy.get("button.btn-primary").contains("Crear Usuario").should("be.enabled");
    // Realizamos click
    cy.get("button.btn-primary")
      .contains("Crear Usuario")
      .click({ force: true });
    // Esperamos se ejecute el servicio despues de llamarlo
    cy.wait("@createUser");
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
        expect(text.trim()).to.contains("Se creo exitosamente el usuario");
      });
  });

  it("Crear Usuario OK (MOCK)", () => {
    // Interceptamos el servicio que carga la lista de tramites de los alumnos
    cy.intercept({
      method: "GET",
      url: url.service + "/users",
    }).as("listarUsuarios");

    // Realizamos click en la opcion tramites
    cy.get("a").contains("Usuarios").click({ force: true });
    // Esperamos que se liste
    cy.wait("@listarUsuarios");

    // Realizamos click en el boton nuevo para crear un nuevo usuario
    cy.get("button.btn-outline-primary").click({ force: true });
    // Esperamos 2 seg que aparezca el modal
    cy.wait(2000);
    // Creamos nuestro correo test "random"
    const randomMail = generateRandomString(10) + "@mail.com";
    // Seteamos los valores a nuestros inputs
    cy.get("input[formControlName=username]")
      .click({ force: true })
      .type(randomMail);
    cy.get("input[formControlName=nombre]")
      .click({ force: true })
      .type("Test Name");
    cy.get("input[formControlName=apellidoPaterno]")
      .click({ force: true })
      .type("Test Paterno");
    cy.get("input[formControlName=apellidoMaterno]")
      .click({ force: true })
      .type("Test Materno");
    // Interceptamos nuestro servicio y forzamos a retornar OK
    cy.intercept("POST", url.service + "/users", response.ok).as(
      "createUserMockOK"
    );

    // Validamos  que el boton crear usuario este habilitado
    cy.get("button.btn-primary").contains("Crear Usuario").should("be.enabled");
    // Realizamos click
    cy.get("button.btn-primary")
      .contains("Crear Usuario")
      .click({ force: true });
    // Esperamos se ejecute el servicio despues de llamarlo
    cy.wait("@createUserMockOK");
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
        expect(text.trim()).to.contains("Se creo exitosamente el usuario");
      });
  });

  it("Crear Usuario Other Response (MOCK)", () => {
    // Interceptamos el servicio que carga la lista de tramites de los alumnos
    cy.intercept({
      method: "GET",
      url: url.service + "/users",
    }).as("listarUsuarios");

    // Realizamos click en la opcion tramites
    cy.get("a").contains("Usuarios").click({ force: true });
    // Esperamos que se liste
    cy.wait("@listarUsuarios");

    // Realizamos click en el boton nuevo para crear un nuevo usuario
    cy.get("button.btn-outline-primary").click({ force: true });
    // Esperamos 2 seg que aparezca el modal
    cy.wait(2000);
    // Creamos nuestro correo test "random"
    const randomMail = generateRandomString(10) + "@mail.com";
    // Seteamos los valores a nuestros inputs
    cy.get("input[formControlName=username]")
      .click({ force: true })
      .type(randomMail);
    cy.get("input[formControlName=nombre]")
      .click({ force: true })
      .type("Test Name");
    cy.get("input[formControlName=apellidoPaterno]")
      .click({ force: true })
      .type("Test Paterno");
    cy.get("input[formControlName=apellidoMaterno]")
      .click({ force: true })
      .type("Test Materno");
    // Interceptamos nuestro servicio y forzamos a retornar OK
    cy.intercept("POST", url.service + "/users", response.other).as(
      "createUserMockOther"
    );

    // Validamos  que el boton crear usuario este habilitado
    cy.get("button.btn-primary").contains("Crear Usuario").should("be.enabled");
    // Realizamos click
    cy.get("button.btn-primary")
      .contains("Crear Usuario")
      .click({ force: true });
    // Esperamos se ejecute el servicio despues de llamarlo
    cy.wait("@createUserMockOther");
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
        expect(text.trim()).to.contains("Sucedio un error al crear");
      });
  });

  it("Crear Usuario Network Error (MOCK)", () => {
    // Interceptamos el servicio que carga la lista de tramites de los alumnos
    cy.intercept({
      method: "GET",
      url: url.service + "/users",
    }).as("listarUsuarios");

    // Realizamos click en la opcion tramites
    cy.get("a").contains("Usuarios").click({ force: true });
    // Esperamos que se liste
    cy.wait("@listarUsuarios");

    // Realizamos click en el boton nuevo para crear un nuevo usuario
    cy.get("button.btn-outline-primary").click({ force: true });
    // Esperamos 2 seg que aparezca el modal
    cy.wait(2000);
    // Creamos nuestro correo test "random"
    const randomMail = generateRandomString(10) + "@mail.com";
    // Seteamos los valores a nuestros inputs
    cy.get("input[formControlName=username]")
      .click({ force: true })
      .type(randomMail);
    cy.get("input[formControlName=nombre]")
      .click({ force: true })
      .type("Test Name");
    cy.get("input[formControlName=apellidoPaterno]")
      .click({ force: true })
      .type("Test Paterno");
    cy.get("input[formControlName=apellidoMaterno]")
      .click({ force: true })
      .type("Test Materno");
    // Interceptamos nuestro servicio y forzamos a retornar OK
    cy.intercept("POST", url.service + "/users", {
      forceNetworkError: true,
    }).as("createUserMockErrorNet");

    // Validamos  que el boton crear usuario este habilitado
    cy.get("button.btn-primary").contains("Crear Usuario").should("be.enabled");
    // Realizamos click
    cy.get("button.btn-primary")
      .contains("Crear Usuario")
      .click({ force: true });
    // Esperamos se ejecute el servicio despues de llamarlo
    cy.wait("@createUserMockErrorNet");
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
      .contains("crear")
      .invoke("text")
      .then((text) => {
        expect(text.trim()).to.contains("Hubo un error al crear el usuario");
      });
  });

  it("Verificamos Interfaz Alert Resetear Usuario", () => {
    // Interceptamos el servicio que carga la lista de tramites de los alumnos
    cy.intercept({
      method: "GET",
      url: url.service + "/users",
    }).as("listarUsuarios");

    // Realizamos click en la opcion tramites
    cy.get("a").contains("Usuarios").click({ force: true });
    // Esperamos que se liste
    cy.wait("@listarUsuarios");

    // Buscamos un registro existente
    cy.get('input[formControlName="filterEmailUser"]')
      .click({ force: true })
      .type(user.userReset.username)
      .should("have.value", user.userReset.username);

    cy.get("span.fa-passwd-reset").first().click({ force: true });
    cy.wait(500);

    // Validamos nuestro SweetAlert
    cy.get("h2.swal2-title")
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equals("Reseteo de contraseña de usuario");
      });

    cy.get("div.swal2-html-container")
      .invoke("text")
      .then((text) => {
        expect(text.trim()).contains(
          "Se va resetear la contraseña del usuario"
        );
      });

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

    // Realizamos click en cancelar
    cy.get("button.swal2-cancel").click({ force: true });
    // Validamos que no exista ahora el sweetAlert de resetear usuario
    cy.get("#swal2-title").should("not.exist");
    cy.get("#swal2-html-container").should("not.exist");
    cy.get("button.swal2-confirm").should("not.exist");
    cy.get("button.swal2-cancel").should("not.exist");
  });

  it("Verifificamos Resetear Usuario OK", () => {
    // Interceptamos el servicio que carga la lista de tramites de los alumnos
    cy.intercept({
      method: "GET",
      url: url.service + "/users",
    }).as("listarUsuarios");

    // Realizamos click en la opcion tramites
    cy.get("a").contains("Usuarios").click({ force: true });
    // Esperamos que se liste
    cy.wait("@listarUsuarios");

    // Buscamos un registro existente
    cy.get('input[formControlName="filterEmailUser"]')
      .click({ force: true })
      .type(user.userReset.username)
      .should("have.value", user.userReset.username);

    cy.get("span.fa-passwd-reset").first().click({ force: true });
    // Esperamos medio segundo para que cargue el sweet alert
    cy.wait(500);
    cy.intercept("POST", url.service + "/auth/reset-password").as(
      "ResetUserOK"
    );

    // Realizamos click en confirm
    cy.get("button.swal2-confirm").click({ force: true });
    // Esperamos se realice la peticion
    cy.wait("@ResetUserOK");

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
          "Se reseteo exitosamente la contraseña"
        );
      });
  });

  it("Verifificamos Resetear Usuario OK (MOCK)", () => {
    // Interceptamos el servicio que carga la lista de tramites de los alumnos
    cy.intercept({
      method: "GET",
      url: url.service + "/users",
    }).as("listarUsuarios");

    // Realizamos click en la opcion tramites
    cy.get("a").contains("Usuarios").click({ force: true });
    // Esperamos que se liste
    cy.wait("@listarUsuarios");

    // Buscamos un registro existente
    cy.get('input[formControlName="filterEmailUser"]')
      .click({ force: true })
      .type(user.userReset.username)
      .should("have.value", user.userReset.username);

    cy.get("span.fa-passwd-reset").first().click({ force: true });
    // Esperamos medio segundo para que cargue el sweet alert
    cy.wait(500);
    // Interceptamos y hacemos que nuestro servicio nos devuelva OK mockeandolo
    cy.intercept("POST", url.service + "/auth/reset-password", response.ok).as(
      "ResetUserMockOK"
    );

    // Realizamos click en confirm
    cy.get("button.swal2-confirm").click({ force: true });
    // Esperamos se realice la peticion
    cy.wait("@ResetUserMockOK");

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
          "Se reseteo exitosamente la contraseña"
        );
      });
  });

  it("Verifificamos Resetear Usuario Other Response (MOCK)", () => {
    // Interceptamos el servicio que carga la lista de tramites de los alumnos
    cy.intercept({
      method: "GET",
      url: url.service + "/users",
    }).as("listarUsuarios");

    // Realizamos click en la opcion tramites
    cy.get("a").contains("Usuarios").click({ force: true });
    // Esperamos que se liste
    cy.wait("@listarUsuarios");

    // Buscamos un registro existente
    cy.get('input[formControlName="filterEmailUser"]')
      .click({ force: true })
      .type(user.userReset.username)
      .should("have.value", user.userReset.username);

    cy.get("span.fa-passwd-reset").first().click({ force: true });
    // Esperamos medio segundo para que cargue el sweet alert
    cy.wait(500);
    // Interceptamos y hacemos que nuestro servicio nos devuelva Other Response
    cy.intercept(
      "POST",
      url.service + "/auth/reset-password",
      response.other
    ).as("ResetUserMockOther");

    // Realizamos click en confirm
    cy.get("button.swal2-confirm").click({ force: true });
    // Esperamos se realice la peticion
    cy.wait("@ResetUserMockOther");

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
        expect(text.trim()).to.contains(
          "Sucedio un error al resetear la contraseña"
        );
      });
  });

  it("Verifificamos Resetear Usuario Network Error (MOCK)", () => {
    // Interceptamos el servicio que carga la lista de tramites de los alumnos
    cy.intercept({
      method: "GET",
      url: url.service + "/users",
    }).as("listarUsuarios");

    // Realizamos click en la opcion tramites
    cy.get("a").contains("Usuarios").click({ force: true });
    // Esperamos que se liste
    cy.wait("@listarUsuarios");

    // Buscamos un registro existente
    cy.get('input[formControlName="filterEmailUser"]')
      .click({ force: true })
      .type(user.userReset.username)
      .should("have.value", user.userReset.username);

    cy.get("span.fa-passwd-reset").first().click({ force: true });
    // Esperamos medio segundo para que cargue el sweet alert
    cy.wait(500);
    // Interceptamos y hacemos que nuestro servicio nos devuelva un error de conexion
    cy.intercept("POST", url.service + "/auth/reset-password", {
      forceNetworkError: true,
    }).as("ResetUserMockNetworkError");

    // Realizamos click en confirm
    cy.get("button.swal2-confirm").click({ force: true });
    // Esperamos se realice la peticion
    cy.wait("@ResetUserMockNetworkError");

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
      .contains("resetear")
      .invoke("text")
      .then((text) => {
        expect(text.trim()).to.contains(
          "Sucedio un error al resetear el usuario"
        );
      });
  });

  it("Verificamos Interfaz Alert Eliminar usuario", () => {
    // Interceptamos el servicio que carga la lista de tramites de los alumnos
    cy.intercept({
      method: "GET",
      url: url.service + "/users",
    }).as("listarUsuarios");

    // Realizamos click en la opcion tramites
    cy.get("a").contains("Usuarios").click({ force: true });
    // Esperamos que se liste
    cy.wait("@listarUsuarios");

    // Buscamos un registro existente
    cy.get('input[formControlName="filterEmailUser"]')
      .click({ force: true })
      .type(user.userReset.username)
      .should("have.value", user.userReset.username);
    // Realizamos click en el primer registro
    cy.get("i.ni.ni-fat-remove").first().click({ force: true });
    cy.wait(500);

    // Validamos nuestro SweetAlert
    cy.get("h2.swal2-title")
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equals("Eliminar Usuario");
      });

    cy.get("div.swal2-html-container")
      .invoke("text")
      .then((text) => {
        expect(text.trim()).contains(
          "Se va eliminar al usuario " +
            user.userReset.username +
            " ¿Esta seguro?"
        );
      });

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

    // Realizamos click en cancelar
    cy.get("button.swal2-cancel").click({ force: true });
    // Validamos que no exista ahora el sweetAlert de resetear usuario
    cy.get("#swal2-title").should("not.exist");
    cy.get("#swal2-html-container").should("not.exist");
    cy.get("button.swal2-confirm").should("not.exist");
    cy.get("button.swal2-cancel").should("not.exist");
  });

  it("Verifificamos Eliminar Usuario OK (MOCK)", () => {
    // Interceptamos el servicio que carga la lista de tramites de los alumnos
    cy.intercept({
      method: "GET",
      url: url.service + "/users",
    }).as("listarUsuarios");

    // Realizamos click en la opcion tramites
    cy.get("a").contains("Usuarios").click({ force: true });
    // Esperamos que se liste
    cy.wait("@listarUsuarios");

    // Buscamos un registro existente
    cy.get('input[formControlName="filterEmailUser"]')
      .click({ force: true })
      .type(user.userReset.username)
      .should("have.value", user.userReset.username);
    // Realizamos click en el primer registro
    cy.get("i.ni.ni-fat-remove").first().click({ force: true });
    cy.wait(500);
    cy.intercept("DELETE", url.service + "/users", response.ok).as(
      "deleteUserMockOK"
    );
    // Realizamos click en confirm
    cy.get("button.swal2-confirm").click({ force: true });
    cy.wait("@deleteUserMockOK");
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
        expect(text.trim()).to.contains("Se elimino exitosamente el usuario");
      });
    // Se vuelve a recargar la lista usuarios
    cy.wait("@listarUsuarios");
  });

  it("Verifificamos Eliminar Usuario Other (MOCK)", () => {
    // Interceptamos el servicio que carga la lista de tramites de los alumnos
    cy.intercept({
      method: "GET",
      url: url.service + "/users",
    }).as("listarUsuarios");

    // Realizamos click en la opcion tramites
    cy.get("a").contains("Usuarios").click({ force: true });
    // Esperamos que se liste
    cy.wait("@listarUsuarios");

    // Buscamos un registro existente
    cy.get('input[formControlName="filterEmailUser"]')
      .click({ force: true })
      .type(user.userReset.username)
      .should("have.value", user.userReset.username);
    // Realizamos click en el primer registro
    cy.get("i.ni.ni-fat-remove").first().click({ force: true });
    cy.wait(500);
    cy.intercept("DELETE", url.service + "/users", response.other).as(
      "deleteUserMockOther"
    );
    // Realizamos click en confirm
    cy.get("button.swal2-confirm").click({ force: true });
    cy.wait("@deleteUserMockOther");
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
      .contains("eliminar")
      .invoke("text")
      .then((text) => {
        expect(text.trim()).to.contains(
          "Sucedio un error al eliminar al usuario"
        );
      });
  });

  it("Verifificamos Eliminar Usuario Network Error (MOCK)", () => {
    // Interceptamos el servicio que carga la lista de tramites de los alumnos
    cy.intercept({
      method: "GET",
      url: url.service + "/users",
    }).as("listarUsuarios");

    // Realizamos click en la opcion tramites
    cy.get("a").contains("Usuarios").click({ force: true });
    // Esperamos que se liste
    cy.wait("@listarUsuarios");

    // Buscamos un registro existente
    cy.get('input[formControlName="filterEmailUser"]')
      .click({ force: true })
      .type(user.userReset.username)
      .should("have.value", user.userReset.username);
    // Realizamos click en el primer registro
    cy.get("i.ni.ni-fat-remove").first().click({ force: true });
    cy.wait(500);
    // Interceptamos y forzamos un network error de nuestro servicio
    cy.intercept("DELETE", url.service + "/users", {
      statusCode: 404,
      body: "404 Not Found!",
      headers: {
        auth: "something",
      },
    }).as("deleteUserMockErrorNetWork");
    // Realizamos click en confirm
    cy.get("button.swal2-confirm").click({ force: true });
    cy.wait("@deleteUserMockErrorNetWork");
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
      .contains("eliminar")
      .invoke("text")
      .then((text) => {
        expect(text.trim()).to.contains(
          "Sucedio un error al eliminar el usuario"
        );
      });
  });

  it("Verificamos Interfaz Gestion Documentos", () => {
    // Interceptamos el servicio que carga la lista de DOCUMENTOS
    cy.intercept({
      method: "GET",
      url: url.service + "/documento",
    }).as("listarDocumentos");

    // Realizamos click en la opcion documentos
    cy.get("a").contains("Documentos").click({ force: true });
    // Esperamos que se liste
    cy.wait("@listarDocumentos");
    //Validamos el titulo de nuestra interfaz
    cy.get("h3")
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("Gestion Documentos");
      });
    // Validamos la ruta donde nos encontramos
    cy.url().should("include", "/documentos");

    // Validamos los placeholder de nuestro filtros
    cy.get('input[formControlName="filterCodDoc"]')
      .invoke("attr", "placeholder")
      .should("eq", "Codigo Documento");

    cy.get('input[formControlName="filterNomDoc"]')
      .invoke("attr", "placeholder")
      .should("eq", "Nombre Documento");

    cy.get("button.btn-outline-success")
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("Excel");
      });

    cy.get("button.btn-outline-danger")
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("PDF");
      });

    cy.get("th[scope=col]").then((element) => {
      // Validamos cabeceras de la tabla
      expect(element[0].innerText.trim().toLocaleUpperCase()).equal(
        "COD TRAMITE"
      );
      expect(element[1].innerText.trim().toLocaleUpperCase()).equal("NOMBRE");
      expect(element[2].innerText.trim().toLocaleUpperCase()).equal(
        "REQUISITOS"
      );
      expect(element[3].innerText.trim().toLocaleUpperCase()).equal("EDITAR");
      expect(element[4].innerText.trim().toLocaleUpperCase()).equal("ELIMINAR");
    });
  });

  it("Verificamos Listar Documentos Network Error (MOCK) ", () => {
    // Interceptamos el servicio que carga la lista de DOCUMENTOS
    cy.intercept(
      {
        method: "GET",
        url: url.service + "/documento",
      },
      { forceNetworkError: true }
    ).as("listarDocumentos");

    // Realizamos click en la opcion documentos
    cy.get("a").contains("Documentos").click({ force: true });
    // Esperamos que se liste
    cy.wait("@listarDocumentos");

    // Validamos la ruta donde nos encontramos
    cy.url().should("include", "/documentos");

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
      .contains("listar")
      .invoke("text")
      .then((text) => {
        expect(text.trim()).to.contains("Error al listar documentos");
      });
  });

  it("Validamos busqueda dinamica documentos", () => {
    // Interceptamos el servicio que carga la lista de DOCUMENTOS
    cy.intercept({
      method: "GET",
      url: url.service + "/documento",
    }).as("listarDocumentos");

    // Realizamos click en la opcion documentos
    cy.get("a").contains("Documentos").click({ force: true });
    // Esperamos que se liste
    cy.wait("@listarDocumentos");
    //Validamos el titulo de nuestra interfaz
    cy.get('input[formControlName="filterCodDoc"]')
      .click({ force: true })
      .type(documento.filterDocument.codigo);
    // Validamos los valores en la grilla
    cy.get("td").then((element) => {
      expect(element[0].innerText.trim()).to.equal(
        documento.filterDocument.codigo
      );
      expect(element[1].innerText.trim()).to.equal(
        documento.filterDocument.nombre
      );
      expect(element[2].innerText.trim()).to.equal(
        documento.filterDocument.requisitos
      );
    });
  });

  it("Validamos Interfaz Editar Documento", () => {
    // Interceptamos el servicio que carga la lista de DOCUMENTOS
    cy.intercept({
      method: "GET",
      url: url.service + "/documento",
    }).as("listarDocumentos");

    // Realizamos click en la opcion documentos
    cy.get("a").contains("Documentos").click({ force: true });
    // Esperamos que se liste
    cy.wait("@listarDocumentos");
    //Validamos el titulo de nuestra interfaz
    cy.get('input[formControlName="filterCodDoc"]')
      .click({ force: true })
      .type(documento.filterDocument.codigo);

    //Realizamos click en el primer elemento para editar
    cy.get("td > i.ni.ni-bullet-list-67").first().click({ force: true });
    cy.wait(500);

    // Validamos campos del modal editar usuario
    cy.get("div.form-group > label").then((element) => {
      // Validamos los valores de los label de nuestros inputs
      expect(element[0].innerText.trim()).equal("Codigo Documento");
      expect(element[1].innerText.trim()).equal("Nombre");
      expect(element[2].innerText.trim()).equal("Requisitos URL");
    });

    cy.get("input[formControlName=cod_doc]").should(
      "have.value",
      documento.filterDocument.codigo
    );

    cy.get("input[formControlName=nombre]").should(
      "have.value",
      documento.filterDocument.nombre
    );

    cy.get("input[formControlName=requisitos]").should(
      "have.value",
      documento.filterDocument.requisitos
    );

    // Validamos nombre del boton del modal editar documento
    cy.get("#editDocument")
      .invoke("text")
      .then((text) => {
        expect(text).to.equal("Actualizar");
      });
    // Validamos que el boton editar documento este habilitado
    cy.get("#editDocument").should("be.enabled");

    // Validamos los mensajes de restricciones de los reactiveForm
    cy.get("input[formControlName=nombre]")
      .click({ force: true })
      .clear({ force: true });
    cy.get("input[formControlName=requisitos]")
      .click({ force: true })
      .clear({ force: true });
    cy.get("input[formControlName=nombre]").click({ force: true });
    // Validamos nuestros mensajes
    cy.get("#requiredEditDoc")
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equals("Se requiere nombre para el documento");
      });

    cy.get("#requiredEditRequisitos")
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equals("Se requiere requisitos para el documento");
      });

    // Validamos que el boton editar documento este deshabilitado
    cy.get("#editDocument").should("be.disabled");
    // Validamos restriccion minima de caracteres de nombre documento
    cy.get("input[formControlName=nombre]").click({ force: true }).type("ABC");
    cy.get("#minlengthEditNombres")
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equals(
          "La longitud minima del nombre del documento es de 6 caracteres"
        );
      });

    // Validamos que el boton editar documento este deshabilitado
    cy.get("#editDocument").should("be.disabled");
  });

  it("Validamos Editar Documento OK", () => {
    // Interceptamos el servicio que carga la lista de DOCUMENTOS
    cy.intercept({
      method: "GET",
      url: url.service + "/documento",
    }).as("listarDocumentos");

    // Realizamos click en la opcion documentos
    cy.get("a").contains("Documentos").click({ force: true });
    // Esperamos que se liste
    cy.wait("@listarDocumentos");
    //Validamos el titulo de nuestra interfaz
    cy.get('input[formControlName="filterCodDoc"]')
      .click({ force: true })
      .type(documento.editDocument.codigo);

    //Realizamos click en el primer elemento para editar
    cy.get("td > i.ni.ni-bullet-list-67").first().click({ force: true });
    cy.wait(500);
    cy.intercept("PATCH", url.service + "/documento").as("updateDocument");
    // Realizamos click en el boton editar
    cy.get("#editDocument").click({ force: true });
    cy.wait("@updateDocument");
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
          "Se actualizo exitosamente el documento"
        );
      });
  });

  it("Validamos Editar Documento OK (MOCK)", () => {
    // Interceptamos el servicio que carga la lista de DOCUMENTOS
    cy.intercept({
      method: "GET",
      url: url.service + "/documento",
    }).as("listarDocumentos");

    // Realizamos click en la opcion documentos
    cy.get("a").contains("Documentos").click({ force: true });
    // Esperamos que se liste
    cy.wait("@listarDocumentos");
    //Validamos el titulo de nuestra interfaz
    cy.get('input[formControlName="filterCodDoc"]')
      .click({ force: true })
      .type(documento.editDocument.codigo);

    //Realizamos click en el primer elemento para editar
    cy.get("td > i.ni.ni-bullet-list-67").first().click({ force: true });
    cy.wait(500);
    cy.intercept("PATCH", url.service + "/documento", response.ok).as(
      "updateDocumentMockOK"
    );
    // Realizamos click en el boton editar
    cy.get("#editDocument").click({ force: true });
    cy.wait("@updateDocumentMockOK");
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
          "Se actualizo exitosamente el documento"
        );
      });
  });

  it("Validamos Editar Documento Other Response (MOCK)", () => {
    // Interceptamos el servicio que carga la lista de DOCUMENTOS
    cy.intercept({
      method: "GET",
      url: url.service + "/documento",
    }).as("listarDocumentos");

    // Realizamos click en la opcion documentos
    cy.get("a").contains("Documentos").click({ force: true });
    // Esperamos que se liste
    cy.wait("@listarDocumentos");
    //Validamos el titulo de nuestra interfaz
    cy.get('input[formControlName="filterCodDoc"]')
      .click({ force: true })
      .type(documento.editDocument.codigo);

    //Realizamos click en el primer elemento para editar
    cy.get("td > i.ni.ni-bullet-list-67").first().click({ force: true });
    cy.wait(500);
    cy.intercept("PATCH", url.service + "/documento", response.other).as(
      "updateDocumentMockOK"
    );
    // Realizamos click en el boton editar
    cy.get("#editDocument").click({ force: true });
    cy.wait("@updateDocumentMockOK");
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
        expect(text.trim()).to.contains("Sucedio un error al editar");
      });
  });

  it("Validamos Editar Documento Network Error (MOCK)", () => {
    // Interceptamos el servicio que carga la lista de DOCUMENTOS
    cy.intercept({
      method: "GET",
      url: url.service + "/documento",
    }).as("listarDocumentos");

    // Realizamos click en la opcion documentos
    cy.get("a").contains("Documentos").click({ force: true });
    // Esperamos que se liste
    cy.wait("@listarDocumentos");
    //Validamos el titulo de nuestra interfaz
    cy.get('input[formControlName="filterCodDoc"]')
      .click({ force: true })
      .type(documento.editDocument.codigo);

    //Realizamos click en el primer elemento para editar
    cy.get("td > i.ni.ni-bullet-list-67").first().click({ force: true });
    cy.wait(500);
    cy.intercept("PATCH", url.service + "/documento", {
      forceNetworkError: true,
    }).as("updateDocumentNetworkErrorMock");
    // Realizamos click en el boton editar
    cy.get("#editDocument").click({ force: true });
    cy.wait("@updateDocumentNetworkErrorMock");
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
      .contains("actualizar")
      .invoke("text")
      .then((text) => {
        expect(text.trim()).to.contains(
          "Hubo un error al actualizar documento"
        );
      });
  });

  it("Validamos Interfaz Crear Documento", () => {
    // Interceptamos el servicio que carga la lista de DOCUMENTOS
    cy.intercept({
      method: "GET",
      url: url.service + "/documento",
    }).as("listarDocumentos");

    // Realizamos click en la opcion documentos
    cy.get("a").contains("Documentos").click({ force: true });
    // Esperamos que se liste
    cy.wait("@listarDocumentos");
    //Validamos el titulo de nuestra interfaz
    cy.get('input[formControlName="filterCodDoc"]')
      .click({ force: true })
      .type(documento.filterDocument.codigo);

    //Realizamos click para abrir el modal crear documento
    cy.get("button").contains("Nuevo").click({ force: true });
    cy.wait(1000);
    // Validamos campos del modal crear documento
    cy.get("div.form-group > label").then((element) => {
      // Validamos los valores de los label de nuestros inputs
      expect(element[0].innerText.trim()).equal("Nombre");
      expect(element[1].innerText.trim()).equal("Requisitos URL");
    });
    // Validamos los inputs
    cy.get("input[formControlName=nombre]").should("have.value", "");

    cy.get("input[formControlName=requisitos]").should("have.value", "");

    cy.get("#createDocument")
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equals("Crear Documento");
      });
    // Validamos que el boton crear documento este deshabilitado
    cy.get("#createDocument").should("be.disabled");

    // Validamos nuestras validaciones de ReactiveForms

    cy.get("input[formControlName=nombre]").click({ force: true });
    cy.get("input[formControlName=requisitos]").click({ force: true });
    cy.get("input[formControlName=nombre]").click({ force: true });
    // Validamos el texto de nuestras validaciones
    cy.get("#requiredNewDoc")
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equals("Se requiere nombre para el documento");
      });
    cy.get("#requiredNewRequisitosDoc")
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equals("Se requiere requisitos para el documento");
      });
    cy.get("#createDocument").should("be.disabled");
    // Validamos longitud minima del nombre
    cy.get("input[formControlName=nombre]").click({ force: true }).type("ABC");
    // Validamos mensaje del reactive form
    cy.get("#minlengthNewNombresDoc")
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equals(
          "La longitud minima del nombre del documento es de 6 caracteres"
        );
      });

    // Validamos que el boton crear documento este deshabilitado
    cy.get("#createDocument").should("be.disabled");
  });

  it("Validamos Crear Documento OK", () => {
    // Interceptamos el servicio que carga la lista de DOCUMENTOS
    cy.intercept({
      method: "GET",
      url: url.service + "/documento",
    }).as("listarDocumentos");

    // Realizamos click en la opcion documentos
    cy.get("a").contains("Documentos").click({ force: true });
    // Esperamos que se liste
    cy.wait("@listarDocumentos");
    //Validamos el titulo de nuestra interfaz
    cy.get('input[formControlName="filterCodDoc"]')
      .click({ force: true })
      .type(documento.filterDocument.codigo);

    //Realizamos click para abrir el modal crear documento
    cy.get("button").contains("Nuevo").click({ force: true });

    cy.wait(1000);

    // Escribimos data random en el input
    cy.get("input[formControlName=nombre]").type(generateRandomString(15));
    cy.get("input[formControlName=requisitos]").type(generateRandomString(15));

    // Validamos que el boton crear documento este habilitado
    cy.get("#createDocument").should("be.enabled");

    cy.intercept("POST", url.service + "/documento").as("createNewDocumento");

    // Realizamos click para registrarlo
    cy.get("#createDocument").click({ force: true });

    // Esperamos se ejecute nuestra peticion
    cy.wait("@createNewDocumento");

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
        expect(text.trim()).to.contains("Se creo exitosamente el documento");
      });
  });

  it("Validamos Crear Documento OK (MOCK)", () => {
    // Interceptamos el servicio que carga la lista de DOCUMENTOS
    cy.intercept({
      method: "GET",
      url: url.service + "/documento",
    }).as("listarDocumentos");

    // Realizamos click en la opcion documentos
    cy.get("a").contains("Documentos").click({ force: true });
    // Esperamos que se liste
    cy.wait("@listarDocumentos");
    //Validamos el titulo de nuestra interfaz
    cy.get('input[formControlName="filterCodDoc"]')
      .click({ force: true })
      .type(documento.filterDocument.codigo);

    //Realizamos click para abrir el modal crear documento
    cy.get("button").contains("Nuevo").click({ force: true });

    cy.wait(1000);

    // Escribimos data random en el input
    cy.get("input[formControlName=nombre]").type(generateRandomString(15));
    cy.get("input[formControlName=requisitos]").type(generateRandomString(15));

    // Validamos que el boton crear documento este habilitado
    cy.get("#createDocument").should("be.enabled");

    cy.intercept("POST", url.service + "/documento", response.ok).as(
      "createNewDocumentoMockOK"
    );

    // Realizamos click para registrarlo
    cy.get("#createDocument").click({ force: true });

    // Esperamos se ejecute nuestra peticion
    cy.wait("@createNewDocumentoMockOK");

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
        expect(text.trim()).to.contains("Se creo exitosamente el documento");
      });
  });

  it("Validamos Crear Documento Other Response (MOCK)", () => {
    // Interceptamos el servicio que carga la lista de DOCUMENTOS
    cy.intercept({
      method: "GET",
      url: url.service + "/documento",
    }).as("listarDocumentos");

    // Realizamos click en la opcion documentos
    cy.get("a").contains("Documentos").click({ force: true });
    // Esperamos que se liste
    cy.wait("@listarDocumentos");
    //Validamos el titulo de nuestra interfaz
    cy.get('input[formControlName="filterCodDoc"]')
      .click({ force: true })
      .type(documento.filterDocument.codigo);

    //Realizamos click para abrir el modal crear documento
    cy.get("button").contains("Nuevo").click({ force: true });

    cy.wait(1000);

    // Escribimos data random en el input
    cy.get("input[formControlName=nombre]").type(generateRandomString(15));
    cy.get("input[formControlName=requisitos]").type(generateRandomString(15));

    // Validamos que el boton crear documento este habilitado
    cy.get("#createDocument").should("be.enabled");

    cy.intercept("POST", url.service + "/documento", response.other).as(
      "createNewDocumentoMockOther"
    );

    // Realizamos click para registrarlo
    cy.get("#createDocument").click({ force: true });

    // Esperamos se ejecute nuestra peticion
    cy.wait("@createNewDocumentoMockOther");

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
        expect(text.trim()).to.contains(
          "Sucedio un error al crear el documento"
        );
      });
  });

  it("Validamos Crear Documento Network Error (MOCK)", () => {
    // Interceptamos el servicio que carga la lista de DOCUMENTOS
    cy.intercept({
      method: "GET",
      url: url.service + "/documento",
    }).as("listarDocumentos");

    // Realizamos click en la opcion documentos
    cy.get("a").contains("Documentos").click({ force: true });
    // Esperamos que se liste
    cy.wait("@listarDocumentos");
    //Validamos el titulo de nuestra interfaz
    cy.get('input[formControlName="filterCodDoc"]')
      .click({ force: true })
      .type(documento.filterDocument.codigo);

    //Realizamos click para abrir el modal crear documento
    cy.get("button").contains("Nuevo").click({ force: true });

    cy.wait(1000);

    // Escribimos data random en el input
    cy.get("input[formControlName=nombre]").type(generateRandomString(15));
    cy.get("input[formControlName=requisitos]").type(generateRandomString(15));

    // Validamos que el boton crear documento este habilitado
    cy.get("#createDocument").should("be.enabled");

    cy.intercept("POST", url.service + "/documento", {
      forceNetworkError: true,
    }).as("createNewDocumentoMockNetWorkError");

    // Realizamos click para registrarlo
    cy.get("#createDocument").click({ force: true });

    // Esperamos se ejecute nuestra peticion
    cy.wait("@createNewDocumentoMockNetWorkError");

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
          "Sucedio un error al crear el documento"
        );
      });
  });

  it("Validamos Interfaz Alert Eliminar Documento", () => {
    // Interceptamos el servicio que carga la lista de DOCUMENTOS
    cy.intercept({
      method: "GET",
      url: url.service + "/documento",
    }).as("listarDocumentos");

    // Realizamos click en la opcion documentos
    cy.get("a").contains("Documentos").click({ force: true });
    // Esperamos que se liste
    cy.wait("@listarDocumentos");

    // Realizamos click en la opcion eliminar del primer registro
    cy.get("i.ni.ni-fat-remove").first().click({ force: true });

    // Validamos nombres del titulo , mensaje
    cy.get("#swal2-title")
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equals("Eliminar Documento");
      });

    cy.get("#swal2-html-container")
      .invoke("text")
      .then((text) => {
        expect(text.trim()).contains("Se va eliminar el documento");
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

  it("Validamos Eliminar Documento OK (MOCK)", () => {
    // Interceptamos el servicio que carga la lista de DOCUMENTOS
    cy.intercept({
      method: "GET",
      url: url.service + "/documento",
    }).as("listarDocumentos");

    // Realizamos click en la opcion documentos
    cy.get("a").contains("Documentos").click({ force: true });
    // Esperamos que se liste
    cy.wait("@listarDocumentos");
    //Validamos el titulo de nuestra interfaz
    cy.get('input[formControlName="filterCodDoc"]')
      .click({ force: true })
      .type(documento.filterDocument.codigo);
    // Realizamos click en la opcion eliminar del primer registro
    cy.get("i.ni.ni-fat-remove").first().click({ force: true });
    // Interceptamos el servicio
    cy.intercept("DELETE", url.service + "/documento", response.ok).as(
      "deleteDocumentMockOK"
    );
    // Realizamos click en confirmar
    cy.get("button.swal2-confirm").click({ force: true });
    // Esperamos se realice la peticion
    cy.wait("@deleteDocumentMockOK");

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
        expect(text.trim()).to.contains("Se elimino exitosamente el documento");
      });
  });

  it("Validamos Eliminar Documento Other Response (MOCK)", () => {
    // Interceptamos el servicio que carga la lista de DOCUMENTOS
    cy.intercept({
      method: "GET",
      url: url.service + "/documento",
    }).as("listarDocumentos");

    // Realizamos click en la opcion documentos
    cy.get("a").contains("Documentos").click({ force: true });
    // Esperamos que se liste
    cy.wait("@listarDocumentos");
    //Validamos el titulo de nuestra interfaz
    cy.get('input[formControlName="filterCodDoc"]')
      .click({ force: true })
      .type(documento.filterDocument.codigo);
    // Realizamos click en la opcion eliminar del primer registro
    cy.get("i.ni.ni-fat-remove").first().click({ force: true });
    // Interceptamos el servicio
    cy.intercept("DELETE", url.service + "/documento", response.other).as(
      "deleteDocumentMockOther"
    );
    // Realizamos click en confirmar
    cy.get("button.swal2-confirm").click({ force: true });
    // Esperamos se realice la peticion
    cy.wait("@deleteDocumentMockOther");

    // Verificamos nuestro toast ERROR
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
        expect(text.trim()).to.contains(
          "Sucedio un error al eliminar el documento"
        );
      });
  });

  it("Validamos Eliminar Documento Network Error (MOCK)", () => {
    // Interceptamos el servicio que carga la lista de DOCUMENTOS
    cy.intercept({
      method: "GET",
      url: url.service + "/documento",
    }).as("listarDocumentos");

    // Realizamos click en la opcion documentos
    cy.get("a").contains("Documentos").click({ force: true });
    // Esperamos que se liste
    cy.wait("@listarDocumentos");
    //Validamos el titulo de nuestra interfaz
    cy.get('input[formControlName="filterCodDoc"]')
      .click({ force: true })
      .type(documento.filterDocument.codigo);
    // Realizamos click en la opcion eliminar del primer registro
    cy.get("i.ni.ni-fat-remove").first().click({ force: true });
    // Interceptamos el servicio
    cy.intercept("DELETE", url.service + "/documento", {
      statusCode: 404,
      body: "404 Not Found!",
      headers: {
        auth: "something",
      },
    }).as("deleteDocumentMockNetworkErr");
    // Realizamos click en confirmar
    cy.get("button.swal2-confirm").click({ force: true });
    // Esperamos se realice la peticion
    cy.wait("@deleteDocumentMockNetworkErr");

    // Verificamos nuestro toast ERROR
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
      .contains("documento")
      .invoke("text")
      .then((text) => {
        expect(text.trim()).to.contains(
          "Sucedio un error al eliminar el documento"
        );
      });
  });

  it("Verificamos Generar Reporte Excel Gestion Usuarios", () => {
    // Interceptamos el servicio que carga la lista de tramites de los alumnos
    cy.intercept({
      method: "GET",
      url: url.service + "/users",
    }).as("listarUsuarios");

    // Realizamos click en la opcion tramites
    cy.get("a").contains("Usuarios").click({ force: true });
    // Esperamos que se liste
    cy.wait("@listarUsuarios");
    let rutaXLS;
    cy.task("filesInDownload", downloadsFolder).then((files1: any) => {
      // Realizamos click en el boton excel para generar el reporte
      cy.get("button[id=excelUsers]").click({ force: true });
      // Esperamos se genere el reporte
      cy.wait(5000);
      // Validamos con nuestro task los datos
      cy.task("filesInDownload", downloadsFolder).then((files2: any) => {
        // Validamos la descarga del documento y validamos el nombre
        let difference = files2.filter((x: any) => !files1.includes(x));
        expect(difference.length).to.be.gt(0);
        const newFile = files2.filter((y) => !files1.includes(y))[0];
        // Validamos el nombre de nuestro archivo incluya un patron previamente declarado en la funcion downloadFileName
        expect(newFile).to.include(downloadFileNameUser());
        rutaXLS = (downloadsFolder + "/" + newFile).replace(/\\/g, "/");
        // Llamamos nuestro task parseXlsx que leera el archivo descargado
        cy.task("parseXlsx", rutaXLS).then((jsonData) => {
          //Cabeceras del documento
          expect(jsonData[0]["data"][0][0]).to.include("id");
          expect(jsonData[0]["data"][0][1]).to.include("username");
          expect(jsonData[0]["data"][0][2]).to.include("role");
          expect(jsonData[0]["data"][0][3]).to.include("createdAt");
          expect(jsonData[0]["data"][0][4]).to.include("updateAt");
          expect(jsonData[0]["data"][0][5]).to.include("nombre");
          expect(jsonData[0]["data"][0][6]).to.include("apellidoPaterno");
          expect(jsonData[0]["data"][0][7]).to.include("apellidoMaterno");
          expect(jsonData[0]["data"][0][8]).to.include("estado");
          expect(jsonData[0]["data"][0][9]).to.include("firstLogin");
        });
      });
    });
  });

  it("Verificamos Generar Reporte PDF Gestion Usuarios", () => {
    // Interceptamos el servicio que carga la lista de tramites de los alumnos
    cy.intercept({
      method: "GET",
      url: url.service + "/users",
    }).as("listarUsuarios");

    // Realizamos click en la opcion tramites
    cy.get("a").contains("Usuarios").click({ force: true });
    // Esperamos que se liste
    cy.wait("@listarUsuarios");
    let rutaPDF;

    cy.task("filesInDownload", downloadsFolder).then((files1: any) => {
      cy.get("button[id=pdfUsers]").click({ force: true });
      cy.wait(5000);
      cy.task("filesInDownload", downloadsFolder).then((files2: any) => {
        // Validamos la descarga del documento y validamos el nombre
        // let difference = files2.filter((x) => !files1.includes(x));
        // expect(difference.length).to.be.gt(0);
        const newFile = files2.filter((y) => !files1.includes(y))[0];
        expect(newFile).to.include(downloadFileNameUser());
        rutaPDF = downloadsFolder.replace(/\\/g, "/");

        cy.task("parsePdf", { patch: rutaPDF, fileName: newFile }).then(
          (jsonData) => {
            console.log("Reporte PDF es : ");
            console.log(jsonData);
            //Titulo del documento
            expect(jsonData["text"]).to.include("REPORTE USUARIOS");
            // CABECERAS
            expect(jsonData["text"]).to.include("CODIGO");
            expect(jsonData["text"]).to.include("EMAIL");
            expect(jsonData["text"]).to.include("ROL");
            expect(jsonData["text"]).to.include("CREACION");
            expect(jsonData["text"]).to.include("MODIFICACION");
            expect(jsonData["text"]).to.include("NOMBRES");
            expect(jsonData["text"]).to.include("APELLIDO PATERNO");
            expect(jsonData["text"]).to.include("APELLIDO MATERNO");
            expect(jsonData["text"]).to.include("ESTADO");
          }
        );
      });
    });
  });

  it("Verificamos Generar Reporte Excel Gestion Documentos", () => {
    // Interceptamos el servicio que carga la lista de DOCUMENTOS
    cy.intercept({
      method: "GET",
      url: url.service + "/documento",
    }).as("listarDocumentos");

    // Realizamos click en la opcion documentos
    cy.get("a").contains("Documentos").click({ force: true });
    // Esperamos que se liste
    cy.wait("@listarDocumentos");
    let rutaXLS;
    cy.task("filesInDownload", downloadsFolder).then((files1: any) => {
      // Realizamos click en el boton excel para generar el reporte
      cy.get("button[id=excelDocument]").click({ force: true });
      // Esperamos se genere el reporte
      cy.wait(5000);
      // Validamos con nuestro task los datos
      cy.task("filesInDownload", downloadsFolder).then((files2: any) => {
        // Validamos la descarga del documento y validamos el nombre
        let difference = files2.filter((x: any) => !files1.includes(x));
        expect(difference.length).to.be.gt(0);
        const newFile = files2.filter((y) => !files1.includes(y))[0];
        // Validamos el nombre de nuestro archivo incluya un patron previamente declarado en la funcion downloadFileName
        expect(newFile).to.include(downloadFileNameDocument());
        rutaXLS = (downloadsFolder + "/" + newFile).replace(/\\/g, "/");
        // Llamamos nuestro task parseXlsx que leera el archivo descargado
        cy.task("parseXlsx", rutaXLS).then((jsonData) => {
          //Cabeceras del documento
          expect(jsonData[0]["data"][0][0]).to.include("cod_doc");
          expect(jsonData[0]["data"][0][1]).to.include("nombre");
          expect(jsonData[0]["data"][0][2]).to.include("requisitos");
        });
      });
    });
  });

  it("Verificamos Generar Reporte PDF Gestion Documentos", () => {
    // Interceptamos el servicio que carga la lista de DOCUMENTOS
    cy.intercept({
      method: "GET",
      url: url.service + "/documento",
    }).as("listarDocumentos");

    // Realizamos click en la opcion documentos
    cy.get("a").contains("Documentos").click({ force: true });
    // Esperamos que se liste
    cy.wait("@listarDocumentos");
    let rutaPDF;

    cy.task("filesInDownload", downloadsFolder).then((files1: any) => {
      cy.get("button[id=pdfDocument]").click({ force: true });
      cy.wait(5000);
      cy.task("filesInDownload", downloadsFolder).then((files2: any) => {
        // Validamos la descarga del documento y validamos el nombre
        // let difference = files2.filter((x) => !files1.includes(x));
       //  expect(difference.length).to.be.gt(0);
        const newFile = files2.filter((y) => !files1.includes(y))[0];
        expect(newFile).to.include(downloadFileNameDocument());
        rutaPDF = downloadsFolder.replace(/\\/g, "/");

        cy.task("parsePdf", { patch: rutaPDF, fileName: newFile }).then(
          (jsonData) => {
            //Titulo del documento
            expect(jsonData["text"]).to.include("REPORTE DOCUMENTOS");
            // CABECERAS
            expect(jsonData["text"]).to.include("CODIGO");
            expect(jsonData["text"]).to.include("NOMBRE");
            expect(jsonData["text"]).to.include("REQUISITOS");
          }
        );
      });
    });
  });

  // Funcion que genera el nombre del archivo de reportevalidaciones
  function downloadFileNameUser() {
    /*  let fecha = new Date();
    let mes = "" + (fecha.getMonth() + 1);
    let dia = "" + fecha.getDate();
    let fechaReporte =
      fecha.getFullYear() +
      "" +
      mes.padStart(2, "0") +
      "" +
      dia.padStart(2, "0");*/
    const fileName = "REPORTE USUARIOS";
    return fileName;
  }

  function downloadFileNameDocument() {
    /*  let fecha = new Date();
    let mes = "" + (fecha.getMonth() + 1);
    let dia = "" + fecha.getDate();
    let fechaReporte =
      fecha.getFullYear() +
      "" +
      mes.padStart(2, "0") +
      "" +
      dia.padStart(2, "0");*/
    const fileName = "REPORTE DOCUMENTOS";
    return fileName;
  }
});
