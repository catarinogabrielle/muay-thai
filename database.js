// =============================================================================
// 1. BIBLIOTECA VISUAL (ESTÁVEL)
// =============================================================================
const IMG = {
    punch: 'https://media.tenor.com/images/760775d79672658137397b987515f458/tenor.gif',
    kick: 'https://media.tenor.com/w4p8s_a_3pMAAAAC/muay-thai-kick.gif',
    knee: 'https://media.tenor.com/images/e75476d080351722370773059483324d/tenor.gif',
    clinch: 'https://media.tenor.com/images/07d4722830f3c5d637c35694291410d8/tenor.gif',
    elbow: 'https://media.tenor.com/images/07d4722830f3c5d637c35694291410d8/tenor.gif',
    defense: 'https://media.tenor.com/images/330f8982a51f8a85366487926715f33d/tenor.gif',
    rope: 'https://media.tenor.com/RObd9-N-W1cAAAAC/jump-rope-skipping.gif',
    jack: 'https://media.tenor.com/K7pG8nQ_sOAAAAAC/jumping-jacks.gif',
    run: 'https://media.tenor.com/Hl9T_aT4swoAAAAC/high-knees.gif',
    shadow: 'https://media.tenor.com/T0a-v09dM8gAAAAC/boxing-jab.gif',
    setup: 'https://media.tenor.com/images/1c613c7a0d4c18546376831d10229342/tenor.gif',
    water: 'https://media.tenor.com/images/4d7159676e9a676b7012558550181518/tenor.gif',
    switch: 'https://media.tenor.com/images/1c613c7a0d4c18546376831d10229342/tenor.gif',
    phys: 'https://media.tenor.com/gI-8qCUEko8AAAAC/pushup.gif',
    abs: 'https://media.tenor.com/4eQeFV2MQ9cAAAAC/sit-up-crunch.gif',
    squat: 'https://media.tenor.com/1-Z9_1m6M70AAAAC/squats-exercise.gif',
    burpee: 'https://media.tenor.com/Qk9pAjpw1-0AAAAC/burpee-exercise.gif',
    plank: 'https://i.pinimg.com/originals/13/16/e6/1316e6e232b7c7b074a3b04392e22c9b.gif',
    stretch: 'https://media.tenor.com/images/29725597753696884634281696016147/tenor.gif'
};

// =============================================================================
// 2. SISTEMA DE FAIXAS (KHAN)
// =============================================================================
const BELT_SYSTEM = [
    { name: 'BRANCA (Khan 1)', min: 0, color: '#ffffff' },
    { name: 'BRANCA PT VERMELHA', min: 15, color: '#ffadad' },
    { name: 'VERMELHA (Khan 3)', min: 30, color: '#ff4757' },
    { name: 'VERMELHA PT AZUL', min: 50, color: '#5f27cd' },
    { name: 'AZUL (Khan 5)', min: 80, color: '#54a0ff' },
    { name: 'AZUL ESCURO', min: 120, color: '#0984e3' },
    { name: 'PRETA (Kru)', min: 200, color: '#2d3436' }
];

// =============================================================================
// 3. DATABASE COMPLETO
// =============================================================================
const EXERCISE_DB = [

    // --- SISTEMA (LÓGICA 6-2-6-3) ---
    { id: 'setup', type: 'rest', name: 'DEMONSTRAÇÃO TÉCNICA', dur: 120, desc: 'Professor explica a técnica. Atenção total.', img: IMG.setup },
    { id: 'explain_next', type: 'rest', name: 'EXPLICAÇÃO DA PRÓXIMA', dur: 180, desc: 'Atenção aos detalhes da próxima sequência.', img: IMG.setup },
    { id: 'partner_switch', type: 'rest', name: 'TROCA DE PARCEIRO', dur: 120, desc: 'Quem segurava o aparador agora coloca a luva.', img: IMG.switch },
    { id: 'rest_20', type: 'rest', name: 'Respira / Troca', dur: 20, desc: 'Troca rápida de exercício ou base.', img: IMG.water },
    { id: 'z1', type: 'rest', name: 'Pausa Água', dur: 60, desc: 'Hidratação.', img: IMG.water },
    { id: 'z2', type: 'rest', name: 'Alongamento Final', dur: 300, desc: 'Resfriamento.', img: IMG.stretch },

    // =================================================================
    // 🔥 AQUECIMENTO & MOBILIDADE
    // =================================================================
    { id: 'w01', type: 'warmup', name: 'Pular Corda (Ritmo)', dur: 180, desc: '3 min: Constante, ponta dos pés.', img: IMG.rope },
    { id: 'w02', type: 'warmup', name: 'Pular Corda (Alternado)', dur: 180, desc: '3 min: Trocando o pé (Boxer Step).', img: IMG.rope },
    { id: 'w03', type: 'warmup', name: 'Sombra Livre (Shadow)', dur: 180, desc: '3 min: Movimentação completa, visualize o oponente.', img: IMG.shadow },
    { id: 'w04', type: 'warmup', name: 'Polichinelos', dur: 60, desc: 'Aquecer ombros e panturrilha.', img: IMG.jack },
    { id: 'w05', type: 'warmup', name: 'Corrida Joelho Alto', dur: 45, desc: 'Suba o joelho na altura do quadril.', img: IMG.run },
    { id: 'w06', type: 'warmup', name: 'Sprawl (Defesa de Queda)', dur: 60, desc: 'Peito no chão e volta rápido para a base.', img: IMG.burpee },
    { id: 'w07', type: 'warmup', name: 'Giro de Quadril', dur: 30, desc: 'Soltura para chutes.', img: IMG.stretch },
    { id: 'w08', type: 'warmup', name: 'Mountain Climber', dur: 45, desc: 'Corrida no chão (Prancha).', img: IMG.burpee },
    { id: 'w09', type: 'warmup', name: 'Deslocamento Lateral', dur: 60, desc: 'Base de luta, não cruze as pernas.', img: IMG.run },
    { id: 'w10', type: 'warmup', name: 'Sombra de Cotovelo', dur: 120, desc: 'Foco na rotação de tronco e guarda alta.', img: IMG.elbow },

    // =================================================================
    // 🥊 MAHD (SOCOS) - TÉCNICAS ISOLADAS
    // =================================================================
    { id: 'box01', type: 'tech', name: 'Mat Trong (Jab)', dur: 180, desc: '3 MIN: Soco frontal mão da frente. Rotação do ombro.', img: IMG.punch },
    { id: 'box02', type: 'tech', name: 'Mat Trong (Direto)', dur: 180, desc: '3 MIN: Soco frontal mão de trás. Gire o pé de apoio.', img: IMG.punch },
    { id: 'box03', type: 'tech', name: 'Mat Weang (Cruzado)', dur: 180, desc: '3 MIN: Soco lateral. Cotovelo na altura do ombro.', img: IMG.punch },
    { id: 'box04', type: 'tech', name: 'Mat Soey (Uppercut)', dur: 180, desc: '3 MIN: De baixo para cima. Flexione os joelhos.', img: IMG.punch },
    { id: 'box05', type: 'tech', name: 'Mat Tawan (Overhand)', dur: 180, desc: '3 MIN: Cruzado descendente (Matacobra). Passa por cima da guarda.', img: IMG.punch },
    { id: 'box06', type: 'tech', name: 'Mat Klone (Soco Giratório)', dur: 180, desc: '3 MIN: Spinning Back Fist. Gira de costas e bate com as costas da mão.', img: IMG.punch },
    { id: 'box07', type: 'tech', name: 'Kradot Chok (Superman)', dur: 180, desc: '3 MIN: Finta o chute com a perna de trás e soca saltando.', img: IMG.punch },
    { id: 'box08', type: 'tech', name: 'Gancho no Corpo', dur: 180, desc: '3 MIN: Cruzado baixo mirando baço/fígado.', img: IMG.punch },

    // =================================================================
    // 🦵 TE (CHUTES) - TÉCNICAS ISOLADAS
    // =================================================================
    { id: 'kick01', type: 'tech', name: 'Te Chiang (Chute Médio)', dur: 180, desc: '3 MIN: Chute circular na costela. Canela no alvo.', img: IMG.kick },
    { id: 'kick02', type: 'tech', name: 'Te Thao (Low Kick)', dur: 180, desc: '3 MIN: Chute na coxa. Passo diagonal e corta para baixo.', img: IMG.kick },
    { id: 'kick03', type: 'tech', name: 'Te Kao (High Kick)', dur: 180, desc: '3 MIN: Chute na cabeça. Exige flexibilidade e postura.', img: IMG.kick },
    { id: 'kick04', type: 'tech', name: 'Teep Trong (Chute Frontal)', dur: 180, desc: '3 MIN: Empurra com a sola do pé no peito do oponente.', img: IMG.kick },
    { id: 'kick05', type: 'tech', name: 'Teep Khang (Chute Lateral)', dur: 180, desc: '3 MIN: Side Kick. Vira o corpo de lado e pisa com o calcanhar.', img: IMG.kick },
    { id: 'kick06', type: 'tech', name: 'Te Klab (Chute Giratório)', dur: 180, desc: '3 MIN: Gira de costas e acerta com o calcanhar (Spinning Back Kick).', img: IMG.kick },
    { id: 'kick07', type: 'tech', name: 'Te Krop (Chute Descendente)', dur: 180, desc: '3 MIN: Brazilian Kick. Sobe frontal e desce lateral na cabeça.', img: IMG.kick },
    { id: 'kick08', type: 'tech', name: 'Jarakhe Fad Hang', dur: 180, desc: '3 MIN: Chute rabo de crocodilo (Giratório de calcanhar na cabeça).', img: IMG.kick },
    { id: 'kick09', type: 'tech', name: 'Teep Jid (Chute No Rosto)', dur: 180, desc: '3 MIN: Teep alto no rosto para controle.', img: IMG.kick },
    { id: 'kick10', type: 'tech', name: 'Switch Kick', dur: 180, desc: '3 MIN: Troca a base rápido e chuta com a perna da frente.', img: IMG.kick },

    // =================================================================
    // 🦵 KHAO (JOELHADAS) - TÉCNICAS ISOLADAS
    // =================================================================
    { id: 'kne01', type: 'tech', name: 'Khao Trong (Joelhada Frontal)', dur: 180, desc: '3 MIN: Joelhada reta. Jogue o quadril para frente (Spear Knee).', img: IMG.knee },
    { id: 'kne02', type: 'tech', name: 'Khao Chiang (Joelhada Diagonal)', dur: 180, desc: '3 MIN: Bate nas costelas flutuantes em ângulo.', img: IMG.knee },
    { id: 'kne03', type: 'tech', name: 'Khao Tat (Joelhada Circular)', dur: 180, desc: '3 MIN: Joelhada horizontal (Roundhouse Knee).', img: IMG.knee },
    { id: 'kne04', type: 'tech', name: 'Khao Loi (Joelhada Voadora)', dur: 180, desc: '3 MIN: Passo, salto e joelhada no ar.', img: IMG.knee },
    { id: 'kne05', type: 'tech', name: 'Khao Noi (Joelhada Pequena)', dur: 180, desc: '3 MIN: Bate na coxa interna (usado no clinch).', img: IMG.knee },
    { id: 'kne06', type: 'tech', name: 'Khao Yao (Joelhada Longa)', dur: 180, desc: '3 MIN: Joelhada avançando a base para cobrir distância.', img: IMG.knee },
    { id: 'kne07', type: 'tech', name: 'Step-Up Knee', dur: 180, desc: '3 MIN: Pisa na coxa do parceiro e sobe o outro joelho.', img: IMG.knee },

    // =================================================================
    // 🔪 SOK (COTOVELADAS) - TÉCNICAS ISOLADAS
    // =================================================================
    { id: 'elb01', type: 'tech', name: 'Sok Tad (Cotovelada Horizontal)', dur: 180, desc: '3 MIN: Cotovelo paralelo ao chão. Gire o tronco e acerte o queixo.', img: IMG.elbow },
    { id: 'elb02', type: 'tech', name: 'Sok Ti (Cotovelada Diagonal)', dur: 180, desc: '3 MIN: Corte de cima para baixo (45 graus). Mire no supercílio.', img: IMG.elbow },
    { id: 'elb03', type: 'tech', name: 'Sok Ngad (Uppercut)', dur: 180, desc: '3 MIN: Vertical de baixo para cima. Passa entre a guarda.', img: IMG.elbow },
    { id: 'elb04', type: 'tech', name: 'Sok Sab (Cotovelada Descendente)', dur: 180, desc: '3 MIN: Vertical de cima para baixo (Machadada). Mire na testa.', img: IMG.elbow },
    { id: 'elb05', type: 'tech', name: 'Sok Pung (Cotovelada Estocada)', dur: 180, desc: '3 MIN: Estocada para frente. Fura a guarda como um jab.', img: IMG.elbow },
    { id: 'elb06', type: 'tech', name: 'Sok Klab (Cotovelada Giratória)', dur: 180, desc: '3 MIN: Spinning Back Elbow. Gira de costas e acerta horizontal.', img: IMG.elbow },
    { id: 'elb07', type: 'tech', name: 'Sok Tong (Esmagamento)', dur: 180, desc: '3 MIN: Desce reto para quebrar a guarda ou clavícula.', img: IMG.elbow },
    { id: 'elb08', type: 'tech', name: 'Sok Ku (Cotovelada Dupla)', dur: 180, desc: '3 MIN: Ambos cotovelos juntos. Golpe de Muay Boran.', img: IMG.elbow },
    { id: 'elb09', type: 'tech', name: 'Sok Chieng (Cotovelada Diagonal Cima)', dur: 180, desc: '3 MIN: Corte diagonal de baixo para cima.', img: IMG.elbow },
    { id: 'elb10', type: 'tech', name: 'Kradot Sok (Cotovelada Com Salto)', dur: 180, desc: '3 MIN: Pliometria + Sok Sab no ar.', img: IMG.elbow },

    // =================================================================
    // 🫂 CHAP KO (CLINCH) - DOMÍNIO E QUEDAS
    // =================================================================
    { id: 'cl01', type: 'tech', name: 'Clinch: Pegada Dupla', dur: 180, desc: '3 MIN: Mãos na nuca, cotovelos fechados no peito do oponente.', img: IMG.clinch },
    { id: 'cl02', type: 'tech', name: 'Clinch: Pegada Cruzada', dur: 180, desc: '3 MIN: Uma mão no pescoço, outra controlando o bíceps.', img: IMG.clinch },
    { id: 'cl03', type: 'tech', name: 'Clinch: Esgrima (Body Lock)', dur: 180, desc: '3 MIN: Braços por baixo das axilas, travando as costas.', img: IMG.clinch },
    { id: 'cl04', type: 'tech', name: 'Clinch: Pummeling (Nadar)', dur: 180, desc: '3 MIN: Drill de passar os braços por dentro constantemente.', img: IMG.clinch },
    { id: 'cl05', type: 'tech', name: 'Desequilíbrio Lateral (Volante)', dur: 180, desc: '3 MIN: Puxa a cabeça para baixo e gira como um volante.', img: IMG.clinch },
    { id: 'cl06', type: 'tech', name: 'Sweep Frontal (Banda)', dur: 180, desc: '3 MIN: Chuta o pé de apoio enquanto empurra o tronco.', img: IMG.clinch },
    { id: 'cl07', type: 'tech', name: 'Travamento de Braço', dur: 180, desc: '3 MIN: Prende o braço do oponente contra o corpo para bater.', img: IMG.clinch },
    { id: 'cl08', type: 'tech', name: 'Joelhada Lateral no Clinch', dur: 180, desc: '3 MIN: Abre o quadril e bate com a lateral do joelho.', img: IMG.clinch },
    { id: 'cl09', type: 'tech', name: 'Cotovelo Curto no Clinch', dur: 180, desc: '3 MIN: Cria espaço mínimo e entra com Sok Tad.', img: IMG.clinch },
    { id: 'cl10', type: 'tech', name: 'Saída de Clinch (Giro)', dur: 180, desc: '3 MIN: Gira o ombro e passa a cabeça por baixo.', img: IMG.defense },

    // =================================================================
    // 💣 COMBOS: MÃO + PERNA (KICKBOXING / DUTCH)
    // =================================================================
    { id: 'cb01', type: 'tech', name: '1-2 + Low Kick', dur: 180, desc: '3 MIN: Jab, Direto, Chute na Coxa.', img: IMG.kick },
    { id: 'cb02', type: 'tech', name: '1-2 + Chute Médio', dur: 180, desc: '3 MIN: Jab, Direto, Chute na Costela.', img: IMG.kick },
    { id: 'cb03', type: 'tech', name: 'Jab + Cruzado + Low Kick', dur: 180, desc: '3 MIN: Sequência clássica em X (diagonal).', img: IMG.kick },
    { id: 'cb04', type: 'tech', name: 'Direto + Chute Esquerda', dur: 180, desc: '3 MIN: Soco reto e Switch Kick rápido.', img: IMG.kick },
    { id: 'cb05', type: 'tech', name: 'Cruzado + Chute Alto', dur: 180, desc: '3 MIN: Gancho curto e chute na cabeça na saída.', img: IMG.kick },
    { id: 'cb06', type: 'tech', name: 'Upper + Cruzado + Low Kick', dur: 180, desc: '3 MIN: Levanta a guarda dele e chuta a perna.', img: IMG.kick },
    { id: 'cb07', type: 'tech', name: 'Gancho Corpo + Low Kick', dur: 180, desc: '3 MIN: Estilo Holandês (Ernesto Hoost).', img: IMG.kick },
    { id: 'cb08', type: 'tech', name: 'Low Kick + Direto', dur: 180, desc: '3 MIN: Chuta a perna e cai batendo o direto.', img: IMG.punch },
    { id: 'cb09', type: 'tech', name: '1-2 + Chute Frontal', dur: 180, desc: '3 MIN: Soca para aproximar e empurra com Teep.', img: IMG.kick },
    { id: 'cb10', type: 'tech', name: 'Chute Baixo + Chute Alto', dur: 180, desc: '3 MIN: Mesma perna (Question Mark Kick).', img: IMG.kick },
    { id: 'cb11', type: 'tech', name: 'Jab + Chute Direita', dur: 180, desc: '3 MIN: Esconde o chute atrás do Jab.', img: IMG.kick },
    { id: 'cb12', type: 'tech', name: '1-2-3 + Chute', dur: 180, desc: '3 MIN: Volume de mão e finaliza com perna.', img: IMG.punch },

    // =================================================================
    // 💣 COMBOS: MÃO + COTOVELO (MUAY SOK)
    // =================================================================
    { id: 'sk01', type: 'tech', name: 'Jab + Sok Ti', dur: 180, desc: '3 MIN: Jab para medir, avança cortando com cotovelo diagonal.', img: IMG.elbow },
    { id: 'sk02', type: 'tech', name: 'Direto + Sok Ngad', dur: 180, desc: '3 MIN: Direto longo, encurta e sobe o cotovelo.', img: IMG.elbow },
    { id: 'sk03', type: 'tech', name: 'Cruzado + Sok Tad', dur: 180, desc: '3 MIN: Cruzado de esquerda, Cotovelo horizontal de direita.', img: IMG.elbow },
    { id: 'sk04', type: 'tech', name: 'Fake Teep + Sok Pung', dur: 180, desc: '3 MIN: Finta o chute frontal e entra de cotovelo lança.', img: IMG.elbow },
    { id: 'sk05', type: 'tech', name: 'Sok Tad + Sok Ngad', dur: 180, desc: '3 MIN: Cotovelo horizontal e volta com uppercut (mesmo braço).', img: IMG.elbow },
    { id: 'sk06', type: 'tech', name: 'Jab + Cotovelo Giratório', dur: 180, desc: '3 MIN: Jab para cegar, gira e bate Sok Klab.', img: IMG.elbow },
    { id: 'sk07', type: 'tech', name: 'Upper + Sok Sab', dur: 180, desc: '3 MIN: Levanta a cabeça com upper, desce a machadada.', img: IMG.elbow },
    { id: 'sk08', type: 'tech', name: 'Defesa de Cruzado + Cotovelo', dur: 180, desc: '3 MIN: Bloqueia e entra com Sok Ti.', img: IMG.defense },
    { id: 'sk09', type: 'tech', name: 'Clinch + Sok Ngad', dur: 180, desc: '3 MIN: Empurra o parceiro e sobe o cotovelo no queixo.', img: IMG.clinch },
    { id: 'sk10', type: 'tech', name: 'Sok Ku (Duplo) no Bloqueio', dur: 180, desc: '3 MIN: Defende chute alto com cotovelos e ataca.', img: IMG.elbow },

    // =================================================================
    // 💣 COMBOS: PERNA + JOELHO (MUAY KHAO)
    // =================================================================
    { id: 'mk01', type: 'tech', name: 'Teep + Joelhada', dur: 180, desc: '3 MIN: Empurra com Teep, corre e entra de joelho.', img: IMG.knee },
    { id: 'mk02', type: 'tech', name: 'Chute + Joelho', dur: 180, desc: '3 MIN: Chute circular, cai na frente e joelhada.', img: IMG.knee },
    { id: 'mk03', type: 'tech', name: 'Direto + Joelhada Voadora', dur: 180, desc: '3 MIN: Soco para distrair, salta com o joelho.', img: IMG.knee },
    { id: 'mk04', type: 'tech', name: 'Clinch + 2 Joelhos', dur: 180, desc: '3 MIN: Pega no pescoço, joelho dir, joelho esq.', img: IMG.clinch },
    { id: 'mk05', type: 'tech', name: 'Bloqueio + Joelho Retorno', dur: 180, desc: '3 MIN: Defende o chute e devolve joelhada.', img: IMG.defense },
    { id: 'mk06', type: 'tech', name: '1-2 + Step Knee', dur: 180, desc: '3 MIN: Socos e joelhada trocando a base.', img: IMG.knee },
    { id: 'mk07', type: 'tech', name: 'Teep Rosto + Chute Perna', dur: 180, desc: '3 MIN: Confunde níveis (Cima/Baixo).', img: IMG.kick },
    { id: 'mk08', type: 'tech', name: 'Chute + Segura + Varrida', dur: 180, desc: '3 MIN: Chuta, trava a perna dele e derruba.', img: IMG.clinch },
    { id: 'mk09', type: 'tech', name: 'Joelhada + Cotovelo', dur: 180, desc: '3 MIN: Entra de joelho, cai na base e bate cotovelo.', img: IMG.clinch },
    { id: 'mk10', type: 'tech', name: 'Fake Knee + Elbow', dur: 180, desc: '3 MIN: Finta o joelho e bate cotovelo descendente.', img: IMG.elbow },

    // =================================================================
    // 🛡️ DEFESA & CONTRA-ATAQUE (MUAY FEMEU)
    // =================================================================
    { id: 'mf01', type: 'tech', name: 'Bloqueio + Chute (Mesmo lado)', dur: 180, desc: '3 MIN: Defende e chuta com a mesma perna rápido.', img: IMG.defense },
    { id: 'mf02', type: 'tech', name: 'Esquiva + Direto', dur: 180, desc: '3 MIN: Sai do jab e bate direto por cima.', img: IMG.defense },
    { id: 'mf03', type: 'tech', name: 'Catch Kick + Direto', dur: 180, desc: '3 MIN: Segura o chute na costela e soca.', img: IMG.defense },
    { id: 'mf04', type: 'tech', name: 'Catch Kick + Banda', dur: 180, desc: '3 MIN: Segura o chute e varre a perna de apoio.', img: IMG.defense },
    { id: 'mf05', type: 'tech', name: 'Lean Back + Chute', dur: 180, desc: '3 MIN: Esquiva para trás e volta chutando.', img: IMG.defense },
    { id: 'mf06', type: 'tech', name: 'Parry + Low Kick', dur: 180, desc: '3 MIN: Tapa no jab e chuta a coxa.', img: IMG.defense },
    { id: 'mf07', type: 'tech', name: 'Bloqueio Cruzado + Cotovelo', dur: 180, desc: '3 MIN: Defesa de mão e contra-ataque curto.', img: IMG.defense },
    { id: 'mf08', type: 'tech', name: 'Saída Lateral + Chute', dur: 180, desc: '3 MIN: Pivô para fora e chute nas costas/costela.', img: IMG.run },
    { id: 'mf09', type: 'tech', name: 'Teep Defensivo', dur: 180, desc: '3 MIN: Usa o teep sempre que o oponente avança.', img: IMG.kick },
    { id: 'mf10', type: 'tech', name: 'Defesa de Joelho (Empurrar)', dur: 180, desc: '3 MIN: Empurra o quadril e chuta.', img: IMG.defense },

    // =================================================================
    // ⚡ DRILLS DE VOLUME
    // =================================================================
    { id: 'dr01', type: 'tech', name: '10 Chutes Direita (Velocidade)', dur: 180, desc: '3 MIN: O mais rápido possível. Parceiro conta.', img: IMG.kick },
    { id: 'dr02', type: 'tech', name: '10 Chutes Esquerda (Velocidade)', dur: 180, desc: '3 MIN: O mais rápido possível. Parceiro conta.', img: IMG.kick },
    { id: 'dr03', type: 'tech', name: 'Pyramid Kicks (1 a 5)', dur: 180, desc: '3 MIN: 1 chute, 2 chutes... até 5 sem parar.', img: IMG.kick },
    { id: 'dr04', type: 'tech', name: 'Joelhadas no Saco (Burnout)', dur: 180, desc: '3 MIN: Segura e bate joelho sem parar.', img: IMG.knee },
    { id: 'dr05', type: 'tech', name: 'Soco Velocidade (Esticado)', dur: 180, desc: '3 MIN: Ombros queimando. Estica o braço.', img: IMG.punch },
    { id: 'dr06', type: 'tech', name: 'Teep Alternado', dur: 180, desc: '3 MIN: Esquerda e Direita sem parar.', img: IMG.kick },
    { id: 'dr07', type: 'tech', name: 'Chute + Salto + Chute', dur: 180, desc: '3 MIN: Pliometria. Chuta, salta, chuta.', img: IMG.kick },
    { id: 'dr08', type: 'tech', name: 'Sombra Completa (Alta Intensidade)', dur: 180, desc: '3 MIN: Vale tudo, velocidade máxima.', img: IMG.shadow },

    // =================================================================
    // 🏋️ FÍSICO (CONDICIONAMENTO)
    // =================================================================
    { id: 'p01', type: 'phys', name: 'Flexão de Braço', dur: 60, desc: 'Peito no chão.', img: IMG.pushup },
    { id: 'p02', type: 'phys', name: 'Abdominal Remador', dur: 60, desc: 'Estica e agrupa.', img: IMG.abs },
    { id: 'p03', type: 'phys', name: 'Burpees', dur: 45, desc: 'Explosão máxima.', img: IMG.burpee },
    { id: 'p04', type: 'phys', name: 'Prancha Frontal', dur: 60, desc: 'Isometria.', img: IMG.plank },
    { id: 'p05', type: 'phys', name: 'Agachamento Isometria', dur: 60, desc: 'Na parede.', img: IMG.squat },
    { id: 'p06', type: 'phys', name: 'Pescoço (Sim/Não)', dur: 60, desc: 'Fortalecimento.', img: IMG.abs },
    { id: 'p07', type: 'phys', name: 'Tríceps Banco', dur: 60, desc: 'Braço forte.', img: IMG.pushup },
    { id: 'p08', type: 'phys', name: 'Polichinelo Explosivo', dur: 45, desc: 'Agacha e explode.', img: IMG.jack },
    { id: 'p09', type: 'phys', name: 'Abdominal Bicicleta', dur: 60, desc: 'Cotovelo no joelho.', img: IMG.abs },
    { id: 'p10', type: 'phys', name: 'Lombar (Superman)', dur: 60, desc: 'Deitado de bruços.', img: IMG.plank },

    // =================================================================
    // 🧸 KIDS
    // =================================================================
    { id: 'f01', type: 'fun', name: 'Tocar o Ombro', dur: 180, desc: 'Defenda seu ombro.', img: IMG.shadow },
    { id: 'f02', type: 'fun', name: 'Pega-Pega Thai', dur: 180, desc: 'Quem é pego faz flexão.', img: IMG.run },
    { id: 'f03', type: 'fun', name: 'Estátua de Luta', dur: 120, desc: 'Congela na base.', img: IMG.shadow },
    { id: 'f04', type: 'fun', name: 'Corrida de Saco', dur: 120, desc: 'Pula com pés juntos.', img: IMG.jack },
    { id: 'f05', type: 'fun', name: 'Corrida das Cores', dur: 180, desc: 'Toque na cor que o prof falar.', img: IMG.run }
];