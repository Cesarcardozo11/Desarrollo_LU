import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';

// ApplicationConfig = la configuración GLOBAL de la app.
// providers = la lista de "herramientas" que quedan disponibles en TODA la app.
export const appConfig: ApplicationConfig = {
  providers: [
    // Muestra en la consola los errores que no se atraparon
    provideBrowserGlobalErrorListeners(),

    // provideRouter = activa las rutas (cambiar de página según la URL)
    provideRouter(routes),

    // provideClientHydration = el navegador "activa" la página que llegó dibujada del servidor
    provideClientHydration(),

    // provideHttpClient = permite usar HttpClient para llamar a la API del backend
    provideHttpClient()
  ]
};
