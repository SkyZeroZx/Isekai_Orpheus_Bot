import { defineConfig } from 'cypress'

export default defineConfig({
  downloadsFolder:
    'C:/Users/User/Desktop/Isekai_Orpheus_Bot/Isekai_Orpheus_Bot/cypress/downloads',
  env: {
    response: {
      ok: {
        message: 'OK',
      },
      other: {
        message: 'Other Response',
      },
    },
    url: {
      service: 'https://whatsapp-bot-isekai.herokuapp.com',
      visit: 'http://localhost:4200/#/login',
      tracking: 'http://localhost:4200/#/tracking',
    },
    tracking: {
      numeroTramite: '13161522543671642522',
      dni: '71642522',
      tipoTramite: 'EGRESADO',
      codigoEstudiante: '1615225436',
      apellidos: 'BURGOS TEJADA',
      nombres: 'JAIME',
      estado: 'FINALIZADO',
      fecha: '2022-05-24',
    },
    users: {
      userTramitador: {
        username: 'tramitadorDemo@gmail.com',
        password: 'Admin2',
      },
      userAdministrador: {
        username: 'adminDemo@gmail.com',
        password: 'Admin2',
      },
      userFirstLogin: {
        username: 'newLogin@gmail.com',
        password: 'Admin1',
      },
      userReset: {
        username: 'skyzerobot64@gmail.com',
      },
      userBloqueado: {
        username: 'bloqueado@gmail.com',
        password: 'Admin1',
      },
      userEdit: {
        email: 'test@mail.com',
      },
      userFiltradoMock: {
        email: 'tramitador2@mail.com',
        paterno: 'paterno tramitador',
        materno: 'materno tramitador',
        nombre: 'nombre tramitador',
        codigo: '114',
        rol: 'tramitador',
        estado: 'HABILITADO',
        fechaCreacion: '2022-05-14',
        fechaModificacion: '2022-05-18',
      },
      userFiltrado: {
        email: 'tramitador2@mail.com',
        paterno: 'paterno tramitador',
        materno: 'materno tramitador',
        nombre: 'nombre tramitador',
        codigo: '114',
        rol: 'tramitador',
        estado: 'HABILITADO',
        fechaCreacion: '2022-05-14',
        fechaModificacion: '2022-06-01',
      },
    },
    tramiteFiltrado: {
      usuario: 'jburgos',
      nombre: 'jburgos',
      apellido: 'jburgos',
      estado: 'REGISTRADO',
    },
    documento: {
      filterDocument: {
        codigo: '524',
        nombre: '0f4stg7qbyc',
        requisitos: '0.ujx6jgvksqd',
      },
      editDocument: {
        codigo: '14',
        nombre: 'TITULACION',
        requisitos: '',
      },
    },
  },
  defaultCommandTimeout: 10000,
  pageLoadTimeout: 10000,
  projectId: '',
  numTestsKeptInMemory: 50,
  requestTimeout: 10000,
  responseTimeout: 10000,
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      return require('./cypress/plugins/index.ts').default(on, config)
    },
  },
})
