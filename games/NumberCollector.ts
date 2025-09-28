// FIX: Add import for Phaser to resolve TypeScript errors related to missing Phaser types.
import Phaser from 'phaser';

export class NumberCollectorScene extends Phaser.Scene {
    // FIX: Declare scene properties explicitly to resolve TypeScript errors.
    public readonly cameras!: Phaser.Cameras.Scene2D.CameraManager;
    public readonly physics!: Phaser.Physics.Arcade.ArcadePhysics;
    public readonly add!: Phaser.GameObjects.GameObjectFactory;
    public readonly input!: Phaser.Input.InputPlugin;
    public readonly time!: Phaser.Time.Clock;
    public readonly game!: Phaser.Game;

    private player!: Phaser.Physics.Arcade.Sprite;
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
    private scoreText!: Phaser.GameObjects.Text;
    private score: number = 0;
    private targetNumber: number = 3;
    private numbersGroup!: Phaser.Physics.Arcade.Group;
    private targetScore: number = 5;

    constructor() {
        super({ key: 'NumberCollectorScene' });
    }

    create() {
        this.cameras.main.setBackgroundColor('#2d2d2d');

        // Player
        this.player = this.physics.add.sprite(400, 550, 'player');
        this.player.setCollideWorldBounds(true);
        this.player.body.setSize(100, 20);
        this.player.setImmovable(true);
        
        // FIX: generateTexture creates a texture from a graphics object, which can then be applied to the sprite using its string key.
        // The setTexture method expects the key, not a Graphics or Texture object. Also removed redundant setTint.
        // Use a simple rectangle for the player graphic
        const playerGraphics = this.add.graphics();
        playerGraphics.fillStyle(0x14b8a6, 1);
        playerGraphics.fillRect(-50, -10, 100, 20);
        playerGraphics.generateTexture('player', 100, 20);
        this.player.setTexture('player');
        playerGraphics.destroy();


        // Input
        this.cursors = this.input.keyboard.createCursorKeys();

        // Score
        this.scoreText = this.add.text(16, 16, `Collect ${this.targetScore} multiples of ${this.targetNumber}\nScore: 0`, { fontSize: '24px', color: '#fff' });

        // Numbers Group
        this.numbersGroup = this.physics.add.group();

        // Collision
        // FIX: Use fully qualified name for ArcadePhysicsCallback type.
        this.physics.add.collider(this.player, this.numbersGroup, this.collectNumber as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback, undefined, this);

        // Spawn numbers periodically
        this.time.addEvent({
            delay: 1500,
            callback: this.spawnNumber,
            callbackScope: this,
            loop: true
        });
    }

    update() {
        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-350);
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(350);
        } else {
            this.player.setVelocityX(0);
        }
    }

    spawnNumber() {
        const x = Phaser.Math.Between(50, 750);
        let numValue: number;

        // 40% chance of spawning a correct number. This makes the game more challenging.
        const shouldBeCorrect = Phaser.Math.FloatBetween(0, 1) < 0.4;

        if (shouldBeCorrect) {
            // Generate a multiple of the target number
            numValue = this.targetNumber * Phaser.Math.Between(2, 10);
        } else {
            // Generate a random number that is NOT a multiple of the target
            do {
                numValue = Phaser.Math.Between(1, 30);
            } while (numValue % this.targetNumber === 0);
        }

        // Create a text object for the number.
        const numberText = this.add.text(x, 16, numValue.toString(), {
            fontSize: '32px',
            color: '#fff',
            backgroundColor: '#000',
            padding: { x: 8, y: 4 }
        }).setOrigin(0.5);

        // Add the text object directly to the physics group.
        // This automatically enables physics on it, allowing it to fall.
        this.numbersGroup.add(numberText);

        // Store the number's value in its data manager for later checks.
        numberText.setData('value', numValue);
        
        // Give the falling number a slight bounce.
        (numberText.body as Phaser.Physics.Arcade.Body).setBounceY(Phaser.Math.FloatBetween(0.1, 0.3));
    }

    collectNumber(player: Phaser.Types.Physics.Arcade.GameObjectWithBody, numberObject: Phaser.Types.Physics.Arcade.GameObjectWithBody) {
        const numberGameObject = numberObject as Phaser.GameObjects.Text;
        const value = numberGameObject.getData('value');
        
        if (value % this.targetNumber === 0) {
            this.score++;
            this.scoreText.setText(`Collect ${this.targetScore} multiples of ${this.targetNumber}\nScore: ${this.score}`);
            if (this.score >= this.targetScore) {
                this.endGame(true);
            }
        } else {
            this.cameras.main.shake(100, 0.01);
            this.endGame(false);
        }

        numberObject.destroy();
    }
    
    endGame(isWin: boolean) {
        this.physics.pause();
        this.time.removeAllEvents();

        const finalScore = isWin ? 100 + (this.score * 10) : 0;
        const message = isWin ? `You Win!\nScore: ${finalScore}` : 'Game Over!';
        
        const endText = this.add.text(400, 300, message, {
            fontSize: '64px',
            color: isWin ? '#00ff00' : '#ff0000',
            backgroundColor: '#000000',
            align: 'center'
        }).setOrigin(0.5);

        this.time.delayedCall(2000, () => {
            this.game.events.emit('gameComplete', { score: finalScore });
        });
    }
}