/* script.js */
const classData = {
    '3': { 
        name: 'Type 3: Regular', 
        grammar: 'Regular Grammar (A → aB or A → a)', 
        automaton: 'Finite State Automaton (FSA)', 
        example: 'ab (Regex)',
        details: 'The most restricted class. These languages can be processed by machines with no memory, just current states. They are primarily used for search patterns and lexical analysis.',
        realWorld: 'Regular Expressions (Regex), Lexical Analysis in compilers, highly optimized text searching algorithms (CTRL+F).'
    },
    '2': { 
        name: 'Type 2: Context-Free', 
        grammar: 'Context-Free Grammar (A → γ)', 
        automaton: 'Pushdown Automaton (PDA)', 
        example: 'Palindromes, aⁿbⁿ',
        details: "These languages allow for basic memory using a stack (Last-In, First-Out). Because a rule A → γ can be applied regardless of the symbols around it, it is 'context-free'. This is the basis for the syntax of most programming languages.",
        realWorld: 'Syntax tree parsing in structured programming languages (e.g., Python, Java), HTML document layout constraints, and generic XML validation.'
    },
    '1': { 
        name: 'Type 1: Context-Sensitive', 
        grammar: 'Context-Sensitive Grammar (αAβ → αγβ)', 
        automaton: 'Linear Bounded Automaton (LBA)', 
        example: 'aⁿbⁿcⁿ',
        details: "Rules here depend on the surrounding context (αAβ → αγβ). The machine's memory is proportional to the length of the input string. This handles complex cross-dependencies that Type 2 cannot.",
        realWorld: 'Semantic analysis in advanced Natural Language Processing, deeply-nested compiler type-checking assertions.'
    },
    '0': { 
        name: 'Type 0: Recursively Enumerable', 
        grammar: 'Unrestricted Grammar (α → β)', 
        automaton: 'Turing Machine (TM)', 
        example: 'Any computable function.',
        details: "The highest level of computation, with no restrictions on grammar rules. If a problem can be solved by any computer algorithm with unlimited time and memory, it falls into this category.",
        realWorld: 'Theoretical computer architecture definitions. Everything running natively on your core modern CPU corresponds directly to this limit.'
    }
};

document.addEventListener('DOMContentLoaded', async () => {
    // 1. Setup tsParticles
    try {
        await tsParticles.load("tsparticles", {
            fpsLimit: 60,
            background: { color: { value: "transparent" } },
            particles: {
                color: { value: ["#818cf8", "#c084fc", "#f472b6", "#fb7185"] },
                links: { color: "#8b5cf6", distance: 150, enable: true, opacity: 0.25, width: 1 },
                move: { enable: true, random: true, speed: 0.5, outModes: { default: "bounce" } },
                number: { density: { enable: true, area: 800 }, value: 80 },
                opacity: { value: { min: 0.1, max: 0.4 }, animation: { enable: true, speed: 0.5, sync: false } },
                shape: { type: "circle" },
                size: { value: { min: 1, max: 2.5 } }
            },
            interactivity: {
                events: {
                    onHover: { enable: true, mode: "grab" },
                    onClick: { enable: true, mode: "push" },
                    resize: true
                },
                modes: {
                    grab: { distance: 180, links: { opacity: 0.6, color: "#a855f7" } },
                    push: { quantity: 4 }
                }
            },
            detectRetina: true
        });
    } catch (e) {
        console.log("tsParticles loading error (handled):", e);
    }

    // 2. Setup GSAP Initial Animations
    if(window.gsap) {
        gsap.from(".gsap-title", { y: -30, opacity: 0, duration: 1.2, ease: "expo.out" });
        gsap.from(".gsap-subtitle", { y: -20, opacity: 0, duration: 1.2, delay: 0.2, ease: "expo.out" });
        gsap.from(".gsap-viz", { scale: 0.9, opacity: 0, duration: 1.8, delay: 0.4, ease: "expo.out" });
        gsap.from(".gsap-panel", { x: 50, opacity: 0, duration: 1.2, delay: 0.6, ease: "expo.out" });
    }

    // 3. Logic handling
    const cores = document.querySelectorAll('.logic-core');
    const defaultPrompt = document.getElementById('defaultPrompt');
    const classDetails = document.getElementById('classDetails');
    const className = document.getElementById('className');
    const grammarRules = document.getElementById('grammarRules');
    const automatonType = document.getElementById('automatonType');
    const exampleText = document.getElementById('exampleText');
    const systemDetails = document.getElementById('systemDetails');
    const realWorldText = document.getElementById('realWorldText');

    const modal = document.getElementById('global-modal');
    const modalBody = document.getElementById('modal-body');
    const modalTitle = document.getElementById('modal-title');
    const btnSimulate = document.getElementById('btn-simulate');
    const btnCloseModal = document.getElementById('btn-close-modal');
    const btnGlossary = document.getElementById('btn-glossary');
    const btnDiagnostics = document.getElementById('btn-diagnostics');
    const btnOpenClassifier = document.getElementById('btn-open-classifier');

    let isDetailMode = false;
    let scrambleIntervals = [];
    let tourActive = false;
    let diagnosticTimeout = null;
    let fsaAutoRunInterval = null;

    // Utility: Trigger Nexus Flow (Particle Swarm)
    function triggerNexusFlow(startX, startY, type) {
        const term = document.querySelector('.data-terminal');
        const termRect = term.getBoundingClientRect();
        
        const targetX = termRect.left + (termRect.width / 2);
        const targetY = termRect.top + (termRect.height / 2);
        
        const colors = {"0": "#818cf8", "1": "#c084fc", "2": "#f472b6", "3": "#fb7185"};
        const color = colors[type] || "#ffffff";
        
        for(let i = 0; i < 45; i++) {
            const p = document.createElement('div');
            p.className = 'data-particle';
            p.style.setProperty('--particle-color', color);
            p.style.left = startX + 'px';
            p.style.top = startY + 'px';
            document.body.appendChild(p);
            
            const tl = gsap.timeline({ onComplete: () => p.remove() });
            
            const angle = Math.random() * Math.PI * 2;
            const dist = Math.random() * 100 + 30;
            const midX = startX + Math.cos(angle) * dist;
            const midY = startY + Math.sin(angle) * dist;
            
            tl.to(p, {
                left: midX,
                top: midY,
                scale: Math.random() * 2 + 0.5,
                duration: 0.2 + Math.random() * 0.2,
                ease: "expo.out"
            })
            .to(p, {
                left: targetX + (Math.random() * 80 - 40),
                top: targetY + (Math.random() * 120 - 60),
                scale: 0.1,
                opacity: 0,
                duration: 0.6 + Math.random() * 0.4,
                ease: "power4.inOut"
            });
        }
    }

    cores.forEach((core) => {
        core.addEventListener('mouseenter', () => {
            if(!window.gsap || tourActive) return;
            const coreType = parseInt(core.getAttribute('data-type'), 10);
            
            cores.forEach(c => {
                const cType = parseInt(c.getAttribute('data-type'), 10);
                
                if(c === core) {
                    c.classList.add('hovered', 'active');
                    gsap.to(c, { scale: 1.04, opacity: 1, duration: 0.6, ease: "expo.out", overwrite: "auto" });
                } else if(cType < coreType) {
                    c.classList.remove('hovered', 'active');
                    gsap.to(c, { scale: 0.98, opacity: 0.4, duration: 0.6, ease: "expo.out", overwrite: "auto" });
                } else {
                    c.classList.remove('hovered', 'active');
                    gsap.to(c, { scale: 1, opacity: 1, duration: 0.6, ease: "expo.out", overwrite: "auto" });
                }
            });
            
            const label = core.querySelector(':scope > .label');
            if(label) gsap.to(label, { y: -8, scale: 1.05, filter: "drop-shadow(0 0 15px rgba(255,255,255,0.6))", duration: 0.5, ease: "expo.out" });
        });
        
        core.addEventListener('mouseleave', () => {
            if(!window.gsap || tourActive) return;
            
            cores.forEach(c => {
                c.classList.remove('hovered', 'active');
                gsap.to(c, { scale: 1, opacity: 1, duration: 0.7, ease: "expo.out", overwrite: "auto" });
            });
            
            const label = core.querySelector(':scope > .label');
            if(label) gsap.to(label, { y: 0, scale: 1, filter: "drop-shadow(0 0 0px transparent)", duration: 0.5, ease: "expo.out" });
        });

        core.addEventListener('click', (e) => {
            e.stopPropagation();
            if(tourActive && !e.isTrusted) {} else if(tourActive) return;

            if(diagnosticTimeout) {
                clearTimeout(diagnosticTimeout);
                diagnosticTimeout = null;
                const promptDiv = document.getElementById('defaultPrompt');
                if(!isDetailMode && promptDiv) {
                    promptDiv.innerHTML = `<h2 class="mono-text">Awaiting Input...</h2><p class="mono-text">> Select a logic core from the array to extract parameter definitions.</p><div class="cursor-blink">_</div>`;
                }
            }

            cores.forEach(c => {
                c.classList.remove('active');
                c.classList.remove('active-circle');
            });
            core.classList.add('active');
            core.classList.add('active-circle');

            const type = core.getAttribute('data-type');
            const data = classData[type];

            if (data && window.gsap) {
                const rect = core.getBoundingClientRect();
                let startX = rect.left + rect.width / 2;
                let startY = rect.top + rect.height / 2;
                
                triggerNexusFlow(startX, startY, type);
                
                const innerRing = core.querySelector('.ring-inner');
                if(innerRing) {
                    gsap.fromTo(innerRing, { filter: "brightness(2.5) drop-shadow(0 0 25px rgba(255,255,255,0.8))" }, { filter: "brightness(1) drop-shadow(0 0 0px transparent)", duration: 1, ease: "expo.out" });
                }

                if (!isDetailMode) {
                    gsap.to(defaultPrompt, { opacity: 0, y: -10, duration: 0.4, ease: "expo.out", onComplete: () => {
                        defaultPrompt.style.display = 'none';
                        updateDetailsAndAnimate(type, data);
                    }});
                    isDetailMode = true;
                } else {
                    gsap.to(classDetails, { opacity: 0, scale: 0.98, duration: 0.3, ease: "expo.out", onComplete: () => {
                        updateDetailsAndAnimate(type, data);
                    }});
                }
            }
        });
    });
    
    document.addEventListener('click', (e) => {
        if (tourActive) return;
        if (!e.target.closest('.visualization') && !e.target.closest('.data-terminal') && !e.target.closest('.modal-overlay') && !e.target.closest('.header-actions') && isDetailMode && window.gsap) {
            cores.forEach(c => {
                c.classList.remove('active');
                c.classList.remove('active-circle');
            });
            
            gsap.to(classDetails, { opacity: 0, y: 10, duration: 0.4, ease: "expo.out", onComplete: () => {
                classDetails.classList.remove('active');
                defaultPrompt.style.display = 'block';
                gsap.fromTo(defaultPrompt, {opacity: 0, y: -10}, {opacity: 1, y: 0, duration: 0.5, ease: "expo.out"});
                isDetailMode = false;
                gsap.to(".data-terminal", { "--terminal-outline": "rgba(99, 102, 241, 0.25)", duration: 0.6, ease: "expo.out" });
            }});
        }
    });

    const cypherChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789><%#$!@&*_-+";
    
    function scrambleText(element, finalString, durationMs) {
        let iteration = 0;
        const steps = 30; // Resolution of steps
        const intervalTime = durationMs / steps;
        const totalChars = finalString.length;
        
        clearInterval(element.scrambleInterval);
        
        element.scrambleInterval = setInterval(() => {
            const mapped = finalString.split("").map((letter, index) => {
                if(letter === ' ') return ' ';
                if(index < (iteration / steps) * totalChars) {
                    return letter;
                }
                return cypherChars[Math.floor(Math.random() * cypherChars.length)];
            });
            
            element.innerText = mapped.join("");
            
            iteration++;
            if(iteration > steps) {
                clearInterval(element.scrambleInterval);
                element.innerText = finalString;
            }
        }, intervalTime);
        scrambleIntervals.push(element.scrambleInterval);
    }

    function clearScramblers() {
        scrambleIntervals.forEach(t => clearInterval(t));
        scrambleIntervals = [];
    }

    function updateDetailsAndAnimate(type, data) {
        clearScramblers();
        
        classDetails.setAttribute('data-active', type);
        
        className.textContent = '';
        grammarRules.textContent = '';
        automatonType.textContent = '';
        exampleText.textContent = '';
        systemDetails.textContent = '';
        realWorldText.textContent = '';
        
        classDetails.classList.add('active');
        if(window.gsap) {
            gsap.fromTo(classDetails, { opacity: 0, y: 15, scale: 1 }, { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: "expo.out" });
            
            gsap.fromTo(".title-row, .terminal-divider, .detail-group", 
                { opacity: 0, x: -25 }, 
                { opacity: 1, x: 0, duration: 0.6, stagger: 0.1, ease: "expo.out" }
            );
            
            setTimeout(() => scrambleText(className, data.name, 600), 600);
            setTimeout(() => scrambleText(grammarRules, data.grammar, 800), 600);
            setTimeout(() => scrambleText(automatonType, data.automaton, 800), 750);
            setTimeout(() => scrambleText(exampleText, data.example, 800), 900);
            setTimeout(() => scrambleText(systemDetails, data.details, 1200), 1050);
            setTimeout(() => scrambleText(realWorldText, data.realWorld, 1300), 1200);
            
            const colors = {"0": "rgba(129, 140, 248, 0.7)", "1": "rgba(192, 132, 252, 0.7)", "2": "rgba(244, 114, 182, 0.7)", "3": "rgba(251, 113, 133, 0.7)"};
            gsap.to(".data-terminal", { "--terminal-outline": colors[type], duration: 0.8, ease: "expo.out" });
            gsap.fromTo(".terminal-header", { backgroundColor: "rgba(255,255,255,0.15)" }, { backgroundColor: "rgba(0,0,0,0.5)", duration: 0.6, ease: "expo.out" });
        }
    }

    if(btnDiagnostics) {
        btnDiagnostics.addEventListener('click', () => {
            if(tourActive) return;
            
            if(isDetailMode) {
                cores.forEach(c => {
                    c.classList.remove('active');
                    c.classList.remove('active-circle');
                });
                gsap.to(classDetails, { opacity: 0, y: 10, duration: 0.3, ease: "expo.out", onComplete: () => {
                    classDetails.classList.remove('active');
                    defaultPrompt.style.display = 'block';
                    gsap.fromTo(defaultPrompt, {opacity: 0, y: -10}, {opacity: 1, y: 0, duration: 0.4, ease: "expo.out"});
                    isDetailMode = false;
                    gsap.to(".data-terminal", { "--terminal-outline": "rgba(99, 102, 241, 0.25)", duration: 0.6, ease: "expo.out" });
                    executeDiagnostics();
                }});
            } else {
                executeDiagnostics();
            }
        });
    }
    
    function executeDiagnostics() {
        if(diagnosticTimeout) clearTimeout(diagnosticTimeout);
        
        defaultPrompt.innerHTML = '';
        
        const lines = [
            "> INITIATING SYSTEM DIAGNOSTICS...",
            "> [TYPE 3] FSA CORE: <span class='style-c3'>ONLINE</span>",
            "> [TYPE 2] LIFO STACK ALLOCATION: <span class='style-c2'>SECURE</span>",
            "> [TYPE 1] BOUNDED TAPE ARRAY: <span class='style-c1'>VERIFIED</span>",
            "> [TYPE 0] INFINITE MEMORY MATRIX: <span class='style-c0'>STABLE</span>",
            "> ALL COMPUTATIONAL LAYERS NOMINAL.",
            "> AWAITING USER INPUT."
        ];
        
        let i = 0;
        function typeLine() {
            if (i < lines.length) {
                defaultPrompt.innerHTML += `<p class="mono-text" style="margin-bottom: 0.5rem; color: #e2e8f0; font-size: 0.95rem;">${lines[i]}</p>`;
                i++;
                diagnosticTimeout = setTimeout(typeLine, 120);
            } else {
                defaultPrompt.innerHTML += `<div class="cursor-blink">_</div>`;
                diagnosticTimeout = null;
            }
        }
        typeLine();
    }

    if(btnGlossary) {
        btnGlossary.addEventListener('click', () => {
            if(tourActive) return;
            const content = document.getElementById('tpl-glossary').innerHTML;
            openModal(content, 'SYSTEM_DICTIONARY');
        });
    }

    if(btnOpenClassifier) {
        btnOpenClassifier.addEventListener('click', () => {
            if(tourActive) return;
            const tpl = document.getElementById('tpl-sim-classifier').innerHTML;
            openModal(tpl, 'SYSTEM_CLASSIFIER');
        });
    }

    function initClassifierModal() {
        const modalInput = document.getElementById('master-input');
        const modalBtn = document.getElementById('btn-classify');
        
        if(modalInput && modalBtn) {
            setTimeout(() => modalInput.focus(), 600);
            
            modalBtn.addEventListener('click', () => {
                const val = modalInput.value.trim();
                if(!val) return;
                
                if(fsaAutoRunInterval) {
                    clearInterval(fsaAutoRunInterval);
                    fsaAutoRunInterval = null;
                }
                
                gsap.to(".modal-content", {y: -10, opacity: 0, scale: 0.98, duration: 0.2, ease: "expo.in", onComplete: () => {
                    modal.classList.add('hidden');
                    modalBody.innerHTML = '';
                    classifyAndRunString(val);
                }});
            });
            
            modalInput.addEventListener('keypress', (e) => {
                if(e.key === 'Enter') modalBtn.click();
            });
        }
    }

    function classifyAndRunString(inputString) {
        if(isDetailMode) {
            cores.forEach(c => {
                c.classList.remove('active');
                c.classList.remove('active-circle');
            });
            classDetails.classList.remove('active');
            isDetailMode = false;
        }
        
        defaultPrompt.style.display = 'block';
        if(diagnosticTimeout) clearTimeout(diagnosticTimeout);
        
        let targetType = -1;
        if (/^a*b$/.test(inputString)) targetType = 3;
        else if (/^a+b+$/.test(inputString)) targetType = 2;
        else if (/^a+b+c+$/.test(inputString)) targetType = 1;
        else if (/^[01_]+$/.test(inputString)) targetType = 0;

        if (targetType === -1) {
            defaultPrompt.innerHTML = `<p class="mono-text" style="color: #ef4444;">> ERROR: STRING PATTERN UNRECOGNIZED BY CURRENT LOGIC CORES.</p><div class="cursor-blink">_</div>`;
            return;
        }

        const typeRef = {3: "FSA", 2: "CONTEXT-FREE", 1: "LINEAR BOUNDED", 0: "TURING MACHINE"};
        defaultPrompt.innerHTML = `<p class="mono-text" style="color: #10b981;">> STRING RECOGNIZED. ROUTING TO TYPE ${targetType} ${typeRef[targetType]} CORE...</p><div class="cursor-blink">_</div>`;

        openModal(document.getElementById('tpl-sim-' + targetType).innerHTML, 'SYSTEM_SIMULATION_ENV');

        setTimeout(() => {
            if (targetType === 3) {
                const innerInput = document.getElementById('fsa-input');
                const btnStep = document.getElementById('fsa-btn-step');
                if(innerInput && btnStep) {
                    innerInput.value = inputString;
                    if(fsaAutoRunInterval) clearInterval(fsaAutoRunInterval);
                    fsaAutoRunInterval = setInterval(() => {
                        btnStep.click();
                        const resultText = document.getElementById('fsa-status-result')?.innerText || "";
                        if(resultText.includes("ACCEPTED") || resultText.includes("REJECTED")) {
                            clearInterval(fsaAutoRunInterval);
                            fsaAutoRunInterval = null;
                        }
                    }, 200);
                }
            } else if (targetType === 2) {
                const innerInput = document.getElementById('pda-input');
                const btnStep = document.getElementById('pda-btn-step');
                if(innerInput && btnStep) {
                    innerInput.value = inputString;
                    if(fsaAutoRunInterval) clearInterval(fsaAutoRunInterval);
                    fsaAutoRunInterval = setInterval(() => {
                        btnStep.click();
                        const resultText = document.getElementById('pda-status-result')?.innerText || "";
                        if(resultText.includes("ACCEPTED") || resultText.includes("REJECTED")) {
                            clearInterval(fsaAutoRunInterval);
                            fsaAutoRunInterval = null;
                        }
                    }, 200);
                }
            } else if (targetType === 1) {
                const innerInput = document.getElementById('lba-input');
                const btnAuto = document.getElementById('lba-btn-auto');
                if(innerInput && btnAuto) {
                    innerInput.value = inputString;
                    btnAuto.click();
                }
            } else if (targetType === 0) {
                const innerInput = document.getElementById('tm-input');
                const btnAuto = document.getElementById('tm-btn-auto');
                if(innerInput && btnAuto) {
                    innerInput.value = inputString;
                    btnAuto.click();
                }
            }
        }, 150);
    }

    // Modal Logic
    function openModal(contentHtml, title) {
        modalTitle.innerText = title;
        modalBody.innerHTML = contentHtml;
        modal.classList.remove('hidden');
        gsap.fromTo(".modal-content", {y: 50, opacity: 0, scale: 0.95}, {y: 0, opacity: 1, scale: 1, duration: 0.6, ease: "expo.out"});
        
        if(title === 'SYSTEM_SIMULATION_ENV' && modalBody.querySelector('.fsa-interactive-canvas')) {
            initFsaSimulation();
        } else if(title === 'SYSTEM_SIMULATION_ENV' && modalBody.querySelector('.sim-pda')) {
            initPdaSimulation();
        } else if(title === 'SYSTEM_SIMULATION_ENV' && modalBody.querySelector('.sim-tm-container')) {
             if(modalBody.querySelector('.tm-tape-wrapper-0')) {
                 initTmSimulation();
             } else {
                 initLbaSimulation();
             }
        } else if (title === 'SYSTEM_CLASSIFIER') {
             initClassifierModal();
        }
    }
    
    function initFsaSimulation() {
        let fsaState = 'q0';
        let fsaInputStr = '';
        let ptr = 0;
        
        const inputEl = document.getElementById('fsa-input');
        const btnStep = document.getElementById('fsa-btn-step');
        const btnReset = document.getElementById('fsa-btn-reset');
        const statState = document.getElementById('fsa-status-state');
        const statInput = document.getElementById('fsa-status-input');
        const statResult = document.getElementById('fsa-status-result');
        const nodes = {
            'q0': document.getElementById('node-q0'),
            'q1': document.getElementById('node-q1'),
            'Trap': document.getElementById('node-trap')
        };
        
        function drawState() {
            Object.values(nodes).forEach(n => n.classList.remove('active-state'));
            const activeNode = nodes[fsaState];
            if(activeNode) {
                activeNode.classList.add('active-state');
                
                const fsaDot = document.getElementById('fsa-dot');
                if(fsaDot) {
                    fsaDot.style.opacity = '1';
                    fsaDot.style.left = `calc(${activeNode.style.left} + 18px)`;
                    fsaDot.style.top = `calc(${activeNode.style.top} - 18px)`;
                }
            }
            
            statState.innerText = fsaState;
            
            const remaining = fsaInputStr.substring(ptr);
            statInput.innerText = ptr > 0 || fsaInputStr ? (remaining ? `"${remaining}"` : "[EOF]") : "[Awaiting]";
            
            if(ptr >= fsaInputStr.length && fsaInputStr.length > 0) {
                if(fsaState === 'q1') {
                    statResult.innerText = "ACCEPTED";
                    statResult.style.color = "#10b981";
                    statResult.style.textShadow = "0 0 10px #10b981";
                } else {
                    statResult.innerText = "REJECTED";
                    statResult.style.color = "#ef4444";
                    statResult.style.textShadow = "0 0 10px #ef4444";
                }
            } else {
                statResult.innerText = "PENDING";
                statResult.style.color = "#64748b";
                statResult.style.textShadow = "none";
            }
        }

        btnStep.addEventListener('click', () => {
            let currentVal = inputEl.value;
            if(!currentVal && fsaInputStr === '') return;
            
            if(currentVal !== fsaInputStr) {
                fsaInputStr = currentVal;
                ptr = 0;
                fsaState = 'q0';
            }
            if(ptr >= fsaInputStr.length && fsaInputStr.length > 0) return;
            
            let oldState = fsaState;
            
            if(fsaInputStr) {
                const char = fsaInputStr[ptr];
                ptr++;
                if(fsaState === 'q0') {
                    if(char === 'a') fsaState = 'q0';
                    else if(char === 'b') fsaState = 'q1';
                    else fsaState = 'Trap';
                } else if(fsaState === 'q1') {
                    fsaState = 'Trap';
                } else if(fsaState === 'Trap') {
                    fsaState = 'Trap'; 
                }
            }
            drawState();
            
            // Apply loop pulse animation
            if(oldState === fsaState) {
                const fsaDot = document.getElementById('fsa-dot');
                if(fsaDot) {
                    fsaDot.classList.remove('is-looping');
                    void fsaDot.offsetWidth; // hard reflow
                    fsaDot.classList.add('is-looping');
                    setTimeout(() => fsaDot.classList.remove('is-looping'), 300);
                }
            }
        });

        btnReset.addEventListener('click', () => {
            fsaInputStr = '';
            ptr = 0;
            fsaState = 'q0';
            inputEl.value = '';
            drawState();
        });
        
        drawState(); // Initialize first render statically
    }

    function initPdaSimulation() {
        let pdaState = 'q0'; 
        let pdaInputStr = '';
        let ptr = 0;
        
        const inputEl = document.getElementById('pda-input');
        const btnStep = document.getElementById('pda-btn-step');
        const btnReset = document.getElementById('pda-btn-reset');
        const statState = document.getElementById('pda-status-state');
        const statInput = document.getElementById('pda-status-input');
        const statLog = document.getElementById('pda-log');
        const statResult = document.getElementById('pda-status-result');
        const stackView = document.getElementById('pda-stack');
        
        function wipeStack() {
            stackView.innerHTML = '<div class="stack-box style-c2" id="z0-base">Z0</div>';
        }

        function drawState(action) {
            statState.innerText = pdaState;
            statLog.innerText = action;
            
            const remaining = pdaInputStr.substring(ptr);
            statInput.innerText = parseInt(ptr) > 0 || pdaInputStr ? (remaining ? `"${remaining}"` : "[EOF]") : "[Awaiting]";
            
            if(ptr >= pdaInputStr.length && pdaInputStr.length > 0) {
                const stackItems = stackView.querySelectorAll('.pda-stack-item');
                if(pdaState !== 'Trap' && stackItems.length === 0 && (pdaState === 'q1' || pdaState === 'q0')) {
                    statResult.innerText = "ACCEPTED";
                    statResult.style.color = "#10b981";
                    statResult.style.textShadow = "0 0 10px #10b981";
                } else if(pdaState !== 'Trap' && stackItems.length > 0 && /^a*b$/.test(pdaInputStr)) {
                    statResult.innerText = "ACCEPTED (Lower-tier Type 3 Grammar valid)";
                    statResult.style.color = "#10b981";
                    statResult.style.textShadow = "0 0 10px #10b981";
                } else {
                    statResult.innerText = "REJECTED";
                    statResult.style.color = "#ef4444";
                    statResult.style.textShadow = "0 0 10px #ef4444";
                }
            } else {
                statResult.innerText = "PENDING";
                statResult.style.color = "#64748b";
                statResult.style.textShadow = "none";
            }
        }

        btnStep.addEventListener('click', () => {
            let currentVal = inputEl.value;
            if(!currentVal && pdaInputStr === '') return;
            
            if(currentVal !== pdaInputStr) {
                pdaInputStr = currentVal;
                ptr = 0;
                pdaState = 'q0';
                wipeStack();
            }
            if(ptr >= pdaInputStr.length && pdaInputStr.length > 0) return;
            
            let actionText = "IDLE";
            
            if(pdaInputStr && pdaState !== 'Trap') {
                const char = pdaInputStr[ptr];
                ptr++;
                
                if(pdaState === 'q0') {
                    if(char === 'a') {
                        const newA = document.createElement('div');
                        newA.className = 'stack-box pda-stack-item';
                        newA.innerText = 'A';
                        stackView.append(newA);
                        actionText = "PUSH (A)";
                    } else if(char === 'b') {
                        pdaState = 'q1';
                        if(stackView.lastElementChild && stackView.lastElementChild.id !== 'z0-base') {
                            stackView.lastElementChild.remove();
                            actionText = "POP (A)";
                        } else {
                            pdaState = 'Trap';
                            actionText = "CRASH: Stack underflow";
                        }
                    } else {
                        pdaState = 'Trap';
                        actionText = "CRASH: Invalid token";
                    }
                } else if(pdaState === 'q1') {
                    if(char === 'a') {
                        pdaState = 'Trap';
                        actionText = "CRASH: Read 'a' during POP";
                    } else if(char === 'b') {
                        if(stackView.lastElementChild && stackView.lastElementChild.id !== 'z0-base') {
                            stackView.lastElementChild.remove();
                            actionText = "POP (A)";
                        } else {
                            pdaState = 'Trap';
                            actionText = "CRASH: Stack underflow";
                        }
                    } else {
                        pdaState = 'Trap';
                        actionText = "CRASH: Invalid token";
                    }
                }
            } else if (pdaState === 'Trap') {
                 actionText = "CRASHED";
                 ptr = pdaInputStr.length; 
            }
            drawState(actionText);
        });

        btnReset.addEventListener('click', () => {
            pdaInputStr = '';
            ptr = 0;
            pdaState = 'q0';
            inputEl.value = '';
            wipeStack();
            drawState("RESET");
            statInput.innerText = "[Awaiting]";
        });
        
        drawState("INITIALIZED");
    }

    function initLbaSimulation() {
        const inputEl = document.getElementById('lba-input');
        const btnStep = document.getElementById('lba-btn-step');
        const btnAuto = document.getElementById('lba-btn-auto');
        const btnReset = document.getElementById('lba-btn-reset');
        const tapeContainer = document.getElementById('lba-tape');
        const statState = document.getElementById('lba-status-state');
        const statLog = document.getElementById('lba-log');
        const statResult = document.getElementById('lba-status-result');

        let lbaState = 'q0_seek_A';
        let lbaPtr = 1;
        let tapeArr = [];
        let runningString = "";
        let autoRunInterval = null;
        
        function clearAutoRun() {
            if(autoRunInterval) {
                clearInterval(autoRunInterval);
                autoRunInterval = null;
            }
            if(btnStep && btnAuto) {
                btnStep.disabled = false;
                btnAuto.disabled = false;
                btnStep.style.opacity = '1';
                btnAuto.style.opacity = '1';
            }
        }
        
        function rebuildTape(str) {
            clearAutoRun();
            runningString = str;
            tapeArr = ['['];
            for(let c of str) tapeArr.push(c);
            tapeArr.push(']');
            
            tapeContainer.innerHTML = '';
            for(let i=0; i<tapeArr.length; i++) {
                const cell = document.createElement('div');
                cell.className = 'tm-cell';
                if(i===0 || i===tapeArr.length-1) cell.classList.add('bound');
                else cell.classList.add('tm-val');
                cell.innerText = tapeArr[i];
                tapeContainer.appendChild(cell);
            }
            const pointer = document.createElement('div');
            pointer.className = 'tm-head lba-head style-c1 glow-c1';
            pointer.id = 'lba-pointer';
            pointer.innerText = '▲';
            tapeContainer.appendChild(pointer);
            
            lbaState = 'q0_seek_A';
            lbaPtr = 1;
        }

        function drawState(actionText = "IDLE") {
            statState.innerText = lbaState;
            statLog.innerText = actionText;
            
            const head = document.getElementById('lba-pointer');
            const cells = tapeContainer.querySelectorAll('.tm-cell');
            if(head && cells[lbaPtr]) {
                head.style.transform = `translateX(${cells[lbaPtr].offsetLeft}px)`;
                cells[lbaPtr].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
            }
            
            if(lbaState === 'Accepted') {
                const hasZ = Array.from(cells).some(c => c.innerText === 'Z');
                if(!hasZ) {
                    statResult.innerText = "ACCEPTED (Lower-tier Type 2 Grammar valid)";
                } else {
                    statResult.innerText = "ACCEPTED";
                }
                statResult.style.color = "#10b981";
                statResult.style.textShadow = "0 0 10px #10b981";
                clearAutoRun();
            } else if(lbaState === 'Accepted_Lower') {
                statResult.innerText = "ACCEPTED (Lower-tier Type 3 Grammar valid)";
                statResult.style.color = "#10b981";
                statResult.style.textShadow = "0 0 10px #10b981";
                clearAutoRun();
            } else if(lbaState === 'Trap') {
                statResult.innerText = "REJECTED";
                statResult.style.color = "#ef4444";
                statResult.style.textShadow = "0 0 10px #ef4444";
                if(head) {
                    head.style.color = "#ef4444";
                    head.style.textShadow = "0 0 10px #ef4444";
                }
                clearAutoRun();
            } else {
                statResult.innerText = "PENDING";
                statResult.style.color = "#64748b";
                statResult.style.textShadow = "none";
            }
        }

        function stepSimulation() {
            let currentVal = inputEl.value || "aabbcc";
            if(currentVal !== runningString) {
                rebuildTape(currentVal);
                drawState("TAPE INITIALIZED");
                return;
            }
            
            if(lbaState === 'Accepted' || lbaState === 'Trap') return;
            
            const char = tapeArr[lbaPtr];
            const cells = tapeContainer.querySelectorAll('.tm-cell');
            let action = "IDLE";
            
            switch(lbaState) {
                case 'q0_seek_A':
                    if(char === 'a') {
                        tapeArr[lbaPtr] = 'X';
                        cells[lbaPtr].innerText = 'X';
                        cells[lbaPtr].style.color = '#c084fc';
                        lbaState = 'q1_seek_B';
                        lbaPtr++;
                        action = "Marked 'a' -> 'X', moving RIGHT";
                    } else if (char === 'Y') {
                        lbaState = 'q3_verify';
                        lbaPtr++;
                        action = "Found 'Y', assuming all 'a's marked. Verifying remaining string -> RIGHT";
                    } else if (char === 'b' || char === 'c') {
                        lbaState = 'Trap';
                        action = `CRASH: Found '${char}' when seeking 'a'. (Characters out of order)`;
                    } else if (char === ']') {
                        lbaState = 'Trap';
                        action = `CRASH: Hit right boundary too early. (Empty or unbalanced)`;
                    } else {
                        lbaState = 'Trap';
                        action = `CRASH: Unexpected '${char}'`;
                    }
                    break;
                    
                case 'q1_seek_B':
                    if(char === 'a' || char === 'Y') {
                        lbaPtr++;
                        action = `Skipping '${char}' -> RIGHT`;
                    } else if (char === 'b') {
                        tapeArr[lbaPtr] = 'Y';
                        cells[lbaPtr].innerText = 'Y';
                        cells[lbaPtr].style.color = '#c084fc';
                        lbaState = 'q2_seek_C';
                        lbaPtr++;
                        action = "Marked 'b' -> 'Y', moving RIGHT";
                    } else if (char === 'c') {
                        lbaState = 'Trap';
                        action = `CRASH: Hit 'c' without finding 'b'. (Hit wrong char before finding required character)`;
                    } else if (char === ']') {
                        const unverified = tapeArr.some(c => c === 'b' || c === 'c');
                        if (!unverified) {
                            lbaState = 'Accepted_Lower';
                            action = "Lower Grammar Fallback: Hit ']', but array matches Type 3. Accepting.";
                        } else {
                            lbaState = 'Trap';
                            action = `CRASH: Hit ']' without finding 'b'. (Hit boundary before finding required character)`;
                        }
                    } else {
                        lbaState = 'Trap';
                        action = `CRASH: Unexpected '${char}'`;
                    }
                    break;
            
                case 'q2_seek_C':
                    if(char === 'b' || char === 'Z') {
                        lbaPtr++;
                        action = `Skipping '${char}' -> RIGHT`;
                    } else if (char === 'c') {
                        tapeArr[lbaPtr] = 'Z';
                        cells[lbaPtr].innerText = 'Z';
                        cells[lbaPtr].style.color = '#c084fc';
                        lbaState = 'q_rewind';
                        lbaPtr--;
                        action = "Marked 'c' -> 'Z', rewinding LEFT";
                    } else if (char === 'a') {
                        lbaState = 'Trap';
                        action = `CRASH: Hit 'a' without finding 'c'. (Hit wrong char before finding required character)`;
                    } else if (char === ']') {
                        lbaState = 'q_rewind';
                        lbaPtr--;
                        action = "Lower Grammar Fallback: Hit ']' instead of 'c'. Rewinding LEFT to verify Type 2.";
                    } else {
                        lbaState = 'Trap';
                        action = `CRASH: Unexpected '${char}'`;
                    }
                    break;
            
                case 'q_rewind':
                    if(char === 'a' || char === 'b' || char === 'Y' || char === 'Z') {
                        lbaPtr--;
                        action = `Rewinding past '${char}' -> LEFT`;
                    } else if (char === 'X' || char === '[') {
                        lbaPtr++;
                        lbaState = 'q0_seek_A';
                        action = "Bounced off bounds/X. Resuming scan -> RIGHT";
                    } else {
                         lbaState = 'Trap';
                         action = `CRASH: Unexpected '${char}'`;
                    }
                    break;
            
                case 'q3_verify':
                    if(char === 'Y' || char === 'Z') {
                        lbaPtr++;
                        action = `Verifying, skipped '${char}' -> RIGHT`;
                    } else if (char === 'a' || char === 'b' || char === 'c') {
                        lbaState = 'Trap';
                        action = `CRASH: Found unmarked '${char}'. (Unbalanced string, leftover characters found)`;
                    } else if (char === ']') {
                        lbaState = 'Accepted';
                        action = "HALT: Correctly verified all markers.";
                    } else {
                         lbaState = 'Trap';
                         action = `CRASH: Unexpected '${char}'`;
                    }
                    break;
            }
            
            drawState(action);
        }

        btnStep.addEventListener('click', () => {
            stepSimulation();
        });

        btnAuto.addEventListener('click', () => {
             let currentVal = inputEl.value || "aabbcc";
             if(currentVal !== runningString) rebuildTape(currentVal);
             if(lbaState === 'Accepted' || lbaState === 'Trap') return;
             
             btnStep.disabled = true;
             btnAuto.disabled = true;
             btnStep.style.opacity = '0.5';
             btnAuto.style.opacity = '0.5';
             
             autoRunInterval = setInterval(() => {
                 stepSimulation();
             }, 250);
        });

        btnReset.addEventListener('click', () => {
            clearAutoRun();
            let currentVal = inputEl.value || "aabbcc";
            rebuildTape(currentVal);
            drawState("RESET");
        });
        
        let startVal = inputEl.value || "aabbcc";
        rebuildTape(startVal);
        drawState("INITIALIZED");
    }

    function initTmSimulation() {
        const inputEl = document.getElementById('tm-input');
        const btnStep = document.getElementById('tm-btn-step');
        const btnAuto = document.getElementById('tm-btn-auto');
        const btnReset = document.getElementById('tm-btn-reset');
        const tapeContainer = document.getElementById('tm-tape');
        const statState = document.getElementById('tm-status-state');
        const statLog = document.getElementById('tm-log');
        const statResult = document.getElementById('tm-status-result');

        let tmState = 'q0_seek_end';
        let tmPtr = 1;
        let tapeArr = [];
        let runningString = "";
        let autoRunInterval = null;
        
        function clearAutoRun() {
            if(autoRunInterval) {
                clearInterval(autoRunInterval);
                autoRunInterval = null;
            }
            if(btnStep && btnAuto) {
                btnStep.disabled = false;
                btnAuto.disabled = false;
                btnStep.style.opacity = '1';
                btnAuto.style.opacity = '1';
            }
        }
        
        function rebuildTape(str) {
            clearAutoRun();
            runningString = str;
            tapeArr = ['_'];
            for(let c of str) tapeArr.push(c);
            tapeArr.push('_');
            
            tapeContainer.innerHTML = '';
            for(let i=0; i<tapeArr.length; i++) {
                const cell = document.createElement('div');
                cell.className = 'tm-cell';
                if(tapeArr[i] === '0' || tapeArr[i] === '1') cell.classList.add('tm-val');
                cell.innerText = tapeArr[i];
                tapeContainer.appendChild(cell);
            }
            const pointer = document.createElement('div');
            pointer.className = 'tm-head lba-head style-c0 glow-c0';
            pointer.id = 'tm-pointer';
            pointer.innerText = '▲';
            tapeContainer.appendChild(pointer);
            
            tmState = 'q0_seek_end';
            tmPtr = 1;
        }

        function drawState(actionText = "IDLE") {
            statState.innerText = tmState;
            statLog.innerText = actionText;
            
            const head = document.getElementById('tm-pointer');
            const cells = tapeContainer.querySelectorAll('.tm-cell');
            if(head && cells[tmPtr]) {
                head.style.transform = `translateX(${cells[tmPtr].offsetLeft}px)`;
                cells[tmPtr].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
            }
            
            if(tmState === 'q_halt') {
                statResult.innerText = "HALTED / ACCEPTED";
                statResult.style.color = "#10b981";
                statResult.style.textShadow = "0 0 10px #10b981";
                clearAutoRun();
            } else {
                statResult.innerText = "PENDING";
                statResult.style.color = "#64748b";
                statResult.style.textShadow = "none";
            }
        }

        function stepSimulation() {
            let currentVal = inputEl.value || "1011";
            if(currentVal !== runningString) {
                rebuildTape(currentVal);
                drawState("TAPE INITIALIZED");
                return;
            }
            
            if(tmState === 'q_halt') return;
            
            if(tmPtr === 0) {
                tapeArr.unshift('_');
                const cell = document.createElement('div');
                cell.className = 'tm-cell';
                cell.innerText = '_';
                tapeContainer.insertBefore(cell, tapeContainer.firstChild);
                tmPtr++; 
            } else if (tmPtr === tapeArr.length - 1) {
                tapeArr.push('_');
                const cell = document.createElement('div');
                cell.className = 'tm-cell';
                cell.innerText = '_';
                tapeContainer.insertBefore(cell, document.getElementById('tm-pointer'));
            }
            
            const char = tapeArr[tmPtr];
            const cells = tapeContainer.querySelectorAll('.tm-cell');
            let action = "IDLE";
            
            switch(tmState) {
                case 'q0_seek_end':
                    if(char === '0' || char === '1') {
                        tmPtr++;
                        action = `Skipping '${char}' -> RIGHT`;
                    } else if (char === '_') {
                        tmState = 'q1_carry';
                        tmPtr--;
                        action = "Found Blank. Starting Binary Increment -> LEFT";
                    }
                    break;
                    
                case 'q1_carry':
                    if(char === '1') {
                        tapeArr[tmPtr] = '0';
                        cells[tmPtr].innerText = '0';
                        cells[tmPtr].className = 'tm-cell tm-val'; 
                        cells[tmPtr].style.color = '#60a5fa';
                        tmPtr--;
                        action = "Flipped '1' to '0' (Carrying 1) -> LEFT";
                    } else if (char === '0') {
                        tapeArr[tmPtr] = '1';
                        cells[tmPtr].innerText = '1';
                        cells[tmPtr].className = 'tm-cell tm-val';
                        cells[tmPtr].style.color = '#60a5fa';
                        tmState = 'q_halt';
                        action = "Flipped '0' to '1' -> HALT";
                    } else if (char === '_') {
                        tapeArr[tmPtr] = '1';
                        cells[tmPtr].innerText = '1';
                        cells[tmPtr].className = 'tm-cell tm-val';
                        cells[tmPtr].style.color = '#60a5fa';
                        tmState = 'q_halt';
                        action = "Overflow reached blank. Wrote '1' -> HALT";
                    }
                    break;
            }
            
            drawState(action);
        }

        btnStep.addEventListener('click', stepSimulation);

        btnAuto.addEventListener('click', () => {
             let currentVal = inputEl.value || "1011";
             if(currentVal !== runningString) rebuildTape(currentVal);
             if(tmState === 'q_halt') return;
             
             btnStep.disabled = true;
             btnAuto.disabled = true;
             btnStep.style.opacity = '0.5';
             btnAuto.style.opacity = '0.5';
             
             autoRunInterval = setInterval(() => {
                 stepSimulation();
             }, 250);
        });

        btnReset.addEventListener('click', () => {
            clearAutoRun();
            let currentVal = inputEl.value || "1011";
            rebuildTape(currentVal);
            drawState("RESET");
        });
        
        let startVal = inputEl.value || "1011";
        rebuildTape(startVal);
        drawState("INITIALIZED");
    }
    
    btnCloseModal.addEventListener('click', () => {
        if(fsaAutoRunInterval) {
            clearInterval(fsaAutoRunInterval);
            fsaAutoRunInterval = null;
        }
        gsap.to(".modal-content", {y: -30, opacity: 0, scale: 0.95, duration: 0.3, ease: "expo.in", onComplete: () => {
            modal.classList.add('hidden');
            modalBody.innerHTML = '';
        }});
    });

    btnGlossary.addEventListener('click', () => {
        const tpl = document.getElementById('tpl-glossary').innerHTML;
        openModal(tpl, 'SYSTEM_GLOSSARY_INDEX');
    });

    btnSimulate.addEventListener('click', () => {
        const activeType = classDetails.getAttribute('data-active');
        if(!activeType) return;
        const tpl = document.getElementById('tpl-sim-' + activeType).innerHTML;
        openModal(tpl, 'SYSTEM_SIMULATION_ENV');
    });

    // Run Diagnostics Tour
    const delay = ms => new Promise(res => setTimeout(res, ms));

    btnDiagnostics.addEventListener('click', async () => {
        if(tourActive) return;
        tourActive = true;
        btnDiagnostics.innerText = "[ DIAGNOSTICS RUNNING... ]";
        btnDiagnostics.style.color = "#10b981";
        
        modal.classList.add('hidden'); // Close any open modals
        
        // Sequence: 3, 2, 1, 0
        const seq = ['3', '2', '1', '0'];
        
        for(let type of seq) {
            if(!tourActive) break; 
            const targetCore = document.querySelector(`.logic-core[data-type="${type}"]`);
            
            targetCore.dispatchEvent(new Event('click')); // Trigger synthetic load
            
            // Highlight natively overriding hover disabled logic
            cores.forEach(c => {
                const cType = parseInt(c.getAttribute('data-type'), 10);
                const tType = parseInt(type, 10);
                if(c === targetCore) {
                    c.classList.add('active');
                    gsap.to(c, { scale: 1.05, opacity: 1, duration: 0.6, ease: "expo.out" });
                } else if(cType < tType) {
                    c.classList.remove('active');
                    gsap.to(c, { scale: 0.98, opacity: 0.4, duration: 0.6, ease: "expo.out" });
                } else {
                    c.classList.remove('active');
                    gsap.to(c, { scale: 1, opacity: 1, duration: 0.6, ease: "expo.out" });
                }
            });

            await delay(4500); // 4.5 seconds per layer for scrambling+reading
        }
        
        // Reset Tour state
        btnDiagnostics.innerText = "[ RUN DIAGNOSTICS ]";
        btnDiagnostics.style.color = "";
        tourActive = false;
        
        // Return to neutral hover baseline
        cores.forEach(c => {
            gsap.to(c, { scale: 1, opacity: 1, duration: 0.7, ease: "expo.out" });
        });
    });
});
