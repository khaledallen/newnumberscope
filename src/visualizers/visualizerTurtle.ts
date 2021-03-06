import p5 from 'p5';
import { visualizerDefault } from './visualizerDefault';
import { visualizerInterface, visualizerParamsSchema, visualizerExportModule } from './visualizerInterface';
import { ValidationStatus } from '@/shared/validationStatus';
import { SequenceInterface } from '@/sequences/sequenceInterface';

const schemaTurtle = [
	new visualizerParamsSchema(
		"domain",
		'text',
		'Sequence Domain',
		true,
		"0,1,2,3,4",
		'Comma seperated numbers',
	),
	new visualizerParamsSchema(
		"range",
		'text',
		'Angles',
		true,
		"30,45,60,90,120",
		'Comma seperated numbers',
	),
	new visualizerParamsSchema(
		"stepSize",
		'number',
		'Step Size',
		true,
		20,
	),
	new visualizerParamsSchema(
		"strokeWeight",
		'number',
		'Stroke Width',
		true,
		5
	),
	new visualizerParamsSchema(
		"startingX",
		'number',
		'X start',
		false,
		0,
		"Where to start drawing"
	),
	new visualizerParamsSchema(
		"startingY",
		'number',
		'Y start',
		false,
		0,
		"Where to start drawing"
	),
	new visualizerParamsSchema(
		'bgColor',
		'text',
		'Background Color',
		false,
		"#666666"
	),
	new visualizerParamsSchema(
		'strokeColor',
		'text',
		'Stroke Color',
		false,
		'#ff0000'
	)
]

// Turtle needs work
// Throwing the same error on previous numberscope website
class VisualizerTurtle extends visualizerDefault implements visualizerInterface {

    name = "Turtle";
	private rotMap: {[key: number]: number} = {};
	private domain: number[] = [];
	private range: number[] = [];
	private currentIndex = 0;
	private orientation = 0;
	private X = 0;
	private Y = 0;

	constructor() {
        super();
		this.params = schemaTurtle;
	}

	initialize(sketch: p5, seq: SequenceInterface){
        this.sketch = sketch;
		this.seq = seq;
		
		this.currentIndex = 0;
		this.orientation = 0;
		this.X = 0;
		this.Y = 0;

        console.log('initializing turtle');
		for (let i = 0; i < this.domain.length; i++) {
			this.rotMap[this.domain[i]] = (Math.PI / 180) * this.range[i];
		}

		this.ready = true;
	}

    validate() {
		this.assignParams();

		const domain = String(this.settings.domain).split(',');
		const range = String(this.settings.range).split(',');
		this.domain = domain.map( n => Number(n));
		this.range = range.map ( n => Number(n));
        
        const status = new ValidationStatus(true);
        if(this.domain.length != this.range.length){
            status.isValid = false
            status.errors.push("Domain and range must have the same number of entries");
        }
		this.isValid = true;
        return status;
    }

	setup() {
		this.X = this.sketch.width / 2;
		this.Y = this.sketch.height / 2;
		this.sketch.background(String(this.settings.bgColor));
		this.sketch.stroke(String(this.settings.strokeColor));
		this.sketch.strokeWeight(Number(this.settings.strokeWidth));
        this.sketch.frameRate(30);
	}

	draw() {
		const currElement = this.seq.getElement(this.currentIndex++);
		const angle = this.rotMap[currElement];

		if (angle == undefined) this.sketch.noLoop();

        const oldX = this.X;
        const oldY = this.Y;

        this.orientation = (this.orientation + angle);
        this.X += Number(this.settings.stepSize) * Math.cos(this.orientation);
        this.Y += Number(this.settings.stepSize) * Math.sin(this.orientation);

        this.sketch.line(oldX,oldY,this.X,this.Y);
	}
}



export const exportModule = new visualizerExportModule(
	"Turtle",
	VisualizerTurtle,
	""
);
