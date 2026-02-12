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

const System = {
    show: (msg, type = 'info') => {
        const modal = document.getElementById('sys-modal');
        if (!modal) return alert(msg);
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
        if (!modal) return confirm(msg) && onConfirm();
        document.getElementById('sys-modal-title').innerText = 'Confirmação';
        document.getElementById('sys-modal-msg').innerText = msg;
        document.getElementById('sys-modal-input').style.display = 'none';
        document.getElementById('sys-btn-cancel').style.display = 'block';
        const btnOk = document.getElementById('sys-btn-ok');
        btnOk.innerText = 'CONFIRMAR';
        btnOk.onclick = () => { System.close(); onConfirm(); };
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
            if (val) { System.close(); onConfirm(val); }
        };
        modal.style.display = 'flex';
        inputField.focus();
    },
    close: () => {
        const modal = document.getElementById('sys-modal');
        if (modal) modal.style.display = 'none';
    }
};

const Router = {
    go: (viewId) => {
        document.querySelectorAll('.view-section').forEach(el => {
            el.classList.remove('active');
            el.style.display = 'none';
        });

        const target = document.getElementById(`view-${viewId}`);
        if (target) {
            target.classList.add('active');
            target.style.display = (window.innerWidth <= 768 && viewId === 'workout') ? 'flex' : 'grid';
        }

        document.querySelectorAll('.nav-btn, .btm-btn').forEach(btn => btn.classList.remove('active'));
        const dBtn = document.getElementById(`desk-btn-${viewId}`);
        const bBtn = document.getElementById(`btm-btn-${viewId}`);
        if (dBtn) dBtn.classList.add('active');
        if (bBtn) bBtn.classList.add('active');
    }
};

function shareToWhatsapp() {
    if (State.queue.length === 0) return System.show('Lista vazia!', 'error');

    let text = "*🥊 PIB MUAY THAI - TREINO DO DIA*\n";
    text += "__________________________\n\n";

    let exercicioCount = 1;

    State.queue.forEach((ex) => {
        const timeStr = ex.dur >= 60 ? Math.floor(ex.dur / 60) + 'm' : ex.dur + 's';

        if (ex.id === 'setup' || ex.id === 'explain_next') {
            text += `\n*LIGUE O SOM:* 📢 ${ex.name} (${timeStr})\n`;
        } else if (ex.id === 'partner_switch') {
            text += `\n*TROCA:* 🔄 ${ex.name} (${timeStr})\n`;
        } else if (ex.type === 'rest') {
            text += `*PAUSA:* 💧 ${ex.name} (${timeStr})\n`;
        } else {
            text += `${exercicioCount}. *${ex.name}* - ${timeStr}\n`;
            exercicioCount++;
        }
    });

    text += "\n__________________________\n";
    text += "*Bora treinar!* 🔥";

    const encodedText = encodeURIComponent(text);
    const whatsappUrl = `https://wa.me/?text=${encodedText}`;

    try {
        window.open(whatsappUrl, '_blank');
    } catch (e) {
        const link = document.createElement('a');
        link.href = whatsappUrl;
        link.setAttribute('target', '_blank');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
};

const Player = {
    idx: 0,
    timer: null,
    timeLeft: 0,
    totalDur: 0,
    isRunning: false,

    open: () => {
        if (State.queue.length === 0) return System.show('Adicione exercícios ao cronograma!', 'error');

        const mainNav = document.getElementById('main-nav') || document.querySelector('.bottom-nav');
        const mainHeader = document.getElementById('main-header') || document.querySelector('header');

        if (mainNav) mainNav.style.display = 'none';
        if (mainHeader) mainHeader.style.display = 'none';

        const playerEl = document.getElementById('player');
        if (playerEl) {
            playerEl.style.display = 'flex';
            Player.idx = 0;
            Player.loadCard();

            setTimeout(() => {
                Player.play();
            }, 300);
        }
    },

    close: () => {
        Player.pause();
        const playerEl = document.getElementById('player');
        if (playerEl) playerEl.style.display = 'none';

        const mainNav = document.getElementById('main-nav') || document.querySelector('.bottom-nav');
        const mainHeader = document.getElementById('main-header') || document.querySelector('header');

        if (mainNav && window.innerWidth <= 768) mainNav.style.display = 'flex';
        if (mainHeader) mainHeader.style.display = 'flex';

        window.speechSynthesis.cancel();
    },

    toggle: () => Player.isRunning ? Player.pause() : Player.play(),

    play: () => {
        if (Player.timer) clearInterval(Player.timer);
        Player.isRunning = true;

        const btn = document.getElementById('btn-play-pause');
        if (btn) btn.innerHTML = '<i class="fa-solid fa-pause"></i>';

        Player.timer = setInterval(() => {
            if (Player.timeLeft > 0) {
                Player.timeLeft--;
                Player.updateDisplay();
            } else {
                clearInterval(Player.timer);
                Player.next();
            }
        }, 1000);
    },

    pause: () => {
        Player.isRunning = false;
        clearInterval(Player.timer);

        const btn = document.getElementById('btn-play-pause');
        if (btn) btn.innerHTML = '<i class="fa-solid fa-play"></i>';
    },

    next: () => {
        if (Player.timer) clearInterval(Player.timer);

        if (Player.idx < State.queue.length - 1) {
            Player.idx++;
            Player.loadCard();
            Player.play();
        } else {
            Player.close();
            SFX.bell.play();
            System.show('Treino Finalizado!', 'success');
        }
    },

    prev: () => {
        if (Player.timer) clearInterval(Player.timer);

        if (Player.idx > 0) {
            Player.idx--;
            Player.loadCard();
            Player.play();
        } else {
            Player.loadCard();
            Player.play();
        }
    },

    loadCard: () => {
        const ex = State.queue[Player.idx];
        const title = document.getElementById('p-title');
        const desc = document.getElementById('p-desc');
        const count = document.getElementById('p-round-count');
        const tag = document.getElementById('p-tag');

        if (title) title.innerText = ex.name;
        if (desc) desc.innerText = ex.desc;
        if (count) count.innerText = `${Player.idx + 1}/${State.queue.length}`;

        const isRest = ex.type === 'rest';
        if (tag) {
            tag.innerText = isRest ? "DESCANSO" : "TREINO";
            tag.style.background = isRest ? "#fff" : "var(--primary)";
        }

        if (State.voiceEnabled) {
            window.speechSynthesis.cancel();
            const u = new SpeechSynthesisUtterance(isRest ? "Descanso" : ex.name);
            u.lang = 'pt-BR';
            window.speechSynthesis.speak(u);
        }

        Player.timeLeft = ex.dur;
        Player.totalDur = ex.dur;
        Player.updateDisplay();
    },

    updateDisplay: () => {
        const timerEl = document.getElementById('p-timer');
        const barEl = document.getElementById('p-bar-fill');
        const m = Math.floor(Player.timeLeft / 60);
        const s = Player.timeLeft % 60;
        if (timerEl) timerEl.innerText = `${m}:${s < 10 ? '0' + s : s}`;
        if (barEl) barEl.style.width = `${(Player.timeLeft / Player.totalDur) * 100}%`;
    }
};

const Sparring = {
    timer: null,
    timeLeft: 0,
    state: 'ready',
    round: 0,

    start: () => {
        Sparring.round = 0;
        Sparring.next('fight');

        const playBtn = document.querySelector('.sp-controls button:first-child');
        if (playBtn) playBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';

        if ('wakeLock' in navigator) navigator.wakeLock.request('screen').catch(() => { });
    },

    next: (ph) => {
        Sparring.state = ph;
        const bg = document.getElementById('sp-bg');
        if (ph === 'fight') {
            Sparring.timeLeft = parseInt(document.getElementById('sp-round').value);
            if (bg) bg.className = 'sparring-display fighting';
            Sparring.round++;
            document.getElementById('sp-round-counter').innerText = `Round ${Sparring.round}`;
            document.getElementById('sp-status').innerText = "LUTAR!";
            SFX.bell.play();
        } else {
            Sparring.timeLeft = parseInt(document.getElementById('sp-rest').value);
            if (bg) bg.className = 'sparring-display resting';
            document.getElementById('sp-status').innerText = "DESCANSO";
            SFX.whistle.play();
        }
        Sparring.play();
    },

    toggle: () => {
        const playBtn = document.querySelector('.sp-controls button:first-child');
        if (Sparring.timer) {
            Sparring.pause();
            if (playBtn) playBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
        } else {
            Sparring.play();
            if (playBtn) playBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
        }
    },

    play: () => {
        if (Sparring.timer) clearInterval(Sparring.timer);
        Sparring.timer = setInterval(() => {
            if (Sparring.timeLeft > 0) {
                Sparring.timeLeft--;
                const m = Math.floor(Sparring.timeLeft / 60);
                const s = Sparring.timeLeft % 60;
                document.getElementById('sp-timer').innerText = `${m}:${s < 10 ? '0' + s : s}`;
            } else {
                Sparring.next(Sparring.state === 'fight' ? 'rest' : 'fight');
            }
        }, 1000);
    },

    pause: () => {
        clearInterval(Sparring.timer);
        Sparring.timer = null;
        const playBtn = document.querySelector('.sp-controls button:first-child');
        if (playBtn) playBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
    },

    reset: () => {
        Sparring.pause();
        const bg = document.getElementById('sp-bg');
        if (bg) bg.className = 'sparring-display';
        document.getElementById('sp-timer').innerText = '00:00';
        document.getElementById('sp-status').innerText = 'PRONTO';

        const playBtn = document.querySelector('.sp-controls button:first-child');
        if (playBtn) playBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
    }
};

function toggleVoice() {
    State.voiceEnabled = !State.voiceEnabled;
    const btn = document.getElementById('btn-voice');
    const icon = document.getElementById('voice-icon');
    const text = document.getElementById('voice-text');
    if (btn) btn.style.opacity = State.voiceEnabled ? '1' : '0.4';
    if (icon) icon.className = State.voiceEnabled ? 'fa-solid fa-volume-high' : 'fa-solid fa-volume-xmark';
    if (text) text.innerText = State.voiceEnabled ? 'ON' : 'OFF';
}

function renderDatabase() {
    const list = document.getElementById('db-list');
    if (!list || typeof EXERCISE_DB === 'undefined') return;
    list.innerHTML = '';
    const filtered = EXERCISE_DB.filter(ex => ex.name.toLowerCase().includes(State.search.toLowerCase()));
    filtered.forEach(ex => {
        const div = document.createElement('div');
        div.className = `card type-${ex.type}`;
        div.onclick = () => addToQueue(ex);
        div.innerHTML = `<div class="card-info"><h4>${ex.name}</h4><p>${ex.dur}s</p></div><div class="card-meta"><i class="fa-solid fa-plus"></i></div>`;
        list.appendChild(div);
    });
}

function generateWorkout() {
    if (typeof EXERCISE_DB === 'undefined') return;
    const mode = document.getElementById('gen-mode').value;
    const totalTimeGoal = parseInt(document.getElementById('gen-time').value) * 60;
    let curTime = 0;
    State.queue = [];
    const getRnd = (t) => {
        const l = EXERCISE_DB.filter(e => e.type === t);
        return l[Math.floor(Math.random() * l.length)];
    };
    const warmup = getRnd('warmup');
    State.queue.push({ ...warmup, uid: Math.random() });
    curTime += warmup.dur;
    while (curTime < totalTimeGoal - 300) {
        let type = (mode === 'cardio') ? (Math.random() > 0.5 ? 'phys' : 'tech') : 'tech';
        const ex = getRnd(type);
        State.queue.push({ ...ex, uid: Math.random() });
        curTime += ex.dur;
        const p = EXERCISE_DB.find(e => e.id === 'rest_20');
        if (p) { State.queue.push({ ...p, uid: Math.random() }); curTime += p.dur; }
    }
    updateTimeline();
    System.show("Treino gerado!");
}

function updateTimeline() {
    const list = document.getElementById('timeline-list');
    if (!list) return;
    list.innerHTML = '';
    let totalSec = 0;
    State.queue.forEach((ex, i) => {
        totalSec += ex.dur;
        const div = document.createElement('div');
        div.className = `card type-${ex.type}`;
        div.innerHTML = `<div style="display:flex; align-items:center; gap:10px;"><span class="timeline-idx">${i + 1}</span><div class="card-info"><h4>${ex.name}</h4><p>${ex.dur}s</p></div></div><button class="btn-delete-card" onclick="removeFromQueue(${ex.uid})"><i class="fa-solid fa-trash"></i></button>`;
        list.appendChild(div);
    });
    const totalTimeEl = document.getElementById('total-time');
    if (totalTimeEl) totalTimeEl.innerText = `${Math.floor(totalSec / 60)} min`;
}

const Students = {
    calculateBelt: (classes) => {
        return [...BELT_SYSTEM].reverse().find(b => classes >= b.min) || BELT_SYSTEM[0];
    },

    mark: (id) => {
        const student = State.students.find(s => s.id === id);
        if (student) {
            student.classes++;
            localStorage.setItem('pib_students', JSON.stringify(State.students));
            Students.render();
            System.show(`Presença marcada para ${student.name}!`);
        }
    },

    del: (id) => {
        System.confirm('Deseja excluir este aluno?', () => {
            State.students = State.students.filter(s => s.id !== id);
            localStorage.setItem('pib_students', JSON.stringify(State.students));
            Students.render();
        });
    },

    askName: () => {
        System.input('Nome do novo aluno:', (n) => {
            State.students.push({ id: Date.now(), name: n, classes: 0 });
            localStorage.setItem('pib_students', JSON.stringify(State.students));
            Students.render();
        });
    },

    render: () => {
        const list = document.getElementById('students-list');
        if (!list) return;
        list.innerHTML = '';

        State.students.forEach(s => {
            const currentBelt = Students.calculateBelt(s.classes);
            const beltIdx = BELT_SYSTEM.indexOf(currentBelt);
            const nextBelt = BELT_SYSTEM[beltIdx + 1];

            let progress = 100;
            if (nextBelt) {
                const range = nextBelt.min - currentBelt.min;
                const earned = s.classes - currentBelt.min;
                progress = Math.min((earned / range) * 100, 100);
            }

            const div = document.createElement('div');
            div.className = 'student-card';
            div.innerHTML = `
                <div style="text-align: center; margin-bottom: 10px;">
                    <h4 style="color:#fff; margin-bottom: 5px;">${s.name}</h4>
                    <div style="font-size: 0.8rem; color: ${currentBelt.color}; font-weight: bold;">
                        ${currentBelt.name}
                    </div>
                    <div style="font-size: 0.7rem; color: #888;">${s.classes} Aulas</div>
                </div>
                
                <div style="width: 100%; height: 8px; background: #333; border-radius: 4px; overflow: hidden; margin-bottom: 15px; border: 1px solid #444;">
                    <div style="width: ${progress}%; height: 100%; background: ${currentBelt.color}; transition: width 0.3s;"></div>
                </div>

                <div style="display:flex; gap:10px;">
                    <button onclick="Students.mark(${s.id})" class="btn-action" style="flex:1; font-size: 0.7rem; padding: 8px;">
                        + PRESENÇA
                    </button>
                    <button onclick="Students.del(${s.id})" class="btn-delete-card">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            `;
            list.appendChild(div);
        });
    }
};

function addToQueue(ex) { State.queue.push({ ...ex, uid: Math.random() }); updateTimeline(); }
function removeFromQueue(uid) { State.queue = State.queue.filter(i => i.uid !== uid); updateTimeline(); }
function setSearch(v) { State.search = v; renderDatabase(); }
const UI = {
    showDb: () => {
        document.getElementById('area-db').style.display = 'block';
        document.getElementById('db-list').style.display = 'flex';
        document.getElementById('area-saved').style.display = 'none';
        document.getElementById('saved-list').style.display = 'none';
        document.getElementById('tab-db')?.classList.add('active');
        document.getElementById('tab-saved')?.classList.remove('active');
    },
    showSaved: () => {
        document.getElementById('area-db').style.display = 'none';
        document.getElementById('db-list').style.display = 'none';
        document.getElementById('area-saved').style.display = 'block';
        document.getElementById('saved-list').style.display = 'flex';
        document.getElementById('tab-db')?.classList.remove('active');
        document.getElementById('tab-saved')?.classList.add('active');
    }
};

document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('pib_students')) State.students = JSON.parse(localStorage.getItem('pib_students'));
    setTimeout(() => {
        renderDatabase();
        Students.render();
        Router.go('workout');
    }, 100);
});