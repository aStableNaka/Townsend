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