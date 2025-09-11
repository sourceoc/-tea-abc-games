// ======================= SISTEMA DE JOGOS ABC ESPECIAL ======================= //

class JogoABC {
    constructor() {
        this.telaAtual = 'menu-principal';
        this.jogoAtual = null;
        this.questaoAtual = 0;
        this.pontos = 0;
        this.sequencia = 0;
        this.melhorSequencia = 0;
        this.vidas = 3;
        this.totalQuestoes = 10;
        this.audioHabilitado = true;
        this.audioContexto = null;
        
        // Dados dos jogos
        this.dadosJogos = {
            letras: [
                { letra: 'A', opcoes: ['A', 'B', 'C', 'D'] },
                { letra: 'B', opcoes: ['A', 'B', 'C', 'D'] },
                { letra: 'C', opcoes: ['A', 'B', 'C', 'D'] },
                { letra: 'D', opcoes: ['A', 'B', 'C', 'D'] },
                { letra: 'E', opcoes: ['E', 'F', 'G', 'H'] },
                { letra: 'F', opcoes: ['E', 'F', 'G', 'H'] },
                { letra: 'G', opcoes: ['E', 'F', 'G', 'H'] },
                { letra: 'H', opcoes: ['E', 'F', 'G', 'H'] },
                { letra: 'I', opcoes: ['I', 'J', 'K', 'L'] },
                { letra: 'J', opcoes: ['I', 'J', 'K', 'L'] },
                { letra: 'K', opcoes: ['I', 'J', 'K', 'L'] },
                { letra: 'L', opcoes: ['I', 'J', 'K', 'L'] },
                { letra: 'M', opcoes: ['M', 'N', 'O', 'P'] },
                { letra: 'N', opcoes: ['M', 'N', 'O', 'P'] },
                { letra: 'O', opcoes: ['M', 'N', 'O', 'P'] },
                { letra: 'P', opcoes: ['M', 'N', 'O', 'P'] }
            ],
            palavras: [
                { palavra: 'GATO', letras: ['G', 'A', 'T', 'O'], extras: ['X', 'Z', 'R', 'S'] },
                { palavra: 'CASA', letras: ['C', 'A', 'S', 'A'], extras: ['B', 'E', 'F', 'M'] },
                { palavra: 'BOLA', letras: ['B', 'O', 'L', 'A'], extras: ['C', 'D', 'E', 'F'] },
                { palavra: 'PATO', letras: ['P', 'A', 'T', 'O'], extras: ['Q', 'R', 'S', 'U'] },
                { palavra: 'FLOR', letras: ['F', 'L', 'O', 'R'], extras: ['G', 'H', 'I', 'J'] },
                { palavra: 'LIVRO', letras: ['L', 'I', 'V', 'R', 'O'], extras: ['M', 'N', 'P', 'Q', 'S'] },
                { palavra: 'AMOR', letras: ['A', 'M', 'O', 'R'], extras: ['B', 'C', 'D', 'E'] },
                { palavra: 'AGUA', letras: ['A', 'G', 'U', 'A'], extras: ['B', 'C', 'D', 'E'] },
                { palavra: 'FELIZ', letras: ['F', 'E', 'L', 'I', 'Z'], extras: ['G', 'H', 'J', 'K', 'M'] },
                { palavra: 'SONHO', letras: ['S', 'O', 'N', 'H', 'O'], extras: ['P', 'Q', 'R', 'T', 'U'] }
            ],
            imagens: [
                { palavra: 'GATO', imagem: '🐱', opcoes: ['🐱', '🐶', '🐰', '🐸'] },
                { palavra: 'CACHORRO', imagem: '🐶', opcoes: ['🐱', '🐶', '🐰', '🐸'] },
                { palavra: 'CASA', imagem: '🏠', opcoes: ['🏠', '🚗', '✈️', '🚢'] },
                { palavra: 'CARRO', imagem: '🚗', opcoes: ['🏠', '🚗', '✈️', '🚢'] },
                { palavra: 'AVIAO', imagem: '✈️', opcoes: ['🏠', '🚗', '✈️', '🚢'] },
                { palavra: 'BOLA', imagem: '⚽', opcoes: ['⚽', '🏀', '🎾', '🏐'] },
                { palavra: 'FLOR', imagem: '🌸', opcoes: ['🌸', '🌺', '🌻', '🌹'] },
                { palavra: 'ARVORE', imagem: '🌳', opcoes: ['🌳', '🌲', '🌴', '🌵'] },
                { palavra: 'ESTRELA', imagem: '⭐', opcoes: ['⭐', '🌟', '✨', '💫'] },
                { palavra: 'CORACAO', imagem: '❤️', opcoes: ['❤️', '💙', '💚', '💛'] }
            ]
        };
        
        this.questoesEmbaralhadas = {};
        this.palavraAtualConstruida = [];
        this.imagemSelecionada = null;
        
        this.inicializar();
    }
    
    // ======================= INICIALIZAÇÃO ======================= //
    inicializar() {
        this.configurarAudio();
        this.configurarEventos();
        this.configurarDragAndDrop();
        this.mostrarTelaCarregamento();
        
        // Simular carregamento
        setTimeout(() => {
            this.esconderTelaCarregamento();
            this.mostrarTela('menu-principal');
        }, 2000);
    }
    
    mostrarTelaCarregamento() {
        const telaCarregamento = document.getElementById('loading-screen');
        telaCarregamento.style.display = 'flex';
    }
    
    esconderTelaCarregamento() {
        const telaCarregamento = document.getElementById('loading-screen');
        telaCarregamento.style.opacity = '0';
        setTimeout(() => {
            telaCarregamento.style.display = 'none';
        }, 500);
    }
    
    configurarAudio() {
        if ('speechSynthesis' in window) {
            this.voz = speechSynthesis;
        }
        
        try {
            this.audioContexto = new (window.AudioContext || window.webkitAudioContext)();
        } catch (error) {
            console.log('Áudio não suportado:', error);
        }
    }
    
    configurarEventos() {
        // Eventos de teclado para acessibilidade
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.voltarMenu();
            }
        });
        
        // Tornar funções globais
        window.iniciarJogo = (tipo) => this.iniciarJogo(tipo);
        window.voltarMenu = () => this.voltarMenu();
        window.mostrarConfiguracoes = () => this.mostrarConfiguracoes();
        window.mostrarEstatisticas = () => this.mostrarEstatisticas();
        window.reproduzirSomLetra = () => this.reproduzirSomLetra();
        window.reproduzirSomPalavra = () => this.reproduzirSomPalavra();
        window.reproduzirSomPalavraImagem = () => this.reproduzirSomPalavraImagem();
        window.verificarPalavra = () => this.verificarPalavra();
        window.limparPalavra = () => this.limparPalavra();
        window.confirmarEscolha = () => this.confirmarEscolha();
        window.cancelarEscolha = () => this.cancelarEscolha();
        window.continuarJogo = () => this.continuarJogo();
        window.jogarNovamente = () => this.jogarNovamente();
    }
    
    // ======================= NAVEGAÇÃO ENTRE TELAS ======================= //
    mostrarTela(nomeTela) {
        // Esconder todas as telas
        document.querySelectorAll('.screen').forEach(tela => {
            tela.classList.remove('active');
        });
        
        // Mostrar tela específica
        const tela = document.getElementById(nomeTela);
        if (tela) {
            tela.classList.add('active');
            this.telaAtual = nomeTela;
        }
    }
    
    voltarMenu() {
        this.jogoAtual = null;
        this.questaoAtual = 0;
        this.fecharModais();
        this.mostrarTela('menu-principal');
    }
    
    // ======================= SISTEMA DE ÁUDIO ======================= //
    falar(texto) {
        if (!this.audioHabilitado || !this.voz) return;
        
        this.voz.cancel();
        const utterance = new SpeechSynthesisUtterance(texto);
        utterance.lang = 'pt-BR';
        utterance.rate = 0.8;
        utterance.pitch = 1.2;
        this.voz.speak(utterance);
    }
    
    reproduzirSomLetra() {
        if (this.jogoAtual === 'letras') {
            const questao = this.questoesEmbaralhadas.letras[this.questaoAtual];
            if (questao) {
                this.falar(`A letra é ${questao.letra}`);
            }
        }
    }
    
    reproduzirSomPalavra() {
        if (this.jogoAtual === 'palavras') {
            const questao = this.questoesEmbaralhadas.palavras[this.questaoAtual];
            if (questao) {
                this.falar(`A palavra é ${questao.palavra}`);
            }
        }
    }
    
    reproduzirSomPalavraImagem() {
        if (this.jogoAtual === 'imagens') {
            const questao = this.questoesEmbaralhadas.imagens[this.questaoAtual];
            if (questao) {
                this.falar(`Encontre a imagem para ${questao.palavra}`);
            }
        }
    }
    
    reproduzirSomSucesso() {
        this.criarSomSimples(800, 0.1, 'sine');
        setTimeout(() => this.criarSomSimples(1000, 0.1, 'sine'), 100);
    }
    
    reproduzirSomErro() {
        this.criarSomSimples(300, 0.2, 'sawtooth');
    }
    
    criarSomSimples(frequencia, duracao, tipo = 'sine') {
        if (!this.audioContexto || !this.audioHabilitado) return;
        
        try {
            const oscillator = this.audioContexto.createOscillator();
            const gainNode = this.audioContexto.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContexto.destination);
            
            oscillator.frequency.setValueAtTime(frequencia, this.audioContexto.currentTime);
            oscillator.type = tipo;
            
            gainNode.gain.setValueAtTime(0, this.audioContexto.currentTime);
            gainNode.gain.linearRampToValueAtTime(0.1, this.audioContexto.currentTime + 0.01);
            gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContexto.currentTime + duracao);
            
            oscillator.start(this.audioContexto.currentTime);
            oscillator.stop(this.audioContexto.currentTime + duracao);
        } catch (error) {
            console.log('Erro ao reproduzir som:', error);
        }
    }
    
    // ======================= SISTEMA DE JOGOS ======================= //
    iniciarJogo(tipo) {
        this.jogoAtual = tipo;
        this.questaoAtual = 0;
        this.pontos = 0;
        this.sequencia = 0;
        this.vidas = 3;
        this.palavraAtualConstruida = [];
        this.imagemSelecionada = null;
        
        // Embaralhar questões
        this.questoesEmbaralhadas[tipo] = this.embaralhar([...this.dadosJogos[tipo]]).slice(0, this.totalQuestoes);
        
        this.mostrarTela(`jogo-${tipo}`);
        this.atualizarEstatisticas();
        
        switch (tipo) {
            case 'letras':
                this.iniciarJogoLetras();
                break;
            case 'palavras':
                this.iniciarJogoPalavras();
                break;
            case 'imagens':
                this.iniciarJogoImagens();
                break;
        }
    }
    
    // ======================= JOGO DAS LETRAS ======================= //
    iniciarJogoLetras() {
        const questao = this.questoesEmbaralhadas.letras[this.questaoAtual];
        if (!questao) {
            this.finalizarJogo();
            return;
        }
        
        // Atualizar display da letra
        document.getElementById('letra-atual').textContent = questao.letra;
        
        // Criar opções embaralhadas
        const opcoesEmbaralhadas = this.embaralhar([...questao.opcoes]);
        const container = document.getElementById('opcoes-letras');
        container.innerHTML = '';
        
        opcoesEmbaralhadas.forEach((letra, index) => {
            const opcao = document.createElement('div');
            opcao.className = 'letter-option';
            opcao.textContent = letra;
            opcao.setAttribute('tabindex', '0');
            opcao.setAttribute('role', 'button');
            opcao.setAttribute('aria-label', `Opção ${letra}`);
            
            opcao.addEventListener('click', () => this.verificarRespostaLetras(letra, questao.letra));
            opcao.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.verificarRespostaLetras(letra, questao.letra);
                }
            });
            
            container.appendChild(opcao);
        });
        
        // Atualizar barra de progresso
        this.atualizarProgresso();
        
        // Reproduzir som da letra após um delay
        setTimeout(() => {
            this.falar(`Qual é esta letra?`);
            setTimeout(() => this.reproduzirSomLetra(), 1000);
        }, 500);
    }
    
    verificarRespostaLetras(letraEscolhida, letraCorreta) {
        const opcoes = document.querySelectorAll('.letter-option');
        const correto = letraEscolhida === letraCorreta;
        
        // Desabilitar todas as opções
        opcoes.forEach(opcao => {
            opcao.style.pointerEvents = 'none';
            if (opcao.textContent === letraCorreta) {
                opcao.classList.add('correct');
            } else if (opcao.textContent === letraEscolhida && !correto) {
                opcao.classList.add('incorrect');
            }
        });
        
        if (correto) {
            this.pontos += 10;
            this.sequencia++;
            this.melhorSequencia = Math.max(this.melhorSequencia, this.sequencia);
            this.reproduzirSomSucesso();
            this.mostrarFeedback('🎉 Correto!', 'success');
            this.falar('Muito bem! Resposta correta!');
        } else {
            this.vidas--;
            this.sequencia = 0;
            this.reproduzirSomErro();
            this.mostrarFeedback(`❌ Errado! É a letra ${letraCorreta}`, 'error');
            this.falar(`Não foi dessa vez. A resposta correta é ${letraCorreta}`);
        }
        
        this.atualizarEstatisticas();
        
        if (this.vidas <= 0) {
            setTimeout(() => this.mostrarGameOver(), 2000);
        } else {
            setTimeout(() => this.proximaQuestao(), 2000);
        }
    }
    
    // ======================= JOGO DE PALAVRAS ======================= //
    iniciarJogoPalavras() {
        const questao = this.questoesEmbaralhadas.palavras[this.questaoAtual];
        if (!questao) {
            this.finalizarJogo();
            return;
        }
        
        // Atualizar display da palavra
        document.getElementById('palavra-objetivo').textContent = questao.palavra;
        
        // Criar slots para a palavra
        const slotsContainer = document.getElementById('slots-palavra');
        slotsContainer.innerHTML = '';
        this.palavraAtualConstruida = new Array(questao.letras.length).fill('');
        
        questao.letras.forEach((letra, index) => {
            const slot = document.createElement('div');
            slot.className = 'word-slot';
            slot.setAttribute('data-index', index);
            slot.setAttribute('role', 'button');
            slot.setAttribute('aria-label', `Posição ${index + 1} da palavra`);
            slotsContainer.appendChild(slot);
        });
        
        // Criar pool de letras
        const todasLetras = [...questao.letras, ...questao.extras];
        const letrasEmbaralhadas = this.embaralhar(todasLetras);
        const poolContainer = document.getElementById('pool-letras');
        poolContainer.innerHTML = '';
        
        letrasEmbaralhadas.forEach((letra, index) => {
            const letraDiv = document.createElement('div');
            letraDiv.className = 'draggable-letter';
            letraDiv.textContent = letra;
            letraDiv.setAttribute('draggable', 'true');
            letraDiv.setAttribute('data-letra', letra);
            letraDiv.setAttribute('data-index', index);
            letraDiv.setAttribute('tabindex', '0');
            letraDiv.setAttribute('role', 'button');
            letraDiv.setAttribute('aria-label', `Letra ${letra}`);
            
            poolContainer.appendChild(letraDiv);
        });
        
        this.atualizarProgresso();
        this.habilitarBotaoVerificar(false);
        
        setTimeout(() => {
            this.falar(`Monte a palavra: ${questao.palavra}`);
        }, 500);
    }
    
    configurarDragAndDrop() {
        document.addEventListener('dragstart', (e) => {
            if (e.target.classList.contains('draggable-letter') && !e.target.classList.contains('used')) {
                e.target.classList.add('dragging');
                e.dataTransfer.setData('text/plain', e.target.dataset.letra);
                e.dataTransfer.setData('text/index', e.target.dataset.index);
                e.dataTransfer.effectAllowed = 'move';
            }
        });
        
        document.addEventListener('dragend', (e) => {
            if (e.target.classList.contains('draggable-letter')) {
                e.target.classList.remove('dragging');
            }
        });
        
        document.addEventListener('dragover', (e) => {
            if (e.target.classList.contains('word-slot')) {
                e.preventDefault();
                e.target.classList.add('drag-over');
            }
        });
        
        document.addEventListener('dragleave', (e) => {
            if (e.target.classList.contains('word-slot')) {
                // Só remove se não estamos dentro de um elemento filho
                const rect = e.target.getBoundingClientRect();
                const x = e.clientX;
                const y = e.clientY;
                
                if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
                    e.target.classList.remove('drag-over');
                }
            }
        });
        
        document.addEventListener('drop', (e) => {
            if (e.target.classList.contains('word-slot')) {
                e.preventDefault();
                e.target.classList.remove('drag-over');
                
                const letra = e.dataTransfer.getData('text/plain');
                const letraIndex = e.dataTransfer.getData('text/index');
                const slotIndex = parseInt(e.target.dataset.index);
                
                // Validar se temos todos os dados necessários
                if (letra && letraIndex !== '' && !isNaN(slotIndex)) {
                    this.colocarLetraNoSlot(letra, slotIndex, letraIndex);
                }
            }
        });
    }
    
    colocarLetraNoSlot(letra, slotIndex, letraOriginalIndex) {
        const slot = document.querySelector(`.word-slot[data-index="${slotIndex}"]`);
        const letraElement = document.querySelector(`.draggable-letter[data-index="${letraOriginalIndex}"]`);
        
        if (slot && letraElement && !letraElement.classList.contains('used')) {
            // Limpar slot se já tiver letra
            if (this.palavraAtualConstruida[slotIndex]) {
                const letraAnterior = slot.textContent;
                // Reativar letra anterior no pool
                const letrasPool = document.querySelectorAll('.draggable-letter');
                letrasPool.forEach(l => {
                    if (l.textContent === letraAnterior && l.classList.contains('used')) {
                        l.classList.remove('used');
                        l.style.pointerEvents = 'auto';
                        l.setAttribute('draggable', 'true');
                    }
                });
            }
            
            // Colocar nova letra
            slot.textContent = letra;
            slot.classList.add('filled');
            this.palavraAtualConstruida[slotIndex] = letra;
            
            // Marcar letra como usada
            letraElement.classList.add('used');
            letraElement.style.pointerEvents = 'none';
            letraElement.setAttribute('draggable', 'false');
            
            // Verificar se palavra está completa
            const palavraCompleta = this.palavraAtualConstruida.every(l => l !== '');
            this.habilitarBotaoVerificar(palavraCompleta);
        }
    }
    
    habilitarBotaoVerificar(habilitado) {
        const botao = document.getElementById('btn-verificar-palavra');
        botao.disabled = !habilitado;
        botao.style.opacity = habilitado ? '1' : '0.5';
    }
    
    verificarPalavra() {
        const questao = this.questoesEmbaralhadas.palavras[this.questaoAtual];
        const palavraConstruida = this.palavraAtualConstruida.join('');
        const palavraCorreta = questao.palavra;
        const correto = palavraConstruida === palavraCorreta;
        
        const slots = document.querySelectorAll('.word-slot');
        
        if (correto) {
            this.pontos += 15;
            this.sequencia++;
            this.melhorSequencia = Math.max(this.melhorSequencia, this.sequencia);
            this.reproduzirSomSucesso();
            this.mostrarFeedback('🎉 Palavra correta!', 'success');
            this.falar('Excelente! Você montou a palavra corretamente!');
            
            slots.forEach(slot => slot.classList.add('correct'));
        } else {
            this.vidas--;
            this.sequencia = 0;
            this.reproduzirSomErro();
            this.mostrarFeedback(`❌ Errado! A palavra é ${palavraCorreta}`, 'error');
            this.falar(`Não foi dessa vez. A palavra correta é ${palavraCorreta}`);
            
            slots.forEach(slot => slot.classList.add('incorrect'));
        }
        
        this.atualizarEstatisticas();
        
        if (this.vidas <= 0) {
            setTimeout(() => this.mostrarGameOver(), 2500);
        } else {
            setTimeout(() => this.proximaQuestao(), 2500);
        }
    }
    
    limparPalavra() {
        const slots = document.querySelectorAll('.word-slot');
        const letras = document.querySelectorAll('.draggable-letter');
        
        slots.forEach(slot => {
            slot.textContent = '';
            slot.classList.remove('filled', 'correct', 'incorrect');
        });
        
        letras.forEach(letra => {
            letra.classList.remove('used');
            letra.style.pointerEvents = 'auto';
            letra.setAttribute('draggable', 'true');
        });
        
        this.palavraAtualConstruida = new Array(this.palavraAtualConstruida.length).fill('');
        this.habilitarBotaoVerificar(false);
    }
    
    // ======================= JOGO DE IMAGENS ======================= //
    iniciarJogoImagens() {
        const questao = this.questoesEmbaralhadas.imagens[this.questaoAtual];
        if (!questao) {
            this.finalizarJogo();
            return;
        }
        
        // Atualizar display da palavra
        document.getElementById('palavra-desafio').textContent = questao.palavra;
        
        // Criar opções de imagens
        const opcoesEmbaralhadas = this.embaralhar([...questao.opcoes]);
        const container = document.getElementById('grade-imagens');
        container.innerHTML = '';
        
        opcoesEmbaralhadas.forEach((imagem, index) => {
            const opcao = document.createElement('div');
            opcao.className = 'image-option';
            opcao.setAttribute('data-imagem', imagem);
            opcao.setAttribute('tabindex', '0');
            opcao.setAttribute('role', 'button');
            opcao.setAttribute('aria-label', `Opção de imagem ${index + 1}`);
            
            const emoji = document.createElement('div');
            emoji.className = 'image-emoji';
            emoji.textContent = imagem;
            
            const label = document.createElement('div');
            label.className = 'image-label';
            // Criar label baseado na imagem (simplificado)
            const labels = {
                '🐱': 'Gato', '🐶': 'Cachorro', '🐰': 'Coelho', '🐸': 'Sapo',
                '🏠': 'Casa', '🚗': 'Carro', '✈️': 'Avião', '🚢': 'Barco',
                '⚽': 'Futebol', '🏀': 'Basquete', '🎾': 'Tênis', '🏐': 'Vôlei',
                '🌸': 'Flor', '🌺': 'Hibisco', '🌻': 'Girassol', '🌹': 'Rosa',
                '🌳': 'Árvore', '🌲': 'Pinheiro', '🌴': 'Palmeira', '🌵': 'Cacto',
                '⭐': 'Estrela', '🌟': 'Estrela Brilhante', '✨': 'Brilho', '💫': 'Estrela Cadente',
                '❤️': 'Coração Vermelho', '💙': 'Coração Azul', '💚': 'Coração Verde', '💛': 'Coração Amarelo'
            };
            label.textContent = labels[imagem] || 'Imagem';
            
            opcao.appendChild(emoji);
            opcao.appendChild(label);
            
            opcao.addEventListener('click', () => this.selecionarImagem(opcao, imagem));
            opcao.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.selecionarImagem(opcao, imagem);
                }
            });
            
            container.appendChild(opcao);
        });
        
        // Esconder seção de confirmação
        document.getElementById('secao-confirmacao').style.display = 'none';
        this.imagemSelecionada = null;
        
        this.atualizarProgresso();
        
        setTimeout(() => {
            this.falar(`Encontre a imagem para: ${questao.palavra}`);
        }, 500);
    }
    
    selecionarImagem(elemento, imagem) {
        // Remover seleção anterior
        document.querySelectorAll('.image-option').forEach(opt => {
            opt.classList.remove('selected');
        });
        
        // Selecionar nova imagem
        elemento.classList.add('selected');
        this.imagemSelecionada = imagem;
        
        // Mostrar seção de confirmação
        document.getElementById('secao-confirmacao').style.display = 'block';
        
        // Scroll suave para a confirmação
        document.getElementById('secao-confirmacao').scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
        });
    }
    
    confirmarEscolha() {
        const questao = this.questoesEmbaralhadas.imagens[this.questaoAtual];
        const correto = this.imagemSelecionada === questao.imagem;
        
        const opcoes = document.querySelectorAll('.image-option');
        
        // Desabilitar todas as opções
        opcoes.forEach(opcao => {
            opcao.style.pointerEvents = 'none';
            const imagemOpcao = opcao.dataset.imagem;
            
            if (imagemOpcao === questao.imagem) {
                opcao.classList.add('correct');
            } else if (imagemOpcao === this.imagemSelecionada && !correto) {
                opcao.classList.add('incorrect');
            }
        });
        
        // Esconder confirmação
        document.getElementById('secao-confirmacao').style.display = 'none';
        
        if (correto) {
            this.pontos += 12;
            this.sequencia++;
            this.melhorSequencia = Math.max(this.melhorSequencia, this.sequencia);
            this.reproduzirSomSucesso();
            this.mostrarFeedback('🎉 Imagem correta!', 'success');
            this.falar('Perfeito! Você escolheu a imagem certa!');
        } else {
            this.vidas--;
            this.sequencia = 0;
            this.reproduzirSomErro();
            this.mostrarFeedback('❌ Imagem errada!', 'error');
            this.falar('Não foi dessa vez. Tente novamente!');
        }
        
        this.atualizarEstatisticas();
        
        if (this.vidas <= 0) {
            setTimeout(() => this.mostrarGameOver(), 2000);
        } else {
            setTimeout(() => this.proximaQuestao(), 2000);
        }
    }
    
    cancelarEscolha() {
        // Remover seleção
        document.querySelectorAll('.image-option').forEach(opt => {
            opt.classList.remove('selected');
        });
        
        // Esconder confirmação
        document.getElementById('secao-confirmacao').style.display = 'none';
        this.imagemSelecionada = null;
    }
    
    // ======================= SISTEMA DE PROGRESSÃO ======================= //
    proximaQuestao() {
        this.questaoAtual++;
        
        if (this.questaoAtual >= this.totalQuestoes) {
            this.finalizarJogo();
            return;
        }
        
        switch (this.jogoAtual) {
            case 'letras':
                this.iniciarJogoLetras();
                break;
            case 'palavras':
                this.iniciarJogoPalavras();
                break;
            case 'imagens':
                this.iniciarJogoImagens();
                break;
        }
    }
    
    atualizarEstatisticas() {
        if (!this.jogoAtual) return;
        
        const prefixo = this.jogoAtual;
        
        // Atualizar pontos
        const elementoPontos = document.getElementById(`pontos-${prefixo}`);
        if (elementoPontos) elementoPontos.textContent = this.pontos;
        
        // Atualizar sequência
        const elementoSequencia = document.getElementById(`sequencia-${prefixo}`);
        if (elementoSequencia) elementoSequencia.textContent = this.sequencia;
        
        // Atualizar vidas
        const elementoVidas = document.getElementById(`vidas-${prefixo}`);
        if (elementoVidas) elementoVidas.textContent = this.vidas;
    }
    
    atualizarProgresso() {
        if (!this.jogoAtual) return;
        
        const progresso = ((this.questaoAtual + 1) / this.totalQuestoes) * 100;
        const prefixo = this.jogoAtual;
        
        const barraProgresso = document.getElementById(`progresso-${prefixo}`);
        const textoProgresso = document.getElementById(`texto-progresso-${prefixo}`);
        
        if (barraProgresso) {
            barraProgresso.style.width = `${progresso}%`;
        }
        
        if (textoProgresso) {
            textoProgresso.textContent = `${this.questaoAtual + 1} de ${this.totalQuestoes}`;
        }
    }
    
    // ======================= SISTEMA DE FEEDBACK ======================= //
    mostrarFeedback(mensagem, tipo) {
        const feedbackArea = document.getElementById('feedback-area');
        
        const feedbackDiv = document.createElement('div');
        feedbackDiv.className = `feedback-message ${tipo}`;
        feedbackDiv.textContent = mensagem;
        
        feedbackArea.appendChild(feedbackDiv);
        
        // Remover feedback após animação
        setTimeout(() => {
            if (feedbackDiv.parentNode) {
                feedbackDiv.parentNode.removeChild(feedbackDiv);
            }
        }, 2000);
    }
    
    // ======================= SISTEMA DE MODAIS ======================= //
    mostrarModal(idModal, dados = {}) {
        const modal = document.getElementById(idModal);
        if (!modal) return;
        
        // Preencher dados do modal se fornecidos
        Object.keys(dados).forEach(key => {
            const elemento = modal.querySelector(`#${key}`);
            if (elemento) {
                elemento.textContent = dados[key];
            }
        });
        
        modal.classList.add('show');
        modal.style.display = 'flex';
        
        // Foco no modal para acessibilidade
        modal.focus();
    }
    
    fecharModal(idModal) {
        const modal = document.getElementById(idModal);
        if (modal) {
            modal.classList.remove('show');
            setTimeout(() => {
                modal.style.display = 'none';
            }, 300);
        }
    }
    
    fecharModais() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.classList.remove('show');
            modal.style.display = 'none';
        });
    }
    
    mostrarGameOver() {
        const dados = {
            'pontos-totais-final': this.pontos,
            'melhor-sequencia-final': this.melhorSequencia
        };
        
        this.mostrarModal('modal-game-over', dados);
        this.falar('Fim de jogo! Você jogou muito bem!');
    }
    
    finalizarJogo() {
        const precisao = Math.round((this.pontos / (this.totalQuestoes * 15)) * 100);
        
        const dados = {
            'pontuacao-final': this.pontos,
            'precisao-final': precisao
        };
        
        this.mostrarModal('modal-vitoria', dados);
        this.falar('Parabéns! Você completou todas as fases com sucesso!');
    }
    
    continuarJogo() {
        this.fecharModais();
        this.proximaQuestao();
    }
    
    jogarNovamente() {
        this.fecharModais();
        this.iniciarJogo(this.jogoAtual);
    }
    
    // ======================= UTILITÁRIOS ======================= //
    embaralhar(array) {
        const resultado = [...array];
        for (let i = resultado.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [resultado[i], resultado[j]] = [resultado[j], resultado[i]];
        }
        return resultado;
    }
    
    // ======================= CONFIGURAÇÕES E ESTATÍSTICAS ======================= //
    mostrarConfiguracoes() {
        alert('Configurações serão implementadas em uma próxima versão!');
    }
    
    mostrarEstatisticas() {
        alert('Estatísticas serão implementadas em uma próxima versão!');
    }
}

// ======================= INICIALIZAÇÃO ======================= //
document.addEventListener('DOMContentLoaded', () => {
    window.jogo = new JogoABC();
});

// ======================= EVENT LISTENERS GLOBAIS ======================= //
document.addEventListener('click', (e) => {
    // Fechar modais clicando fora
    if (e.target.classList.contains('modal')) {
        const modais = ['modal-resultado', 'modal-game-over', 'modal-vitoria'];
        modais.forEach(id => {
            if (e.target.id === id) {
                window.jogo.fecharModal(id);
            }
        });
    }
});

document.addEventListener('keydown', (e) => {
    // Fechar modais com ESC
    if (e.key === 'Escape') {
        window.jogo.fecharModais();
    }
});