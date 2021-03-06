/* File source: ../src/Ambitious_Dwarf///src/engine/containers/vectorvariations.js */
/**
 * Coordinate vectors are used to denote coordinates, but will accept vector operations
 */
class CoordinateVector extends Vector{
    constructor( ...args ){
        super(...args);
        this.variation = CoordinateVector;
    }
}

/**
 * Defines a region
 */
class Rectangle extends Vector{
	constructor(...args){
        super(...args);
        this.variation = Rectangle;
    }
    
    get width(){
        return this.z;
    }

    set width(x){
        this.z = x;
    }

    get height(){
        return this.a;
    }

    set height(n){
        this.a = n;
    }

	includes( v ){
		return Math.isInRange( v.x, this.x, this.x+this.z ) && Math.isInRange( v.y, this.y, this.y+this.a );
	}
}

/* File source: ../src/Ambitious_Dwarf///src/initmethods.js */
const FS = require("fs");
var LDIV = document.getElementById("log");
/**
 * This section is for global access
 */
Townsend = {
	instance:{},
	analytics:{},
	locked:{}, // Stuff that i thought would work, but doesn't
	batch:{
		count:0,
		overflowOffset: new Vector(1,0)
	},
	tiles:{},
	sprites:{},
	neighbourOffsetVectors:{
		north: new Vector( 0, -1 ),
		east: new Vector( 1,0 ),
		south: new Vector( 0, 1 ),
		west: new Vector( -1, 0)
	},
	neighbourDiagonalOffsetVectors:{
		northWest: new Vector( -1, -1 ),
		northEast: new Vector( 1, -1),
		southEast: new Vector( 1, 1),
		southWest: new Vector( -1, 1)
	},
	placeholders:{
		empty2dVector: new Vector( 0,0 ),
		chunkExtendVector: new Rectangle( 0, 0, 1, 1 ),
		personShadowBoundModifier: new Vector(0,16)
	},
	progressBarUpdaters:{

	},
	eventEmitter: new SimpleEventEmitter(100),
	GUI:{
		containers:{}
	},
	safety:{
		memUsed:()=>{
			var a = process.memoryUsage();
			return a.rss + a.heapUsed;
		},
		heapWatch:()=>{
			var a = process.memoryUsage(),
				b = a.rss + a.heapUsed;
			if(b/1024/1024>cfg.memory_max){
				alert(`[TSINTERFACE.safety] "Memory cap reached! Terminating."\n [${Math.floor(b/1024/1024)}/${cfg.memory_max}] mb `);
				process.exit();
			}
			return b;
		}
	}
};

var TSINTERFACE = Townsend;

// Translate labled neighbours to iterable array
TSINTERFACE.neighbourOffsetVectorList = Object.values( TSINTERFACE.neighbourOffsetVectors );
TSINTERFACE.neighbourDiagonalOffsetVectorList = Object.values( TSINTERFACE.neighbourDiagonalOffsetVectors );
TSINTERFACE.neighbourMergedOffsetVectorList = Object.values( TSINTERFACE.neighbourOffsetVectors );
TSINTERFACE.neighbourMergedOffsetVectorList.push( ...Object.values( TSINTERFACE.neighbourDiagonalOffsetVectors ) );

/**
 * This section is for native window
 */
if( nw ){
	TSINTERFACE.Window = nw.Window.get();
	TSINTERFACE.Window.maximize();
}

/**
 * This section is for making sure all sprite atalases are loaded
 */
TSINTERFACE.tilesheetsReady = 0;
TSINTERFACE.allTilesheetsLoaded = false;
var tilesheetReadyCheck = function(){
	TSINTERFACE.tilesheetsReady++;
	TSINTERFACE.allTilesheetsLoaded = Object.keys(TSINTERFACE.spritesheet).length <= TSINTERFACE.tilesheetsReady;
	console.log(`${TSINTERFACE.tilesheetsReady}/${Object.keys(TSINTERFACE.spritesheet).length} loaded`)
	if( TSINTERFACE.allTilesheetsLoaded ){
		console.log("All spritesheets loaded and ready to go!");
	}
}


var initMethods = [];

function start(){
	console.log("starting");
	initMethods.map( function(f){
		f();
	});
}

/* File source: ../src/Ambitious_Dwarf///src/game/actor.js */
var IDENTITIES = [];
var ITRIDCTR = 0;
var NUMBER_OF_UUIDS = 0;
var ACTORS = [];

class Actor{
    constructor( baseIdentity ){
        this.identities = [];
        if(baseIdentity) this.addIdentity(baseIdentity);
        this.uuid = this.gITRID(); // Defined in ^ utils/string.js
        NUMBER_OF_UUIDS++;
        ACTORS.push(this);
    }

    static getAllWithIdentity( identity ){
        return ACTORS.filter( (x)=>{return x.hasIdentity(identity);} );
    }

    static getAllWithCondition( callback ){
        return ACTORS.filter( callback );
    }

    static getAllMatches( regex ){
        return ACTORS.filter( (x)=>{return x.identityString.match(regex);} );
    }

    gITRID(){
        var id = ITRIDCTR;
        ITRIDCTR++;
        return id;
    }

    /**
	 * Add a unique identity to the tile, ie. it's name
	 * @param {String} identity 
	 */
	addIdentity( identity ){
        if(!IDENTITIES.includes(identity)){
            IDENTITIES.push(identity);
        }
		this.identities.push( IDENTITIES.indexOf( identity ) );
    }

    hasIdentity( identity ){
        return this.identities.indexOf( IDENTITIES.indexOf(identity ) ) != -1;
    }
    
    get identityString(){
        return this.identities.map( (index)=>{ return IDENTITIES[index]; } ).join("-");
    }
}



/* File source: ../src/Ambitious_Dwarf///src/localization/words.js */
class Noun{
    constructor( singularPlain, pluralPlain, singularPosessive, pluralPosessive ){
        this.singularPlain = singularPlain;
        this.pluralPlain = pluralPlain || `${singularPlain}s`;
        this.singularPosessive = singularPosessive || `${singularPosessive}'s`;
        this.pluralPosessive = pluralPosessive || `${singularPosessive}s'`;
    }
}

/* File source: ../src/Ambitious_Dwarf///src/localization/localization.js */
class Localizer{
	constructor(){}
	combine( strings ){
		return strings.join(" ");
	}
}

/* File source: ../src/Ambitious_Dwarf///src/localization/en_us.js */
let STR = new Localizer();

STR.debug = "Debug Debug Debug";

STR.class = {
	Canvas2DContextPlus:"Canvas2DContextPlus",
	Vector: "Vector"
}

STR.error = {
	NF:"not found",
}

STR.htmlTag = {
	IMG:"img",
	CANVAS:"canvas"
}

STR.ID = {
	rendering: "rendering",
	prerendering: "prerendering",
	contextType: "2d"
}

STR.tile = {
	tile:"blank"
}

STR.itemDesc = {
	default: `This is an item.`,
	log:`Good ol' wood can do just about anything!`,
	stone:`As hard as rock. Because it is rock. (Also because it rocks)`
}

