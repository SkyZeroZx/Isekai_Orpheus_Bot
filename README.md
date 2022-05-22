# Isekai Orpheus Bot

_Es el modulo web del sistema de gestion de tramites registrados via ChatBot y seguimiento de tramites_

## Comenzando 🚀

_Estas instrucciones te permitirán obtener una copia del proyecto en funcionamiento en tu máquina local para propósitos de desarrollo y pruebas._

Mira **Deployment** para conocer como desplegar el proyecto.


### Pre-requisitos 📋

_Software requerido_

```
NodeJS >= 14.X
NPM >= 8.X
AngularCli >= 13.X
```
 
### Instalación 🔧

_Para ejecutar un entorno de desarrollo_

_Previamente ejecutar el comando en la terminal para descargar "node_modules" para el funcionamiento del proyecto_

```
npm install
```
_Previamente configurar la ruta del API que consumira nuestro proyecto en el archivo src/environments/environment.ts campo API_URL_

_Para ejecutar un servidor de pruebas local usar el comando donde "PUERTO" sera el puerto donde deseamos ejecutar el proyecto , por default ng serve ejecuta el puerto 4200_

```
ng serve --port [PUERTO]
```

_Dirigirse a la ruta http://localhost:4200/#/login/ se tendra la pantalla de Login del sistema existiendo 2 roles_

_**Login** :  Apartado de inicio de sesion para ambos tipos de roles_

![Login](/docs/login.PNG)

_**Change Password** : Apartado para el cambio de contraseña_

![Change Password](/docs/change_password.PNG)

_**DashBoard** : Apartado con graficos sobre las cantidad de estados con filtros de fechas_

![DashBoard 1](/docs/dashboard_1.PNG)

![DashBoard 2](/docs/dashboard_2.PNG)

![DashBoard 3](/docs/dashboard_3.PNG)

_**Rol Administrador** : Rol que gestiona Usuarios y Documentos , comparte el dashboard con el rol tramitador_ 

_*Usuarios*_

![Admin Users](/docs/admin_users.PNG)

_*Documentos*_

![Admin Docs](/docs/admin_docs.PNG)

_**Rol Tramitador** : Rol que gestiona los tramites de los estudiantes , comparte el dashboard con el rol administrador_

_*Tramites*_

![Tramitador Tramites](/docs/tramitador_1.PNG)

![Tramitador Tramites](/docs/tramitador_2.PNG)

![Tramitador Tramites](/docs/tramitador_3.PNG)


_**Tracking** : Apartado para el seguimiento del tramite por parte de los estudiantes_

![Tracking](/docs/tracking.PNG)


## Ejecutando las pruebas ⚙️

_Se crearon 2 tipos de pruebas siendo las primeras las pruebas unitarias en Jasmine y Karma que son integradas por Angular_

_Las segundo tipo de pruebas son las Automatizadas E2E en Cypress para la verificacion funcional del sistema _

### Y las pruebas de estilo de codificación ⌨️

_Las pruebas unitarias en Jasmine y Karma verificacion la funcionalidad adecuada y logica del codigo asi como la cobertura del codigo_

_Para ejecutar las pruebas unitarias ejecutar el siguiente comando en la terminal de la raiz del proyecto, el cual levanta el servidor local del test runner Karma_

```
ng test
```

_Para obtener la cobertura del codigo de esta pruebas ejecutar el siguiente comando para obtener un reporte detallado de las pruebas_

_La carpeta con la cobertura del codigo se creara en la raiz del proyecto con la siguiente ruta coverage/Isekai_Bot/index.html el cual se puede visualizar_

...
ng test --code-coverage
...



### Analice las pruebas end-to-end 🔩

_Para ejecutar las pruebas E2E en Cypress del sistema ejecutar el siguiente comando en la terminal de la raiz del proyecto_

_El cual ejecuta Cypress en modo headless las pruebas E2E_


```
npm run e2e:ci
```

_Para obtener un summary del reporte de pruebas ejecutar el siguiente comando _

...
npm run e2e:coverage
...

_Para visualizar el reporte grafico de la cobertura de codigo de las pruebas E2E en la raiz del proyecto ubicarse en la ruta coverage-e2e/Icov-report/index.html_




## Despliegue 📦

_Previamente configurar la ruta del API que consumira nuestro proyecto en el archivo src/environments/environment.prod.ts campo API_URL_

_Para realizar el despligue a produccion del proyecto ejecutar el siguiente comando_

...
ng build --configuration production
...

_El cual creara la carpeta "dist" en la raiz de nuestro proyecto el cual podemos desplegar en cualquier servidor que ejecute HTML CSS y JS_ 

## Construido con 🛠️

_Menciona las herramientas que utilizaste para crear tu proyecto_

* [Angular](https://angular.io/docs) - El framework web usado
* [NPM](https://www.npmjs.com/) - Manejador de dependencias
* [Argon DashBoard](https://demos.creative-tim.com/argon-dashboard-angular/#/documentation/tutorial) - Plantilla Web Utilizada


## Versionado 📌

Usamos [GIT](https://git-scm.com/) para el versionado.

## Autores ✒️

_Los integrantes del proyecto_

* **Jaime Burgos Tejada** - *Developer* - [SkyZeroZx](https://github.com/SkyZeroZx)
* **Omar Ramos More** - *Documentación && Manual Testing* - [Vengenace](https://github.com/Vengenace)
* **Gianfranco Alfaro Mariño** - *Documentación && Manual Testing* - [Franco](https://github.com/Gianfranco622)

## Licencia 📄

Este proyecto está bajo la Licencia (Tu Licencia) - mira el archivo [LICENSE.md](LICENSE.md) para detalles
