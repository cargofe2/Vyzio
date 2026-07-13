-- Recursos "Profundiza más" para Nivel 0 — Origins (level-1)
-- Videos verificados vía búsqueda web (10 julio 2026), diagramas originales escritos por Claude.

INSERT INTO level_resources (id, "levelId", type, title, description, url, content, "order") VALUES

('lr_o_v1', 'level-1', 'video', 'La historia de la IA (para principiantes absolutos)',
 'Un recorrido claro por cómo llegamos hasta aquí — más antigua de lo que crees.',
 'https://www.youtube.com/watch?v=6WMfoTM4GvE', NULL, 1),

('lr_o_v2', 'level-1', 'video', 'Prompt Engineering: guía completa para principiantes',
 'Técnicas prácticas para escribir mejores instrucciones a ChatGPT y otros modelos de lenguaje.',
 'https://www.youtube.com/watch?v=_ZvnD73m40o', NULL, 2),

('lr_o_v3', 'level-1', 'video', '¿Qué es Anthropic? Claude AI explicado simple',
 'Quién hace a Claude, qué es la "IA Constitucional", y en qué se diferencia de otros modelos.',
 'https://www.youtube.com/watch?v=Vu0Wdb93ZH0', NULL, 3),

('lr_o_a1', 'level-1', 'article', 'The Complete History of Artificial Intelligence (guía escrita)',
 'Línea de tiempo completa en inglés, desde Turing (1950) hasta los modelos actuales — buen complemento de lectura.',
 'https://beginnersinai.org/history-of-ai/', NULL, 1),

('lr_o_d1', 'level-1', 'diagram', 'Línea de tiempo: hitos clave de la IA',
 'Los momentos que definieron el campo, en orden.',
 NULL,
 '{"blocks":[
   {"label":"1950 — Test de Turing","note":"Alan Turing propone: ¿puede una máquina engañar a un humano haciéndole creer que habla con otro humano?"},
   {"label":"1956 — Se acuña el término \"Inteligencia Artificial\"","note":"Conferencia de Dartmouth, liderada por John McCarthy."},
   {"label":"1997 — Deep Blue vence a Kasparov","note":"Primera vez que una máquina gana a un campeón mundial de ajedrez."},
   {"label":"2012 — Explosión del Deep Learning","note":"AlexNet demuestra que las redes neuronales profundas superan a todo lo anterior en visión por computadora."},
   {"label":"2017 — Se inventa el Transformer","note":"El paper \"Attention Is All You Need\" — la arquitectura detrás de todos los modelos de lenguaje actuales."},
   {"label":"2022 — Lanzamiento de ChatGPT","note":"La IA generativa llega al público masivo por primera vez."},
   {"label":"2023-2026 — Era de los agentes de IA","note":"Los modelos dejan de solo responder y empiezan a actuar: navegar, programar, usar herramientas."}
 ]}', 2),

('lr_o_d2', 'level-1', 'diagram', 'Cómo "piensa" un modelo de lenguaje (LLM)',
 'El camino que recorre tu mensaje hasta convertirse en una respuesta.',
 NULL,
 '{"blocks":[
   {"label":"1. Escribes un mensaje","note":"Tu texto en lenguaje natural, tal como lo escribirías a una persona."},
   {"label":"2. Tokenización","note":"El texto se parte en fragmentos pequeños (tokens) que el modelo puede procesar numéricamente."},
   {"label":"3. El modelo predice, palabra por palabra","note":"Basado en billones de ejemplos de texto, calcula cuál es la palabra más probable que sigue, una y otra vez."},
   {"label":"4. Ajuste por entrenamiento humano","note":"Un proceso llamado RLHF (o Constitutional AI en el caso de Claude) guía al modelo hacia respuestas útiles, honestas y seguras."},
   {"label":"5. Recibes la respuesta","note":"El resultado final, generado token por token en fracciones de segundo."}
 ]}', 3)

ON CONFLICT (id) DO NOTHING;
