// CONFIGURAÇÃO
const State = { queue: [], students: [], savedWorkouts: {}, filter: 'all', search: '', voiceEnabled: true, wakeLock: null };
const SFX = { bell: new Audio('https://cdn.pixabay.com/audio/2021/08/04/audio_0625c1539c.mp3'), whistle: new Audio('https://cdn.pixabay.com/audio/2021/08/09/audio_00832bb584.mp3') };

// INICIALIZAR
document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('pib_students')) State.students = JSON.parse(localStorage.getItem('pib_students'));
    if (localStorage.getItem('pib_saved')) State.savedWorkouts = JSON.parse(localStorage.getItem('pib_saved'));
    renderDatabase(); SavedWorkouts.render(); Students.render();
});

// ROUTER
const Router = {
    go: (viewId) => {
        document.querySelectorAll('.view-section').forEach(el => el.classList.remove('active'));
        document.getElementById(`view-${viewId}`).classList.add('active');
        document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
        document.getElementById(`btn-nav-${viewId}`).classList.add('active');
    }
};

// UI UTILS
const UI = {
    showDb: () => {
        document.getElementById('area-db').style.display = 'block'; document.getElementById('area-saved').style.display = 'none';
        document.getElementById('db-list').style.display = 'flex'; document.getElementById('saved-list').style.display = 'none';
        document.getElementById('tab-db').classList.add('active'); document.getElementById('tab-saved').classList.remove('active');
    },
    showSaved: () => {
        document.getElementById('area-db').style.display = 'none'; document.getElementById('area-saved').style.display = 'block';
        document.getElementById('db-list').style.display = 'none'; document.getElementById('saved-list').style.display = 'flex';
        document.getElementById('tab-db').classList.remove('active'); document.getElementById('tab-saved').classList.add('active');
        SavedWorkouts.render();
    }
};

// --- MÓDULO AULA ---
function renderDatabase() {
    const list = document.getElementById('db-list'); list.innerHTML = '';
    const filtered = EXERCISE_DB.filter(ex => (State.filter === 'all' || ex.type === State.filter) && ex.name.toLowerCase().includes(State.search.toLowerCase()));
    filtered.forEach(ex => {
        const div = document.createElement('div'); div.className = `card type-${ex.type}`; div.onclick = () => addToQueue(ex);
        const thumb = `<img src="${ex.img || IMG.shadow}" style="width:30px;height:30px;border-radius:4px;object-fit:cover;margin-right:10px">`;
        div.innerHTML = `<div style="display:flex;align-items:center">${thumb}<div class="card-info"><h4>${ex.name}</h4><p>${ex.desc.substring(0, 30)}...</p></div></div><div class="card-meta">${ex.dur}s <i class="fa-solid fa-plus"></i></div>`;
        list.appendChild(div);
    });
}
function setFilter(t) { State.filter = t; document.querySelectorAll('.chip').forEach(c => c.classList.remove('active')); event.target.classList.add('active'); renderDatabase(); }
function setSearch(v) { State.search = v; renderDatabase(); }
function addToQueue(ex) { State.queue.push({ ...ex, uid: Math.random() }); updateTimeline(); setTimeout(() => { const el = document.getElementById('timeline-list'); if (el) el.scrollTop = 10000; }, 50); }
function addRest() { addToQueue({ id: 'r', type: 'rest', name: 'Pausa Água', dur: 60, desc: 'Hidratação', img: IMG.water }); }
function removeFromQueue(uid) { State.queue = State.queue.filter(i => i.uid !== uid); updateTimeline(); }
function clearQueue() { if (confirm('Limpar?')) { State.queue = []; updateTimeline(); } }

function updateTimeline() {
    const list = document.getElementById('timeline-list'); list.innerHTML = ''; let totalSec = 0;
    if (State.queue.length === 0) list.innerHTML = '<div style="text-align:center;padding:30px;color:#666">Lista vazia.</div>';
    State.queue.forEach((ex, i) => {
        totalSec += ex.dur;
        const div = document.createElement('div'); div.className = `card timeline-item type-${ex.type}`;
        // Ícones Especiais
        let iconHtml = `<b>${i + 1}</b>`;
        if (ex.id === 'setup' || ex.id === 'explain_next') iconHtml = '<i class="fa-solid fa-chalkboard-user"></i>';
        if (ex.id === 'partner_switch') iconHtml = '<i class="fa-solid fa-people-arrows"></i>';
        if (ex.type === 'rest') iconHtml = '<i class="fa-solid fa-glass-water"></i>';

        div.innerHTML = `<div style="display:flex;align-items:center;gap:10px;flex:1"><div class="timeline-idx" style="background:${ex.type === 'rest' ? '#fff' : 'var(--primary)'};color:#000">${iconHtml}</div><div class="card-info"><h4 style="${ex.type === 'rest' ? 'color:var(--primary)' : ''}">${ex.name}</h4><p>${ex.dur}s</p></div></div><button class="btn-delete-card" onclick="removeFromQueue(${ex.uid})"><i class="fa-solid fa-trash"></i></button>`;
        list.appendChild(div);
    });
    document.getElementById('total-time').innerText = `${Math.floor(totalSec / 60)} min`;
}

// --- GERADOR COMPLEXO (CICLO 17 MINUTOS) ---
function generateWorkout() {
    const mode = document.getElementById('gen-mode').value;
    const totalTime = parseInt(document.getElementById('gen-time').value) * 60;
    let curTime = 0;
    State.queue = [];
    const getRnd = (t) => {
        const l = EXERCISE_DB.filter(e => e.type === t);
        if (l.length === 0) return EXERCISE_DB[0];
        return l[Math.floor(Math.random() * l.length)];
    };

    // 1. AQUECIMENTO (15% do tempo)
    const warmupLimit = totalTime * 0.15;
    while (curTime < warmupLimit) {
        const ex = getRnd('warmup');
        State.queue.push({ ...ex, uid: Math.random() });
        // PAUSA 20S OBRIGATÓRIA
        const r20 = EXERCISE_DB.find(e => e.id === 'rest_20');
        if (r20) State.queue.push({ ...r20, uid: Math.random() });
        curTime += (ex.dur + 20);
    }

    // 2. PRIMEIRA EXPLICAÇÃO (3 MINUTOS = 180s)
    const setup = EXERCISE_DB.find(e => e.id === 'setup');
    if (setup) { State.queue.push({ ...setup, uid: Math.random() }); curTime += setup.dur; }

    // 3. TÉCNICA (CICLO COMPLETO DE 17 MINUTOS)
    // Estrutura: A(3m+3m) -> Troca(2m) -> B(3m+3m) -> Explica(3m)
    const techLimit = totalTime - 300; // Tira final

    while (curTime < techLimit) {
        let type = 'tech';
        if (mode === 'cardio') type = Math.random() > 0.3 ? 'phys' : 'tech';

        const originalEx = getRnd(type);

        // PARTE 1: ALUNO A (6 min)
        const part1a = { ...originalEx, name: "ALUNO A: " + originalEx.name + " (Base 1)", dur: 180, desc: "3 min: Fazer na base principal." };
        const part1b = { ...originalEx, name: "ALUNO A: " + originalEx.name + " (Base 2)", dur: 180, desc: "3 min: Fazer na base trocada." };

        // PARTE 2: TROCA (2 min)
        const switchEx = EXERCISE_DB.find(e => e.id === 'partner_switch');

        // PARTE 3: ALUNO B (6 min)
        const part2a = { ...originalEx, name: "ALUNO B: " + originalEx.name + " (Base 1)", dur: 180, desc: "3 min: Agora o outro faz." };
        const part2b = { ...originalEx, name: "ALUNO B: " + originalEx.name + " (Base 2)", dur: 180, desc: "3 min: Base trocada." };

        // PARTE 4: EXPLICAÇÃO PRÓXIMA (3 min)
        const explain = EXERCISE_DB.find(e => e.id === 'explain_next');

        // Custo total do bloco = 180+180 + 120 + 180+180 + 180 = 1020s (17 min)
        // Só adiciona se couber pelo menos a parte do treino (sem contar a explicação final se acabar o tempo)
        if ((curTime + 840) <= techLimit) {
            State.queue.push({ ...part1a, uid: Math.random() });
            State.queue.push({ ...part1b, uid: Math.random() });
            if (switchEx) State.queue.push({ ...switchEx, uid: Math.random() });
            State.queue.push({ ...part2a, uid: Math.random() });
            State.queue.push({ ...part2b, uid: Math.random() });

            curTime += 840; // 14 min de ação

            // Se ainda tiver tempo, põe a explicação da próxima
            if ((curTime + 180) <= techLimit) {
                if (explain) State.queue.push({ ...explain, uid: Math.random() });
                curTime += 180;
            } else {
                break; // Acabou o tempo, sai do loop
            }
        } else {
            break; // Não cabe mais um ciclo inteiro
        }
    }

    // 4. FINAL
    const cool = EXERCISE_DB.find(e => e.id === 'z2');
    if (cool) State.queue.push({ ...cool, uid: Math.random() });

    updateTimeline();
}

// --- FUNÇÃO WHATSAPP PRO ---
function shareToWhatsapp() {
    if (State.queue.length === 0) return alert('Vazio!');
    let text = "*🥊 PIB MUAI THAY - PLANO DE AULA*\n\n";

    State.queue.forEach((ex, i) => {
        const timeStr = ex.dur >= 60 ? Math.floor(ex.dur / 60) + 'm' : ex.dur + 's';

        if (ex.id === 'setup' || ex.id === 'explain_next') {
            text += `\n🗣️ *${ex.name} (${timeStr})*\n`;
        } else if (ex.id === 'partner_switch') {
            text += `🔄 *${ex.name} (${timeStr})*\n`;
        } else if (ex.type === 'rest') {
            text += `   💧 _${ex.name} (${timeStr})_\n`;
        } else {
            text += `✅ ${i + 1}. *${ex.name}* (${timeStr})\n`;
        }
    });

    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    const link = document.createElement('a'); link.href = url; link.target = '_blank'; document.body.appendChild(link); link.click(); document.body.removeChild(link);
}

// --- PLAYER ---
const Player = {
    idx: 0, timer: null, timeLeft: 0, totalDur: 0, isRunning: false,
    open: () => { if (State.queue.length === 0) return alert('Monte o treino!'); Player.idx = 0; document.getElementById('player').style.display = 'flex'; try { if ('wakeLock' in navigator) navigator.wakeLock.request('screen'); } catch (e) { } Player.loadCard(); },
    close: () => { Player.pause(); document.getElementById('player').style.display = 'none'; window.speechSynthesis.cancel(); },
    toggle: () => { if (Player.isRunning) Player.pause(); else Player.play(); },
    play: () => {
        Player.isRunning = true;
        document.getElementById('btn-play-pause').innerHTML = '<i class="fa-solid fa-pause"></i>';
        Player.timer = setInterval(() => {
            Player.timeLeft--;
            Player.updateDisplay();
            if (Player.timeLeft <= 0) Player.next();
        }, 1000);
    },
    pause: () => {
        Player.isRunning = false;
        clearInterval(Player.timer);
        document.getElementById('btn-play-pause').innerHTML = '<i class="fa-solid fa-play"></i>';
    },
    next: () => {
        if (Player.idx < State.queue.length - 1) { Player.idx++; Player.loadCard(); Player.play(); }
        else { Player.close(); SFX.bell.play(); alert('Fim!'); }
    },
    prev: () => { if (Player.idx > 0) { Player.idx--; Player.loadCard(); } },
    loadCard: () => {
        const ex = State.queue[Player.idx];
        document.getElementById('p-title').innerText = ex.name;
        document.getElementById('p-desc').innerText = ex.desc;
        document.getElementById('p-round-count').innerText = `${Player.idx + 1}/${State.queue.length}`;

        const imgBox = document.getElementById('p-image-box');
        const iconBox = document.getElementById('p-icon-box');
        if (ex.img) {
            imgBox.style.display = 'block'; iconBox.style.display = 'none';
            imgBox.innerHTML = `<img src="${ex.img}" style="max-height:250px; border-radius:10px; border:3px solid var(--primary);" onerror="this.parentElement.style.display='none'; document.getElementById('p-icon-box').style.display='flex';">`;
        } else {
            imgBox.style.display = 'none'; iconBox.style.display = 'flex';
        }

        const isRest = ex.type === 'rest';
        const tag = document.getElementById('p-tag');
        tag.innerText = isRest ? "DESCANSO/INSTR." : "AÇÃO";
        tag.style.background = isRest ? "#fff" : "var(--primary)";

        Player.speak(isRest ? "Atenção. " + ex.name : "Atenção. " + ex.name);
        if (isRest) SFX.whistle.play(); else SFX.bell.play();

        Player.timeLeft = ex.dur; Player.totalDur = ex.dur; Player.updateDisplay(); Player.pause();
    },
    updateDisplay: () => {
        const m = Math.floor(Player.timeLeft / 60); const s = Player.timeLeft % 60;
        document.getElementById('p-timer').innerText = `${m}:${s < 10 ? '0' + s : s}`;
        document.getElementById('p-bar-fill').style.width = `${(Player.timeLeft / Player.totalDur) * 100}%`;
    },
    speak: (txt) => {
        if (State.voiceEnabled) { window.speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(txt); u.lang = 'pt-BR'; u.rate = 1.1; window.speechSynthesis.speak(u); }
    }
};
function toggleVoice() { State.voiceEnabled = !State.voiceEnabled; document.getElementById('btn-voice').style.opacity = State.voiceEnabled ? '1' : '0.4'; }

// --- SPARRING, ALUNOS & SALVOS (MANTIDOS) ---
// (Copiar as funções Sparring, Students e SavedWorkouts da versão anterior ou manter se já estiverem no arquivo)
// Vou incluir as versões curtas para garantir que o código funcione:

const Sparring = { timer: null, timeLeft: 0, state: 'rest', round: 0, start: () => { Sparring.round = 0; Sparring.next('fight'); if ('wakeLock' in navigator) navigator.wakeLock.request('screen').catch(e => { }); }, next: (ph) => { Sparring.state = ph; const bg = document.getElementById('sp-bg'); if (ph === 'fight') { Sparring.timeLeft = document.getElementById('sp-round').value; bg.className = 'sparring-display fighting'; Sparring.round++; document.getElementById('sp-round-counter').innerText = `Round ${Sparring.round}`; document.getElementById('sp-status').innerText = "LUTAR!"; SFX.bell.play(); } else { Sparring.timeLeft = document.getElementById('sp-rest').value; bg.className = 'sparring-display resting'; document.getElementById('sp-status').innerText = "DESCANSO"; SFX.whistle.play(); } Sparring.play(); }, toggle: () => { if (Sparring.timer) Sparring.pause(); else Sparring.play(); }, play: () => { if (Sparring.timer) clearInterval(Sparring.timer); Sparring.timer = setInterval(() => { Sparring.timeLeft--; const m = Math.floor(Sparring.timeLeft / 60), s = Sparring.timeLeft % 60; document.getElementById('sp-timer').innerText = `${m}:${s < 10 ? '0' + s : s}`; if (Sparring.timeLeft <= 0) Sparring.next(Sparring.state === 'fight' ? 'rest' : 'fight'); }, 1000); }, pause: () => { clearInterval(Sparring.timer); Sparring.timer = null; }, reset: () => { Sparring.pause(); document.getElementById('sp-bg').className = 'sparring-display'; document.getElementById('sp-timer').innerText = '00:00'; document.getElementById('sp-status').innerText = 'PRONTO'; } };
const Students = { add: () => { const n = document.getElementById('new-student-name').value.trim(); if (!n) return; State.students.push({ id: Date.now(), name: n, classes: 0, belt: BELT_SYSTEM[0] }); Students.save(); document.getElementById('new-student-name').value = ''; Students.render(); }, save: () => { localStorage.setItem('pib_students', JSON.stringify(State.students)); }, mark: (id) => { const s = State.students.find(x => x.id === id); if (s) { s.classes++; s.belt = calculateBelt(s.classes); Students.save(); Students.render(); alert('+1 Presença!'); } }, del: (id) => { if (confirm('Apagar?')) { State.students = State.students.filter(x => x.id !== id); Students.save(); Students.render(); } }, render: () => { const l = document.getElementById('students-list'); l.innerHTML = ''; State.students.forEach(s => { s.belt = calculateBelt(s.classes); const idx = BELT_SYSTEM.indexOf(s.belt); const next = BELT_SYSTEM[idx + 1]; const prog = next ? ((s.classes - s.belt.min) / (next.min - s.belt.min)) * 100 : 100; const div = document.createElement('div'); div.className = 'student-card'; div.innerHTML = `<h4 style="color:#fff">${s.name}</h4><div class="student-stats"><span>${s.belt.name}</span><span>${s.classes} Aulas</span></div><div class="student-belt"><div class="belt-fill" style="width:${prog}%;background:${s.belt.color}"></div></div><div style="display:flex;gap:5px"><button onclick="Students.mark(${s.id})" class="btn-action" style="flex:1;font-size:0.8rem">+ PRESENÇA</button><button onclick="Students.del(${s.id})" class="btn-delete-card"><i class="fa-solid fa-trash"></i></button></div>`; l.appendChild(div); }); } };
function calculateBelt(c) { return [...BELT_SYSTEM].reverse().find(b => c >= b.min) || BELT_SYSTEM[0]; }
const SavedWorkouts = { save: () => { const n = document.getElementById('save-name').value; if (!n || State.queue.length === 0) return alert('Erro'); State.savedWorkouts[n] = State.queue; localStorage.setItem('pib_saved', JSON.stringify(State.savedWorkouts)); alert('Salvo!'); UI.showSaved(); }, load: (n) => { if (confirm('Carregar?')) { State.queue = State.savedWorkouts[n]; updateTimeline(); Router.go('workout'); } }, del: (n) => { if (confirm('Apagar?')) { delete State.savedWorkouts[n]; localStorage.setItem('pib_saved', JSON.stringify(State.savedWorkouts)); SavedWorkouts.render(); } }, render: () => { const l = document.getElementById('saved-list'); l.innerHTML = ''; Object.keys(State.savedWorkouts).forEach(n => { const div = document.createElement('div'); div.className = 'card'; div.innerHTML = `<div onclick="SavedWorkouts.load('${n}')" style="flex:1"><h4 style="color:var(--primary)">${n}</h4><p>${State.savedWorkouts[n].length} items</p></div><button class="btn-delete-card" onclick="SavedWorkouts.del('${n}')"><i class="fa-solid fa-trash"></i></button>`; l.appendChild(div); }); } };