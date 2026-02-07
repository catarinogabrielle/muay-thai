// --- IMAGENS (LINKS ESTÁVEIS) ---
const IMG = {
    rope: 'https://media.tenor.com/RObd9-N-W1cAAAAC/jump-rope-skipping.gif',
    jack: 'https://media.tenor.com/K7pG8nQ_sOAAAAAC/jumping-jacks.gif',
    run: 'https://media.tenor.com/Hl9T_aT4swoAAAAC/high-knees.gif',
    shadow: 'https://media.tenor.com/T0a-v09dM8gAAAAC/boxing-jab.gif',
    punch: 'https://media.tenor.com/images/760775d79672658137397b987515f458/tenor.gif',
    kick: 'https://media.tenor.com/w4p8s_a_3pMAAAAC/muay-thai-kick.gif',
    knee: 'https://media.tenor.com/images/e75476d080351722370773059483324d/tenor.gif',
    clinch: 'https://media.tenor.com/images/07d4722830f3c5d637c35694291410d8/tenor.gif',
    defense: 'https://media.tenor.com/images/330f8982a51f8a85366487926715f33d/tenor.gif',
    pushup: 'https://media.tenor.com/gI-8qCUEko8AAAAC/pushup.gif',
    abs: 'https://media.tenor.com/4eQeFV2MQ9cAAAAC/sit-up-crunch.gif',
    squat: 'https://media.tenor.com/1-Z9_1m6M70AAAAC/squats-exercise.gif',
    burpee: 'https://media.tenor.com/Qk9pAjpw1-0AAAAC/burpee-exercise.gif',
    plank: 'https://i.pinimg.com/originals/13/16/e6/1316e6e232b7c7b074a3b04392e22c9b.gif',
    stretch: 'https://media.tenor.com/images/29725597753696884634281696016147/tenor.gif',
    setup: 'https://media.tenor.com/images/1c613c7a0d4c18546376831d10229342/tenor.gif',
    water: 'https://media.tenor.com/images/4d7159676e9a676b7012558550181518/tenor.gif',
    switch: 'https://media.tenor.com/images/1c613c7a0d4c18546376831d10229342/tenor.gif' // Ícone de troca
};

const BELT_SYSTEM = [
    { name: 'BRANCA', min: 0, color: '#ffffff' },
    { name: 'BRANCA PT VERMELHA', min: 15, color: '#ffadad' },
    { name: 'VERMELHA', min: 30, color: '#ff4757' },
    { name: 'VERMELHA PT AZUL', min: 50, color: '#5f27cd' },
    { name: 'AZUL CLARO', min: 80, color: '#54a0ff' },
    { name: 'AZUL ESCURO', min: 120, color: '#0984e3' },
    { name: 'PRETA', min: 200, color: '#2d3436' }
];

const EXERCISE_DB = [
    // --- SISTEMA DE FLUXO ---
    { id: 'setup', type: 'rest', name: 'PRIMEIRA EXPLICAÇÃO', dur: 180, desc: '3 MINUTOS: Explicação detalhada da primeira técnica.', img: IMG.setup },
    { id: 'explain_next', type: 'rest', name: 'EXPLICAÇÃO DA PRÓXIMA', dur: 180, desc: '3 MINUTOS: Atenção ao professor para a próxima técnica.', img: IMG.setup },
    { id: 'partner_switch', type: 'rest', name: 'TROCA DE PARCEIRO', dur: 120, desc: '2 MINUTOS: Quem segurava o aparador agora vai bater.', img: IMG.switch },

    { id: 'rest_20', type: 'rest', name: 'Respira / Troca', dur: 20, desc: 'Troca rápida.', img: IMG.water },
    { id: 'z1', type: 'rest', name: 'Pausa Água', dur: 60, desc: 'Hidratação.', img: IMG.water },
    { id: 'z2', type: 'rest', name: 'Alongamento Final', dur: 300, desc: 'Resfriamento.', img: IMG.stretch },

    // AQUECIMENTO
    { id: 'w01', type: 'warmup', name: 'Pular Corda', dur: 180, desc: 'Ritmo constante.', img: IMG.rope },
    { id: 'w02', type: 'warmup', name: 'Polichinelos', dur: 60, desc: 'Amplitude total.', img: IMG.jack },
    { id: 'w03', type: 'warmup', name: 'Sombra Livre', dur: 120, desc: 'Visualize a luta.', img: IMG.shadow },
    { id: 'w04', type: 'warmup', name: 'Corrida Joelho Alto', dur: 45, desc: 'Joelho na cintura.', img: IMG.run },
    { id: 'w05', type: 'warmup', name: 'Sprawl', dur: 60, desc: 'Defesa de queda.', img: IMG.burpee },
    { id: 'w06', type: 'warmup', name: 'Agachamento', dur: 45, desc: 'Postura reta.', img: IMG.squat },

    // TÉCNICAS (Duração definida pelo gerador, usamos apenas nomes aqui)
    { id: 'b01', type: 'tech', name: 'Jab + Direto', dur: 180, desc: 'Técnica.', img: IMG.punch },
    { id: 'k01', type: 'tech', name: 'Chute Circular', dur: 180, desc: 'Técnica.', img: IMG.kick },
    { id: 'c01', type: 'tech', name: '1-2 + Low Kick', dur: 180, desc: 'Combo.', img: IMG.kick },
    { id: 'c02', type: 'tech', name: 'Teep + Joelho', dur: 180, desc: 'Combo.', img: IMG.knee },
    { id: 'c03', type: 'tech', name: 'Cruzado + Chute', dur: 180, desc: 'Combo.', img: IMG.kick },
    { id: 'c04', type: 'tech', name: 'Esquiva + Direto', dur: 180, desc: 'Defesa.', img: IMG.defense },
    { id: 'c05', type: 'tech', name: 'Bloqueio + Chute', dur: 180, desc: 'Contra-ataque.', img: IMG.defense },
    { id: 'c06', type: 'tech', name: 'Jab + Upper + Cruzado', dur: 180, desc: 'Boxe.', img: IMG.punch },

    // FÍSICO
    { id: 'p01', type: 'phys', name: 'Flexão de Braço', dur: 60, desc: 'Peito no chão.', img: IMG.pushup },
    { id: 'p02', type: 'phys', name: 'Abdominal Remador', dur: 60, desc: 'Estica e agrupa.', img: IMG.abs },
    { id: 'p03', type: 'phys', name: 'Burpees', dur: 45, desc: 'Explosão.', img: IMG.burpee },

    // KIDS
    { id: 'f01', type: 'fun', name: 'Tocar o Ombro', dur: 180, desc: 'Defenda seu ombro.', img: IMG.shadow },
    { id: 'f02', type: 'fun', name: 'Pega-Pega Thai', dur: 180, desc: 'Quem é pego faz flexão.', img: IMG.run }
];