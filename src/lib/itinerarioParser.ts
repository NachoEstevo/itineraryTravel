import { Trip } from '../types';
import { generateId } from './utils';

export function parseItinerario(): Trip {
  const initialTrip: Trip = {
    id: generateId(),
    title: 'Itinerario: Berlín, Italia, Londres y Ámsterdam',
    description: 'Viaje por Europa visitando Berlín, Italia, Londres y Ámsterdam durante julio y agosto',
    startDate: '2025-07-25',
    endDate: '2025-08-09',
    days: [
      {
        id: generateId(),
        date: '2025-07-25',
        title: 'Día 1: Berlín',
        location: 'Berlín, Alemania',
        activities: [
          {
            id: generateId(),
            title: 'Llegada y primer contacto',
            description: 'Tras instalarse en Berlín (NH Collection Berlin), aprovechen la tarde para un paseo por el centro histórico. Pasen por la Puerta de Brandeburgo y el Memorial del Holocausto, y caminen por la avenida Unter den Linden hasta la Isla de los Museos.',
            time: 'Tarde',
            location: 'Centro histórico de Berlín',
          },
          {
            id: generateId(),
            title: 'Gastronomía local',
            description: 'Para una cena informal y económica, prueben una currywurst en Curry 36 (puesto icónico en Kreuzberg) donde 2 salchichas con patatas cuestan <5 € y suele haber ambiente de locales y noctámbulos. Alternativamente, un döner kebab en Mustafa\'s Gemüse Kebap.',
            time: 'Noche',
            location: 'Kreuzberg',
            links: [
              {
                text: 'Curry 36',
                url: 'https://berlinpoche.de/es/currywurst-berlin'
              }
            ]
          },
          {
            id: generateId(),
            title: 'Noche relajada',
            description: 'Tomen algo en un biergarten tradicional como Prater Garten en Prenzlauer Berg (el jardín de cerveza más antiguo de Berlín) para ambientarse sin gastar mucho. Si tienen energías, asómense por Friedrichshain a algún bar alternativo o club pequeño.',
            time: 'Noche',
            location: 'Prenzlauer Berg / Friedrichshain',
          }
        ]
      },
      {
        id: generateId(),
        date: '2025-07-26',
        title: 'Día 2: Berlín',
        location: 'Berlín, Alemania',
        activities: [
          {
            id: generateId(),
            title: 'Visitas icónicas',
            description: 'Comiencen temprano en Reichstag (Parlamento Alemán) para subir a su cúpula de cristal – reserven la visita gratuita con anticipación en la web. Luego, exploren el barrio gubernamental y crucen a pie el Tiergarten hasta la Columna de la Victoria.',
            time: 'Mañana',
            location: 'Reichstag y Tiergarten',
          },
          {
            id: generateId(),
            title: 'Arte urbano y muro de Berlín',
            description: 'Diríjanse a East Side Gallery, el tramo más largo del Muro con murales famosos. Caminen desde Oberbaumbrücke (puente simbólico) a lo largo de la galería al aire libre.',
            time: 'Mediodía',
            location: 'East Side Gallery',
          },
          {
            id: generateId(),
            title: 'Tarde alternativa',
            description: 'Exploren el barrio de Kreuzberg: sus calles llenas de arte callejero, tienditas vintage y cafeterías. Visiten el mercadillo turco en Maybachufer o simplemente tomen un café en alguna terraza bohemia.',
            time: 'Tarde',
            location: 'Kreuzberg',
          },
          {
            id: generateId(),
            title: 'Vida nocturna (electrónica)',
            description: 'Sábado es la gran noche de Berlín. Si buscan techno/house, consideren intentar entrar a Berghain, el mítico club. Alternativas más accesibles: Watergate en Kreuzberg o Tresor.',
            time: 'Noche',
            location: 'Varios clubs',
          }
        ]
      },
      {
        id: generateId(),
        date: '2025-08-08',
        title: 'Día 15: Ámsterdam',
        location: 'Ámsterdam, Países Bajos',
        activities: [
          {
            id: generateId(),
            title: 'Viaje a Ámsterdam',
            description: 'Salida de Londres por la mañana. Si toman el Eurostar directo, en ~4 horas estarán en Amsterdam Centraal. Si vuelan, son ~1 hora de vuelo + traslados. Llegada a Ámsterdam hacia el mediodía.',
            time: 'Mañana',
            location: 'Traslado Londres-Ámsterdam',
            links: [
              {
                text: 'Info Eurostar',
                url: 'https://www.seat61.com/trains-and-routes/london-to-amsterdam-by-eurostar.htm'
              }
            ]
          },
          {
            id: generateId(),
            title: 'Centro histórico en tarde',
            description: 'Vayan al centro de Ámsterdam para ambientarse. Desde Centraal Station caminen por Damrak hasta la Plaza Dam, corazón de la ciudad, donde está el Palacio Real y la Nieuwe Kerk.',
            time: 'Tarde',
            location: 'Centro de Ámsterdam',
          },
          {
            id: generateId(),
            title: 'Experiencia local – bici y parque',
            description: 'Ámsterdam se conoce mejor en bicicleta. Consideren alquilar unas bicis por unas horas. Pedaleen hasta el Vondelpark, el parque urbano principal, y únanse a los locales que van en bici, patinan o hacen picnic.',
            time: 'Tarde',
            location: 'Vondelpark',
          },
          {
            id: generateId(),
            title: 'Cena en Foodhallen',
            description: 'Para la noche, una gran opción cercana y económica es cenar en Foodhallen (ubicada en Oud-West). Es un mercado gastronómico cubierto con 19 puestos que ofrecen cocina local e internacional en un animado espacio común.',
            time: 'Noche',
            location: 'Foodhallen, Oud-West',
            links: [
              {
                text: 'Foodhallen',
                url: 'https://www.iamsterdam.com/en/whats-on/calendar/eating-and-drinking/restaurants/foodhallen'
              }
            ]
          }
        ]
      }
    ]
  };

  return initialTrip;
}
