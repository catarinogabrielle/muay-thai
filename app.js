const System = {
    show: (msg, type = 'info') => {
        const modal = document.getElementById('sys-modal');
        document.getElementById('sys-modal-title').innerText = type === 'error' ? 'Erro' : 'Aviso';
        document.getElementById('sys-modal-msg').innerText = msg;

        document.getElementById('sys-modal-input').style.display = 'none';
        document.getElementById('sys-btn-cancel').style.display = 'none';

        const btnOk = document.getElementById('sys-btn-ok');
        btnOk.innerText = 'OK';
        btnOk.onclick = () => System.close();

        modal.style.display = 'flex';
    },

    confirm: (msg, onConfirm) => {
        const modal = document.getElementById('sys-modal');
        document.getElementById('sys-modal-title').innerText = 'Confirmação';
        document.getElementById('sys-modal-msg').innerText = msg;

        document.getElementById('sys-modal-input').style.display = 'none';
        document.getElementById('sys-btn-cancel').style.display = 'block';

        const btnOk = document.getElementById('sys-btn-ok');
        btnOk.innerText = 'CONFIRMAR';
        btnOk.onclick = () => {
            System.close();
            onConfirm();
        };

        modal.style.display = 'flex';
    },

    input: (msg, onConfirm) => {
        const modal = document.getElementById('sys-modal');
        const inputField = document.getElementById('sys-modal-input');

        document.getElementById('sys-modal-title').innerText = 'Digitar';
        document.getElementById('sys-modal-msg').innerText = msg;

        inputField.style.display = 'block';
        inputField.value = '';
        document.getElementById('sys-btn-cancel').style.display = 'block';

        const btnOk = document.getElementById('sys-btn-ok');
        btnOk.innerText = 'SALVAR';

        btnOk.onclick = () => {
            const val = inputField.value.trim();
            if (val) {
                System.close();
                onConfirm(val);
            } else {
                inputField.style.borderColor = 'red';
            }
        };

        modal.style.display = 'flex';
        inputField.focus();
    },

    close: () => {
        document.getElementById('sys-modal').style.display = 'none';
    }
};

const State = {
    queue: [],
    students: [],
    savedWorkouts: {},
    filter: 'all',
    search: '',
    voiceEnabled: true,
    wakeLock: null
};

const SFX = {
    bell: new Audio('https://cdn.pixabay.com/audio/2021/08/04/audio_0625c1539c.mp3'),
    whistle: new Audio('https://cdn.pixabay.com/audio/2021/08/09/audio_00832bb584.mp3')
};

document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('pib_students')) {
        State.students = JSON.parse(localStorage.getItem('pib_students'));
    }
    if (localStorage.getItem('pib_saved')) {
        State.savedWorkouts = JSON.parse(localStorage.getItem('pib_saved'));
    }
    renderDatabase();
    SavedWorkouts.render();
    Students.render();
});

const Router = {
    go: (viewId) => {
        document.querySelectorAll('.view-section').forEach(el => el.classList.remove('active'));
        document.getElementById(`view-${viewId}`).classList.add('active');
        document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
        document.getElementById(`btn-nav-${viewId}`).classList.add('active');
    }
};

const UI = {
    showDb: () => {
        document.getElementById('area-db').style.display = 'block';
        document.getElementById('area-saved').style.display = 'none';
        document.getElementById('db-list').style.display = 'flex';
        document.getElementById('saved-list').style.display = 'none';
        document.getElementById('tab-db').classList.add('active');
        document.getElementById('tab-saved').classList.remove('active');
    },
    showSaved: () => {
        document.getElementById('area-db').style.display = 'none';
        document.getElementById('area-saved').style.display = 'block';
        document.getElementById('db-list').style.display = 'none';
        document.getElementById('saved-list').style.display = 'flex';
        document.getElementById('tab-db').classList.remove('active');
        document.getElementById('tab-saved').classList.add('active');
        SavedWorkouts.render();
    }
};

function renderDatabase() {
    const list = document.getElementById('db-list');
    list.innerHTML = '';
    const filtered = EXERCISE_DB.filter(ex => (State.filter === 'all' || ex.type === State.filter) && ex.name.toLowerCase().includes(State.search.toLowerCase()));

    filtered.forEach(ex => {
        const div = document.createElement('div');
        div.className = `card type-${ex.type}`;
        div.onclick = () => addToQueue(ex);
        const thumb = `<img src="${ex.img || IMG.shadow}" style="width:30px; height:30px; border-radius:4px; object-fit:cover; margin-right:10px;">`;
        div.innerHTML = `
            <div style="display:flex; align-items:center">
                ${thumb}
                <div class="card-info"><h4>${ex.name}</h4><p>${ex.desc.substring(0, 30)}...</p></div>
            </div>
            <div class="card-meta">${ex.dur}s <i class="fa-solid fa-plus"></i></div>
        `;
        list.appendChild(div);
    });
}

function setFilter(t) {
    State.filter = t;
    document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
    event.target.classList.add('active');
    renderDatabase();
}

function setSearch(v) {
    State.search = v;
    renderDatabase();
}

function addToQueue(ex) {
    State.queue.push({ ...ex, uid: Math.random() });
    updateTimeline();
    setTimeout(() => {
        const el = document.getElementById('timeline-list');
        if (el) el.scrollTop = 10000;
    }, 50);
}

function addRest() {
    addToQueue({
        id: 'r_manual',
        type: 'rest',
        name: 'Pausa Água',
        dur: 60,
        desc: 'Hidratação.',
        img: IMG.water
    });
}

function removeFromQueue(uid) {
    State.queue = State.queue.filter(i => i.uid !== uid);
    updateTimeline();
}

function clearQueue() {
    System.confirm('Deseja limpar toda a lista?', () => {
        State.queue = [];
        updateTimeline();
    });
}

function updateTimeline() {
    const list = document.getElementById('timeline-list');
    list.innerHTML = '';
    let totalSec = 0;
    if (State.queue.length === 0) list.innerHTML = '<div style="text-align:center; padding:30px; color:#666">Lista vazia.</div>';

    State.queue.forEach((ex, i) => {
        totalSec += ex.dur;
        const div = document.createElement('div');
        div.className = `card timeline-item type-${ex.type}`;

        let iconHtml = `<b>${i + 1}</b>`;
        if (ex.id === 'setup' || ex.id === 'explain_next') iconHtml = '<i class="fa-solid fa-chalkboard-user"></i>';
        if (ex.id === 'partner_switch') iconHtml = '<i class="fa-solid fa-people-arrows"></i>';
        if (ex.type === 'rest') iconHtml = '<i class="fa-solid fa-glass-water"></i>';

        div.innerHTML = `
            <div style="display:flex; align-items:center; gap:10px; flex:1">
                <div class="timeline-idx" style="background:${ex.type === 'rest' ? '#fff' : 'var(--primary)'}; color:#000">${iconHtml}</div>
                <div class="card-info">
                    <h4 style="${ex.type === 'rest' ? 'color:var(--primary)' : ''}">${ex.name}</h4>
                    <p>${ex.dur}s</p>
                </div>
            </div>
            <button class="btn-delete-card" onclick="removeFromQueue(${ex.uid})"><i class="fa-solid fa-trash"></i></button>
        `;
        list.appendChild(div);
    });
    document.getElementById('total-time').innerText = `${Math.floor(totalSec / 60)} min`;
}

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

    const rope = EXERCISE_DB.find(e => e.id === 'w01');
    if (rope) {
        State.queue.push({ ...rope, uid: Math.random() });
        const r20 = EXERCISE_DB.find(e => e.id === 'rest_20');
        if (r20) State.queue.push({ ...r20, uid: Math.random() });
        curTime += (rope.dur + 20);
    }

    const warmupLimit = totalTime * 0.15;
    while (curTime < warmupLimit) {
        const ex = getRnd('warmup');
        if (ex.id !== 'w01') {
            State.queue.push({ ...ex, uid: Math.random() });
            const r20 = EXERCISE_DB.find(e => e.id === 'rest_20');
            if (r20) State.queue.push({ ...r20, uid: Math.random() });
            curTime += (ex.dur + 20);
        }
    }

    const techLimit = totalTime - 300;
    const setupCard = EXERCISE_DB.find(e => e.id === 'setup');
    const switchCard = EXERCISE_DB.find(e => e.id === 'partner_switch');
    const explainNext = EXERCISE_DB.find(e => e.id === 'explain_next');
    let isFirstTech = true;

    while (curTime < techLimit) {
        let type = 'tech';
        if (mode === 'cardio') type = Math.random() > 0.3 ? 'phys' : 'tech';
        if (mode === 'kids') type = 'fun';

        const baseEx = getRnd(type);
        const cycleCost = 1020;

        if ((curTime + cycleCost) <= techLimit + 120) {

            const explanation = isFirstTech ? setupCard : explainNext;
            State.queue.push({ ...explanation, uid: Math.random() });

            State.queue.push({ ...baseEx, name: `ALUNO A: ${baseEx.name}`, desc: `3 MIN: Base Destra.`, dur: 180, uid: Math.random() });
            State.queue.push({ ...baseEx, name: `ALUNO A: ${baseEx.name}`, desc: `3 MIN: Base Canhota.`, dur: 180, uid: Math.random() });

            if (switchCard) State.queue.push({ ...switchCard, uid: Math.random() });

            State.queue.push({ ...baseEx, name: `ALUNO B: ${baseEx.name}`, desc: `3 MIN: Base Destra.`, dur: 180, uid: Math.random() });
            State.queue.push({ ...baseEx, name: `ALUNO B: ${baseEx.name}`, desc: `3 MIN: Base Canhota.`, dur: 180, uid: Math.random() });

            const water = EXERCISE_DB.find(e => e.id === 'z1');
            if (water) State.queue.push({ ...water, uid: Math.random() });

            curTime += cycleCost;
            isFirstTech = false;
        } else {
            break;
        }
    }

    const cool = EXERCISE_DB.find(e => e.id === 'z2');
    if (cool) State.queue.push({ ...cool, uid: Math.random() });

    updateTimeline();
}

function shareToWhatsapp() {
    if (State.queue.length === 0) return System.show('Lista vazia!', 'error');
    let text = "*🥊 PIB MUAI THAY*\n\n";
    State.queue.forEach((ex, i) => {
        const timeStr = ex.dur >= 60 ? Math.floor(ex.dur / 60) + 'm' : ex.dur + 's';
        if (ex.id === 'setup' || ex.id === 'explain_next') text += `\n📢 *${ex.name} (${timeStr})*\n`;
        else if (ex.id === 'partner_switch') text += `🔄 *${ex.name} (${timeStr})*\n`;
        else if (ex.type === 'rest') text += `💧 _${ex.name} (${timeStr})_\n`;
        else text += `✅ ${i + 1}. ${ex.name} (${timeStr})\n`;
    });
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    document.body.appendChild(link); link.click(); document.body.removeChild(link);
}

const Player = {
    idx: 0,
    timer: null,
    timeLeft: 0,
    totalDur: 0,
    isRunning: false,

    open: () => {
        if (State.queue.length === 0) return System.show('A lista está vazia.', 'error');
        Player.idx = 0;
        document.getElementById('player').style.display = 'flex';
        try { if ('wakeLock' in navigator) navigator.wakeLock.request('screen'); } catch (e) { }
        Player.loadCard();
    },

    close: () => {
        Player.pause();
        document.getElementById('player').style.display = 'none';
        window.speechSynthesis.cancel();
    },

    toggle: () => {
        if (Player.isRunning) Player.pause();
        else Player.play();
    },

    play: () => {
        Player.isRunning = true;
        document.getElementById('btn-play-pause').innerHTML = '<i class="fa-solid fa-pause"></i>';

        if (Player.timer) clearInterval(Player.timer);

        Player.timer = setInterval(() => {
            if (Player.timeLeft > 0) {
                Player.timeLeft--;
                Player.updateDisplay();
            }

            if (Player.timeLeft <= 0) {
                clearInterval(Player.timer);
                Player.next();
            }
        }, 1000);
    },

    pause: () => {
        Player.isRunning = false;
        clearInterval(Player.timer);
        document.getElementById('btn-play-pause').innerHTML = '<i class="fa-solid fa-play"></i>';
    },

    next: () => {
        if (Player.idx < State.queue.length - 1) {
            Player.idx++;
            Player.loadCard();
            Player.play();
        } else {
            Player.close();
            SFX.bell.play();
            System.show('Treino Finalizado com Sucesso!');
        }
    },

    prev: () => {
        if (Player.idx > 0) {
            Player.idx--;
            Player.loadCard();
        }
    },

    loadCard: () => {
        const ex = State.queue[Player.idx];
        document.getElementById('p-title').innerText = ex.name;
        document.getElementById('p-desc').innerText = ex.desc;
        document.getElementById('p-round-count').innerText = `${Player.idx + 1}/${State.queue.length}`;

        const imgBox = document.getElementById('p-image-box');
        const iconBox = document.getElementById('p-icon-box');

        if (ex.img) {
            imgBox.style.display = 'block';
            iconBox.style.display = 'none';
            imgBox.innerHTML = `<img src="${ex.img}" style="max-height:250px; border-radius:10px; border:3px solid var(--primary);" onerror="this.parentElement.style.display='none'; document.getElementById('p-icon-box').style.display='flex';">`;
        } else {
            imgBox.style.display = 'none';
            iconBox.style.display = 'flex';
        }

        const isRest = ex.type === 'rest';
        const tag = document.getElementById('p-tag');
        tag.innerText = isRest ? "DESCANSO" : "TREINO";
        tag.style.background = isRest ? "#fff" : "var(--primary)";

        Player.speak(isRest ? "Descanso" : "Atenção: " + ex.name);

        if (isRest) SFX.whistle.play();
        else SFX.bell.play();

        Player.timeLeft = ex.dur;
        Player.totalDur = ex.dur;
        Player.updateDisplay();
        Player.pause();
    },

    updateDisplay: () => {
        const displayTime = Math.max(0, Player.timeLeft);
        const m = Math.floor(displayTime / 60);
        const s = displayTime % 60;
        document.getElementById('p-timer').innerText = `${m}:${s < 10 ? '0' + s : s}`;
        document.getElementById('p-bar-fill').style.width = `${(displayTime / Player.totalDur) * 100}%`;
    },

    speak: (txt) => {
        if (State.voiceEnabled) {
            window.speechSynthesis.cancel();
            const u = new SpeechSynthesisUtterance(txt);
            u.lang = 'pt-BR';
            u.rate = 1.1;
            window.speechSynthesis.speak(u);
        }
    }
};

function toggleVoice() {
    State.voiceEnabled = !State.voiceEnabled;
    const btn = document.getElementById('btn-voice');
    btn.style.opacity = State.voiceEnabled ? '1' : '0.4';
    btn.innerHTML = State.voiceEnabled ? '<i class="fa-solid fa-volume-high"></i> Voz ON' : '<i class="fa-solid fa-volume-xmark"></i> Voz OFF';
}

const Sparring = {
    timer: null,
    timeLeft: 0,
    state: 'rest',
    round: 0,

    start: () => {
        Sparring.round = 0;
        Sparring.next('fight');
        try { if ('wakeLock' in navigator) navigator.wakeLock.request('screen'); } catch (e) { }
    },

    next: (ph) => {
        Sparring.state = ph;
        const bg = document.getElementById('sp-bg');

        if (ph === 'fight') {
            Sparring.timeLeft = document.getElementById('sp-round').value;
            bg.className = 'sparring-display fighting';
            Sparring.round++;
            document.getElementById('sp-round-counter').innerText = `Round ${Sparring.round}`;
            document.getElementById('sp-status').innerText = "LUTAR!";
            SFX.bell.play();
        } else {
            Sparring.timeLeft = document.getElementById('sp-rest').value;
            bg.className = 'sparring-display resting';
            document.getElementById('sp-status').innerText = "DESCANSO";
            SFX.whistle.play();
        }
        Sparring.play();
    },

    toggle: () => {
        if (Sparring.timer) Sparring.pause();
        else Sparring.play();
    },

    play: () => {
        if (Sparring.timer) clearInterval(Sparring.timer);

        Sparring.timer = setInterval(() => {
            if (Sparring.timeLeft > 0) {
                Sparring.timeLeft--;
                const m = Math.floor(Sparring.timeLeft / 60);
                const s = Sparring.timeLeft % 60;
                document.getElementById('sp-timer').innerText = `${m}:${s < 10 ? '0' + s : s}`;
            }

            if (Sparring.timeLeft <= 0) {
                Sparring.next(Sparring.state === 'fight' ? 'rest' : 'fight');
            }
        }, 1000);
    },

    pause: () => {
        clearInterval(Sparring.timer);
        Sparring.timer = null;
    },

    reset: () => {
        Sparring.pause();
        document.getElementById('sp-bg').className = 'sparring-display';
        document.getElementById('sp-timer').innerText = '00:00';
        document.getElementById('sp-status').innerText = 'PRONTO';
    }
};

const Students = {
    askName: () => {
        System.input('Nome do novo aluno:', (name) => {
            Students.add(name);
        });
    },

    add: (name) => {
        if (!name) return;
        State.students.push({
            id: Date.now(),
            name: name,
            classes: 0,
            belt: BELT_SYSTEM[0]
        });
        Students.save();
        Students.render();
    },

    save: () => {
        localStorage.setItem('pib_students', JSON.stringify(State.students));
    },

    mark: (id) => {
        const s = State.students.find(x => x.id === id);
        if (s) {
            s.classes++;
            s.belt = calculateBelt(s.classes);
            Students.save();
            Students.render();
            System.show(`Presença confirmada: ${s.name}`);
        }
    },

    del: (id) => {
        System.confirm('Excluir este aluno?', () => {
            State.students = State.students.filter(x => x.id !== id);
            Students.save();
            Students.render();
        });
    },

    render: () => {
        const list = document.getElementById('students-list');
        list.innerHTML = '';
        State.students.forEach(s => {
            s.belt = calculateBelt(s.classes);
            const idx = BELT_SYSTEM.indexOf(s.belt);
            const next = BELT_SYSTEM[idx + 1];
            const prog = next ? ((s.classes - s.belt.min) / (next.min - s.belt.min)) * 100 : 100;
            const div = document.createElement('div');
            div.className = 'student-card';
            div.innerHTML = `
                <h4 style="color:#fff">${s.name}</h4>
                <div class="student-stats">
                    <span>${s.belt.name}</span>
                    <span>${s.classes} Aulas</span>
                </div>
                <div class="student-belt">
                    <div class="belt-fill" style="width:${prog}%; background:${s.belt.color}"></div>
                </div>
                <div style="display:flex; gap:5px; margin-top:10px">
                    <button onclick="Students.mark(${s.id})" class="btn-action" style="flex:1; font-size:0.8rem">+ PRESENÇA</button>
                    <button onclick="Students.del(${s.id})" class="btn-delete-card">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            `;
            list.appendChild(div);
        });
    }
};

function calculateBelt(c) {
    return [...BELT_SYSTEM].reverse().find(b => c >= b.min) || BELT_SYSTEM[0];
}

const SavedWorkouts = {
    askName: () => {
        if (State.queue.length === 0) return System.show('A lista está vazia!', 'error');
        System.input('Nome do Treino:', (name) => {
            SavedWorkouts.save(name);
        });
    },

    save: (name) => {
        State.savedWorkouts[name] = State.queue;
        localStorage.setItem('pib_saved', JSON.stringify(State.savedWorkouts));
        System.show('Treino Salvo com Sucesso!');
        UI.showSaved();
    },

    load: (name) => {
        System.confirm(`Carregar o treino "${name}"?`, () => {
            State.queue = State.savedWorkouts[name];
            updateTimeline();
            Router.go('workout');
        });
    },

    del: (name) => {
        System.confirm(`Apagar o treino "${name}"?`, () => {
            delete State.savedWorkouts[name];
            localStorage.setItem('pib_saved', JSON.stringify(State.savedWorkouts));
            SavedWorkouts.render();
        });
    },

    render: () => {
        const list = document.getElementById('saved-list');
        list.innerHTML = '';
        Object.keys(State.savedWorkouts).forEach(name => {
            const div = document.createElement('div');
            div.className = 'card';
            div.innerHTML = `
                <div onclick="SavedWorkouts.load('${name}')" style="flex:1">
                    <h4 style="color:var(--primary)">${name}</h4>
                    <p>${State.savedWorkouts[name].length} items</p>
                </div>
                <button class="btn-delete-card" onclick="SavedWorkouts.del('${name}')">
                    <i class="fa-solid fa-trash"></i>
                </button>
            `;
            list.appendChild(div);
        });
    }
};