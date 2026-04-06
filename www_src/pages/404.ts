import './404.scss';
import { ClockModule, ConsoleModule, PawFieldModule, PongModule, PunTickerModule } from '../modules';

new ConsoleModule();
new ClockModule();
new PunTickerModule();

new PongModule();
new PawFieldModule();

console.log('404 Not Found');
