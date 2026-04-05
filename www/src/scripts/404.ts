import { Clock, ConsoleArt, PawField, PongGame, PunTicker } from '../modules';

new ConsoleArt();
new Clock('clock');
new PunTicker('punText', 'punTicker');
new PongGame('pongCanvas', 'scoreLeft', 'scoreRight');
new PawField('pawField');
