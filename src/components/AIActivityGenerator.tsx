import React, { useState } from 'react';
import { Sparkles, X } from 'lucide-react';
import { Activity } from '../types';

interface AIActivityGeneratorProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (activity: Partial<Activity>) => void;
  dayTitle: string;
  dayLocation: string;
  apiKey: string;
}

export const AIActivityGenerator: React.FC<AIActivityGeneratorProps> = ({
  isOpen,
  onClose,
  onGenerate,
  dayTitle,
  dayLocation,
  apiKey
}) => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const [generatedActivity, setGeneratedActivity] = useState<Partial<Activity> | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setError('');

    try {
      // Si no hay API key, generamos una actividad básica
      if (!apiKey) {
        // Simulamos una generación básica
        setTimeout(() => {
          const basicActivity: Partial<Activity> = {
            title: `Actividad en ${dayLocation}`,
            description: `Esta es una actividad generada automáticamente para ${dayTitle} en ${dayLocation}. ${prompt}`,
            time: 'Todo el día',
            location: dayLocation
          };
          
          setGeneratedActivity(basicActivity);
          setIsGenerating(false);
        }, 1000);
        return;
      }

      // Si hay API key, hacemos la llamada a OpenAI
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'Eres un asistente especializado en generar actividades turísticas detalladas. Genera una actividad en formato JSON con los campos: title (título corto), description (descripción detallada), time (horario sugerido), location (ubicación específica dentro de la ciudad) y opcionalmente links (array de objetos con text y url).'
            },
            {
              role: 'user',
              content: `Genera una actividad turística para ${dayTitle} en ${dayLocation}. Detalles adicionales: ${prompt}`
            }
          ],
          temperature: 0.7
        })
      });

      if (!response.ok) {
        throw new Error('Error al comunicarse con la API de OpenAI');
      }

      const data = await response.json();
      const content = data.choices[0].message.content;
      
      // Intentamos parsear el JSON de la respuesta
      try {
        const activityData = JSON.parse(content);
        setGeneratedActivity(activityData);
      } catch (e) {
        // Si no podemos parsear el JSON, usamos el texto como descripción
        setGeneratedActivity({
          title: `Actividad en ${dayLocation}`,
          description: content,
          time: 'Todo el día',
          location: dayLocation
        });
      }
    } catch (err) {
      setError('Error al generar la actividad. Verifica tu API key o intenta más tarde.');
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleUseActivity = () => {
    if (generatedActivity) {
      onGenerate(generatedActivity);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <Sparkles size={20} className="mr-2 text-yellow-500" />
            Generar Actividad con IA
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-4">
          {!generatedActivity ? (
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 mb-1">
                  Describe la actividad que deseas generar
                </label>
                <textarea
                  id="prompt"
                  name="prompt"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={`Por ejemplo: "Una actividad cultural por la mañana en ${dayLocation}" o "Un restaurante típico para cenar en ${dayLocation}"`}
                  required
                />
                <p className="mt-1 text-sm text-gray-500">
                  {apiKey 
                    ? 'Se utilizará la API de OpenAI para generar una actividad personalizada.' 
                    : 'No se ha configurado una API key. Se generará una actividad básica.'}
                </p>
              </div>
              
              {error && (
                <div className="mb-4 p-2 bg-red-50 text-red-600 rounded-md text-sm">
                  {error}
                </div>
              )}
              
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isGenerating}
                  className={`px-4 py-2 text-white rounded-md flex items-center ${
                    isGenerating 
                      ? 'bg-blue-400 cursor-not-allowed' 
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  <Sparkles size={16} className="mr-2" />
                  {isGenerating ? 'Generando...' : 'Generar Actividad'}
                </button>
              </div>
            </form>
          ) : (
            <div>
              <div className="mb-4 p-4 bg-blue-50 rounded-lg">
                <h3 className="font-medium text-lg text-gray-900 mb-2">{generatedActivity.title}</h3>
                
                {generatedActivity.time && (
                  <div className="text-sm text-gray-600 mt-1">
                    <span className="font-medium">Hora:</span> {generatedActivity.time}
                  </div>
                )}
                
                {generatedActivity.location && (
                  <div className="text-sm text-gray-600 mt-1">
                    <span className="font-medium">Ubicación:</span> {generatedActivity.location}
                  </div>
                )}
                
                <div className="mt-2 text-gray-700 whitespace-pre-wrap">
                  {generatedActivity.description}
                </div>
                
                {generatedActivity.links && generatedActivity.links.length > 0 && (
                  <div className="mt-3">
                    {generatedActivity.links.map((link, i) => (
                      <a 
                        key={i}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-sm mr-3"
                      >
                        {link.text}
                      </a>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="flex justify-between">
                <button
                  onClick={() => setGeneratedActivity(null)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Volver a generar
                </button>
                <button
                  onClick={handleUseActivity}
                  className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
                >
                  Usar esta actividad
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
