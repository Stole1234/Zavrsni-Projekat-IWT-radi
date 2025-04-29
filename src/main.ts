import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.model';

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch(err => console.error(err));
