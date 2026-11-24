// main.ts = el PRIMER archivo que se ejecuta. Es el "botón de encendido" de la app.

// import = traer algo que está escrito en otro archivo o librería
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

// bootstrapApplication = "arranca la app": usa el componente principal (App)
// con la configuración global (appConfig).
// .catch = si algo falla al arrancar, muestra el error en la consola (F12).
bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
