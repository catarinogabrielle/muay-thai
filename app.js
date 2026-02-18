const DB = {
    hands: ['Jab', 'Direto', 'Cruzado', 'Uppercut', 'Soco Giratório', 'Cotovelo Circular', 'Cotovelo Descendente', 'Cotovelo Ascendente', 'Cotovelo Giratório', 'Cotovelo Frontal', 'Clinche (Trava Dupla)', 'Clinche (Trava Simples)', 'Soco em salto', 'Esgrima', 'Controle de Braço/Cotovelo', 'Clinche (De Lado)', 'Desequilíbrios e Projeções'],
    legs: ['Low Kick', 'Mid Kick', 'High Kick', 'Joelhada Direta', 'Joelhada Lateral', 'Joelhada em Clinche', 'Joelhada Voadora', 'Step', 'Teep da Perna da Frente', 'Teep da Perna de Trás', 'Teep com Step', 'Teep Falso (Finta)', 'Teep Lateral'],
    def: ['Bloqueio de Canela', 'Bloqueio de Chute Alto', 'Lean Back (Recuo de Tronco)', 'Dump / Esquiva de Soco', 'Pivot (Rotação de Quadril)', 'Passo atrás', 'Pêndulo', 'Toreada', 'Catada de Chute', 'Saída Lateral', 'Teep de Bloqueio', 'Bloqueio de Chute Frontal', 'Bloqueio de Cruzado/Gancho', 'Bloqueio de Soco Direto', 'Deslizamento (Footwork)']
};

const PHYS_DB = [
    'Abdominal Remador', 'Abdominal Supra', 'Abdominal Infra', 'Prancha Isométrica',
    'Flexão de Braço', 'Agachamento', 'Polichinelo', 'Burpee', 'Afundo', 'Mountain Climber'
];

const WARMUP_DB = [
    'Pular Corda', 'Corrida', 'Polichinelo', 'Corrida Joelho Alto',
    'Agachamento com pulo', 'Sprawl', 'Burpee'
];

const SOUNDS = {
    bell: new Audio('https://cdn.pixabay.com/audio/2021/08/04/audio_0625c1539c.mp3'),
    alert: new Audio('https://cdn.pixabay.com/audio/2022/03/15/audio_7314787167.mp3')
};

let State = {
    queue: [],
    combo: [],
    voice: false,
    physSelected: [],
    warmupSelected: []
};

document.addEventListener('DOMContentLoaded', () => {
    loadTab('hands');
    renderTimeline();
    if (!('speechSynthesis' in window)) {
        document.getElementById('btn-voice').style.display = 'none';
    }
});

function toggleVoice() {
    State.voice = !State.voice;
    const btn = document.getElementById('btn-voice');
    const icon = btn.querySelector('i');
    if (State.voice) {
        btn.classList.add('active');
        icon.className = 'fa-solid fa-volume-high';
        speak("Voz ativada");
    } else {
        btn.classList.remove('active');
        icon.className = 'fa-solid fa-volume-xmark';
        window.speechSynthesis.cancel();
    }
}

function speak(text) {
    if (!State.voice) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'pt-BR';
    utterance.rate = 1.1;
    const voices = window.speechSynthesis.getVoices();
    const ptVoice = voices.find(v => v.lang.includes('pt-BR') || v.lang.includes('pt_BR'));
    if (ptVoice) utterance.voice = ptVoice;
    window.speechSynthesis.speak(utterance);
}

function loadTab(cat) {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    const btns = Array.from(document.querySelectorAll('.tab-btn'));
    if (cat === 'hands') btns[0].classList.add('active');
    if (cat === 'legs') btns[1].classList.add('active');
    if (cat === 'def') btns[2].classList.add('active');

    const grid = document.getElementById('tech-grid');
    grid.innerHTML = '';
    DB[cat].forEach(name => {
        const btn = document.createElement('div');
        btn.className = 'btn-tech';
        btn.innerHTML = `<span>${name}</span> <i class="fa-solid fa-plus"></i>`;
        btn.onclick = () => addToCombo(name);
        grid.appendChild(btn);
    });
}

function addToCombo(name) {
    State.combo.push(name);
    updateComboDisplay();
}

function clearCombo() {
    State.combo = [];
    updateComboDisplay();
}

function updateComboDisplay() {
    const d = document.getElementById('combo-display');
    if (State.combo.length === 0) {
        d.innerText = 'Selecione as técnicas abaixo...';
        d.className = 'combo-display empty';
    } else {
        d.innerText = State.combo.join(' + ');
        d.className = 'combo-display';
    }
}

function submitCombo() {
    if (State.combo.length === 0) return System.show("Monte uma sequência primeiro!");
    const name = State.combo.join(' + ');
    const uid = Math.random();
    const block = [
        { uid: Math.random(), name: `A: ${name}`, dur: 120, type: 'tech' },
        { uid: Math.random(), name: `A: ${name} (Inverter)`, dur: 120, type: 'tech' },
        { uid: Math.random(), name: 'TROCA DE FUNÇÃO', dur: 60, type: 'rest' },
        { uid: Math.random(), name: `B: ${name}`, dur: 120, type: 'tech' },
        { uid: Math.random(), name: `B: ${name} (Inverter)`, dur: 120, type: 'tech' }
    ];
    State.queue.push(...block);
    clearCombo();
    renderTimeline();
}

function addStructure(type) {
    const map = {
        water: { name: 'ÁGUA', dur: 30, type: 'rest' },
        preparation: { name: 'PREPARAÇÃO', dur: 120, type: 'rest' }
    };
    if (map[type]) {
        State.queue.push({ ...map[type], uid: Math.random() });
        renderTimeline();
    }
}

function renderTimeline() {
    const list = document.getElementById('timeline');
    list.innerHTML = '';
    let total = 0;
    if (State.queue.length === 0) {
        list.innerHTML = '<div class="empty-msg">O treino está vazio.</div>';
        document.getElementById('total-time').innerText = '0 min';
        return;
    }
    State.queue.forEach(item => {
        total += item.dur;
        const card = document.createElement('div');
        card.className = `card ${item.type}`;
        let icon = 'fa-fire';
        if (item.type === 'rest') icon = 'fa-clock';
        if (item.type === 'warmup') icon = 'fa-person-running';
        if (item.type === 'phys') icon = 'fa-dumbbell';
        card.innerHTML = `
            <div class="card-icon"><i class="fa-solid ${icon}"></i></div>
            <div class="card-info">
                <h4>${item.name}</h4>
                <p>${Math.floor(item.dur / 60)}m ${item.dur % 60}s</p>
            </div>
            <button class="card-del" onclick="removeItem(${item.uid})"><i class="fa-solid fa-trash"></i></button>
        `;
        list.appendChild(card);
    });
    document.getElementById('total-time').innerText = Math.round(total / 60) + ' min';
}

function removeItem(uid) {
    State.queue = State.queue.filter(i => i.uid !== uid);
    renderTimeline();
}

function clearQueue() {
    if (State.queue.length === 0) return;
    System.confirm("Apagar todo o treino?", () => {
        State.queue = [];
        renderTimeline();
    });
}

function shareToWhatsapp() {
    if (State.queue.length === 0) return System.show("A lista está vazia! Monte o treino primeiro.", 'error');

    let text = "*🥊 MUAY THAI STUDIO - TREINO DO DIA 🥊*\n";
    text += `🗓️ Data: ${new Date().toLocaleDateString('pt-BR')}\n`;
    text += `⏱️ Duração Total: ${document.getElementById('total-time').innerText}\n`;
    text += "━━━━━━━━━━━━━━━━━━━━\n\n";

    State.queue.forEach((item, index) => {
        let icon = '👉';

        if (item.type === 'warmup') icon = '🔥';
        else if (item.type === 'tech') icon = '🥊';
        else if (item.type === 'phys') icon = '💪';
        else if (item.type === 'rest') icon = '💧';

        let timeLabel = item.dur >= 60
            ? `${Math.floor(item.dur / 60)} min`
            : `${item.dur} seg`;

        if (item.type === 'rest') {
            text += `-----------------------------------\n`;
            text += `${icon} *PAUSA / ÁGUA* (${timeLabel})\n`;
            text += `-----------------------------------\n`;
        } else {
            text += `${icon} *${item.name}*\n`;
            text += `   └ ⏳ Tempo: ${timeLabel}\n\n`;
        }
    });

    text += "━━━━━━━━━━━━━━━━━━━━\n";
    text += "*BOM TREINO!* 🙏";

    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
}

function openWarmupModal() {
    State.warmupSelected = [];
    const grid = document.getElementById('warmup-list');
    grid.innerHTML = '';

    WARMUP_DB.forEach(name => {
        const btn = document.createElement('div');
        btn.className = 'phys-opt';
        btn.innerText = name;
        btn.onclick = () => {
            if (State.warmupSelected.includes(name)) {
                State.warmupSelected = State.warmupSelected.filter(i => i !== name);
                btn.classList.remove('selected-warmup');
            } else {
                State.warmupSelected.push(name);
                btn.classList.add('selected-warmup');
            }
        };
        grid.appendChild(btn);
    });
    document.getElementById('warmup-modal').style.display = 'flex';
}

function closeWarmupModal() { document.getElementById('warmup-modal').style.display = 'none'; }

function addWarmupExercises() {
    if (State.warmupSelected.length === 0) return System.show("Selecione algo!");
    const dur = parseInt(document.getElementById('warmup-time').value);

    State.warmupSelected.forEach(name => {
        State.queue.push({ uid: Math.random(), name: name.toUpperCase(), dur: dur, type: 'warmup' });
    });
    closeWarmupModal();
    renderTimeline();
}

function openPhysModal() {
    State.physSelected = [];
    const grid = document.getElementById('phys-list');
    grid.innerHTML = '';

    PHYS_DB.forEach(name => {
        const btn = document.createElement('div');
        btn.className = 'phys-opt';
        btn.innerText = name;
        btn.onclick = () => {
            if (State.physSelected.includes(name)) {
                State.physSelected = State.physSelected.filter(i => i !== name);
                btn.classList.remove('selected');
            } else {
                State.physSelected.push(name);
                btn.classList.add('selected');
            }
        };
        grid.appendChild(btn);
    });
    document.getElementById('phys-modal').style.display = 'flex';
}

function closePhysModal() { document.getElementById('phys-modal').style.display = 'none'; }

function addPhysExercises() {
    if (State.physSelected.length === 0) return System.show("Selecione algum exercício!");
    const dur = parseInt(document.getElementById('phys-time').value);

    State.physSelected.forEach(name => {
        State.queue.push({ uid: Math.random(), name: name.toUpperCase(), dur: dur, type: 'phys' });
    });
    closePhysModal();
    renderTimeline();
}

const Player = {
    idx: 0, timer: null, timeLeft: 0, total: 0,
    open: () => {
        if (State.queue.length === 0) return System.show("Lista vazia!");
        document.getElementById('player-modal').style.display = 'flex';
        Player.idx = 0; Player.load();
    },
    load: () => {
        const item = State.queue[Player.idx];
        document.getElementById('p-title').innerText = item.name;
        Player.timeLeft = item.dur;
        Player.total = item.dur;
        let c = '#ffd700';
        let tagTxt = 'TREINO';
        if (item.type === 'rest') { c = '#00a8ff'; tagTxt = 'DESCANSO'; }
        if (item.type === 'phys') { c = '#eb4d4b'; tagTxt = 'FÍSICO'; }
        if (item.type === 'warmup') { c = '#ff9f43'; tagTxt = 'AQUECIMENTO'; }
        const pTag = document.getElementById('p-tag');
        pTag.style.background = c;
        pTag.innerText = tagTxt;
        document.getElementById('p-bar').style.background = c;
        Player.update();
        SOUNDS.bell.play();
        speak(item.name);
    },
    update: () => {
        const m = Math.floor(Player.timeLeft / 60);
        const s = Player.timeLeft % 60;
        document.getElementById('p-timer').innerText = `${m}:${s.toString().padStart(2, '0')}`;
        document.getElementById('p-bar').style.width = ((Player.timeLeft / Player.total) * 100) + '%';
    },
    toggle: () => {
        if (Player.timer) {
            clearInterval(Player.timer); Player.timer = null;
            document.getElementById('p-play-btn').innerHTML = '<i class="fa-solid fa-play"></i>';
        } else {
            Player.timer = setInterval(() => {
                if (Player.timeLeft > 0) {
                    Player.timeLeft--; Player.update();
                    if (Player.timeLeft <= 3 && Player.timeLeft > 0) SOUNDS.alert.play();
                } else {
                    Player.next();
                }
            }, 1000);
            document.getElementById('p-play-btn').innerHTML = '<i class="fa-solid fa-pause"></i>';
        }
    },
    next: () => {
        clearInterval(Player.timer); Player.timer = null;
        if (Player.idx < State.queue.length - 1) {
            Player.idx++; Player.load(); Player.toggle();
        } else {
            Player.close(); System.show("Treino Finalizado!");
        }
    },
    prev: () => {
        if (Player.idx > 0) {
            clearInterval(Player.timer); Player.timer = null;
            Player.idx--; Player.load(); Player.toggle();
        }
    },
    close: () => {
        clearInterval(Player.timer); Player.timer = null;
        document.getElementById('player-modal').style.display = 'none';
        window.speechSynthesis.cancel();
    }
};

const System = {
    show: (msg) => {
        document.getElementById('sys-msg').innerText = msg;
        document.getElementById('sys-cancel').style.display = 'none';
        const btnOk = document.getElementById('sys-ok');
        btnOk.innerText = 'OK';
        btnOk.onclick = () => System.close();
        document.getElementById('sys-modal').style.display = 'flex';
    },
    confirm: (msg, cb) => {
        document.getElementById('sys-msg').innerText = msg;
        document.getElementById('sys-cancel').style.display = 'block';
        const btnOk = document.getElementById('sys-ok');
        btnOk.innerText = 'CONFIRMAR';
        btnOk.onclick = () => { cb(); System.close(); };
        document.getElementById('sys-modal').style.display = 'flex';
    },
    close: () => document.getElementById('sys-modal').style.display = 'none'
};