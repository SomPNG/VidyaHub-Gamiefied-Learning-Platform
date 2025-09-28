// FIX: Add import for Phaser to resolve TypeScript errors related to missing Phaser types.
import Phaser from 'phaser';

const WORDS = [
    { word: 'INTEGRITY', hint: 'The quality of being honest and having strong moral principles.' },
    { word: 'AMBIGUOUS', hint: 'Open to more than one interpretation; having a double meaning.' },
    { word: 'NOSTALGIA', hint: 'A sentimental longing for the past.' }
];

export class WordScrambleScene extends Phaser.Scene {
    // FIX: Declare scene properties explicitly to resolve TypeScript errors.
    public readonly cameras!: Phaser.Cameras.Scene2D.CameraManager;
    public readonly add!: Phaser.GameObjects.GameObjectFactory;
    public readonly time!: Phaser.Time.Clock;
    public readonly game!: Phaser.Game;
    public readonly children!: Phaser.GameObjects.DisplayList;

    private wordToGuess: string = '';
    private scrambledWord: string = '';
    private hint: string = '';
    private letterSlots: Phaser.GameObjects.Text[] = [];
    private answerSlots: Phaser.GameObjects.Text[] = [];
    private feedbackText!: Phaser.GameObjects.Text;
    private currentGuess: (string | null)[] = [];

    constructor() {
        super({ key: 'WordScrambleScene' });
    }

    init() {
        const { word, hint } = Phaser.Math.RND.pick(WORDS);
        this.wordToGuess = word;
        this.hint = hint;
        this.scrambledWord = this.shuffle(word.split('')).join('');
        this.currentGuess = Array(this.wordToGuess.length).fill(null);
    }

    create() {
        this.cameras.main.setBackgroundColor('#1e293b'); // slate-800

        // Title and Hint
        this.add.text(400, 50, 'Unscramble the Word!', { fontSize: '48px', color: '#fff' }).setOrigin(0.5);
        this.add.text(400, 100, `Hint: ${this.hint}`, { fontSize: '20px', color: '#94a3b8', wordWrap: { width: 700 } }).setOrigin(0.5);

        this.createAnswerSlots();
        this.createLetterSlots();

        // Feedback Text
        this.feedbackText = this.add.text(400, 500, '', { fontSize: '32px', color: '#f87171' }).setOrigin(0.5);
        
        // Submit Button
        const submitButton = this.add.text(400, 450, 'Submit', { fontSize: '32px', color: '#10b981', backgroundColor: '#059669', padding: { x: 20, y: 10 } })
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true });
            
        submitButton.on('pointerdown', () => this.checkAnswer());
    }

    shuffle(array: any[]) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    createAnswerSlots() {
        const slotWidth = 60;
        const totalWidth = this.wordToGuess.length * slotWidth;
        const startX = 400 - totalWidth / 2;

        for (let i = 0; i < this.wordToGuess.length; i++) {
            const slot = this.add.text(startX + i * slotWidth, 250, '_', { fontSize: '48px', color: '#64748b' })
                .setOrigin(0.5, 0)
                .setInteractive({ useHandCursor: true });
            
            this.answerSlots.push(slot);

            slot.on('pointerdown', () => this.returnLetter(i));
        }
    }

    createLetterSlots() {
        const slotWidth = 70;
        const totalWidth = this.scrambledWord.length * slotWidth;
        const startX = 400 - totalWidth / 2;

        for (let i = 0; i < this.scrambledWord.length; i++) {
            const letter = this.scrambledWord[i];
            const slot = this.add.text(startX + i * slotWidth, 350, letter, { fontSize: '48px', color: '#cbd5e1' })
                .setOrigin(0.5)
                .setInteractive({ useHandCursor: true });
                
            this.letterSlots.push(slot);
            
            slot.on('pointerdown', () => this.selectLetter(slot, letter));
        }
    }

    selectLetter(letterSlot: Phaser.GameObjects.Text, letter: string) {
        if (letterSlot.alpha < 1) return; // Already used

        const firstEmptyIndex = this.currentGuess.indexOf(null);
        if (firstEmptyIndex !== -1) {
            this.currentGuess[firstEmptyIndex] = letter;
            this.answerSlots[firstEmptyIndex].setText(letter);
            letterSlot.setAlpha(0.3);
        }
    }

    returnLetter(index: number) {
        const letter = this.currentGuess[index];
        if (!letter) return;
        
        this.currentGuess[index] = null;
        this.answerSlots[index].setText('_');

        // Find the original letter slot and make it visible again
        const originalSlot = this.letterSlots.find(slot => slot.text === letter && slot.alpha < 1);
        if(originalSlot) {
            originalSlot.setAlpha(1);
        }
    }

    checkAnswer() {
        const guess = this.currentGuess.join('');
        if (guess === this.wordToGuess) {
            this.feedbackText.setColor('#34d399');
            this.feedbackText.setText('Correct!');
            this.endGame(true);
        } else {
            this.feedbackText.setColor('#f87171');
            this.feedbackText.setText('Not quite, try again!');
            this.time.delayedCall(1500, () => this.feedbackText.setText(''));
        }
    }

    endGame(isWin: boolean) {
        this.children.each(child => {
            const c = child as Phaser.GameObjects.GameObject;
            if(c.input) c.disableInteractive();
        });

        const finalScore = isWin ? 150 : 0;
        
        this.time.delayedCall(1000, () => {
             this.add.text(400, 300, `You Win!\nScore: ${finalScore}`, {
                fontSize: '64px',
                color: '#34d399',
                backgroundColor: '#000000',
                align: 'center'
            }).setOrigin(0.5);
        });

        this.time.delayedCall(3000, () => {
            this.game.events.emit('gameComplete', { score: finalScore });
        });
    }
}