// IMPORTS
const assert = require('chai').assert
const expect = require('chai').expect
const path = require('path');
const Utils = require('../utils/testutils');
const T_TEST = 2 * 60; // Time between tests (seconds)
const controller = require('../../controllers/patient');
const Patient = require('../../models/patient');
const mongoose = require('mongoose');

// CRITICAL ERRORS
let error_critical = null;
let testPatient;

// (async () => {
//   try {
//     await mongoose.connect('mongodb://localhost:27006/bio_bbdd',{ useNewUrlParser: true, useUnifiedTopology: true })
//     console.log('Connected to Mongo 1!')
//   } catch (err) {
//     console.log('Error connecting to Database: ' + err)
//   }
// })()
let connConfigServer; // = mongoose.createConnection("mongodb://localhost:27001/admin"); // --> Para status replicaset config servers
let conn1; // = mongoose.createConnection("mongodb://localhost:27002/admin"); // --> Para status replicaset 1
let conn2; // = mongoose.createConnection("mongodb://localhost:27004/admin"); // --> Para status replicaset 2
let conn3; // = mongoose.createConnection("mongodb://localhost:27006/bio_bbdd"); //  --> para shardinStatus

beforeEach( async () => {
	const data = [
	   {
			name: 'Juan',
			surname: 'Rodriguez',
			dni: '123123',
			city: "Madrid",
			profession: [
				"Frutero",
				"Monitor de tiempo libre"
			],
			medicalHistory: [
				{
					"specialist": "Medico de cabecera",
					"diagnosis": "Resfriado",
					"date": new Date( 2017,4,4)
				},
				{
					"specialist": "Dermatólogo",
					"diagnosis": "Escorbuto",
					"date": new Date( 2016,11,14)
				}
			]
		},
		{
			name: 'Andres',
			surname: 'Lopez',
			dni: '222333',
			city: "Cuenca",
			profession: [
				"Futbolista"
			],
			medicalHistory: [
				{
					"specialist": "Medico de cabecera",
					"diagnosis": "Resaca",
					"date": new Date( 2018,11,14)
				},
				{
					"specialist": "Traumatologo",
					"diagnosis": "Fractura de ligamento cruzado",
					"date": new Date( 2015,5,14)
				},
				{
					"specialist": "Traumatologo",
					"diagnosis": "Esguince de tobillo",
					"date": new Date( 2016,4,24)
				}
			]
		},
		{
			name: 'Carlos',
			surname: 'Lechon',
			dni: '333444',
			city: "Madrid",
			profession: [
				"Lechero",
				"Repartidor"
			],
			medicalHistory: [
				{
					"specialist": "Reumatologo",
					"diagnosis": "Osteoporosis",
					"date": new Date( 2016,5,14)
				},
				{
					"specialist": "Medico de cabecera",
					"diagnosis": "Resfriado",
					"date": new Date( 2017,1,5)
				}
			]
		},
		{
			name: 'Diana',
			surname: 'Pintor',
			dni: '555666',
			city: "Melilla",
			profession: [
				"Pintora",
				"Directora de subastas"
			],
			medicalHistory: [
				{
					"specialist": "Medico de cabecera",
					"diagnosis": "Diarrea aguda",
					"date": new Date( 2016,5,14)
				},
				{
					"specialist": "Traumatologo",
					"diagnosis": "Síndrome del tunel carpiano",
					"date": new Date( 2019,3,15)
				}
			]
		},
		{
			name: 'Raquel',
			surname: 'Dueñas',
			dni: '666777',
			city: "Barcelona",
			profession: [
				"Chef",
				"Ayudante de cocina",
				"Camarero"
			],
			medicalHistory: [
				{
					"specialist": "Cardiologo",
					"diagnosis": "Arritmia",
					"date": new Date( 2019,3,26)
				},
				{
					"specialist": "Medico de cabecera",
					"diagnosis": "Dermatitis",
					"date": new Date( 2017,1,5)
				}
			]
		},
		{
			name: 'Mario Alejandro',
			surname: 'Arcentales',
			dni: '777888',
			city: "Oviedo",
			profession: [
				"Minero"
			],
			medicalHistory: [
				{
					"specialist": "Endocrino",
					"diagnosis": "Anemia crónica",
					"date": new Date( 2018,10,26)
				},
				{
					"specialist": "Neumologo",
					"diagnosis": "Silicosis",
					"date": new Date( 2019,10,5)
				}
			]
		},
		{
			_id: new mongoose.Types.ObjectId('5e4a60fb7be8f229b54a16cb'),
			name: 'Ana',
			surname: 'Durcal',
			dni: '555555',
			city: "Huelva",
			profession: [
				"Frutera",
				"Monitora de tiempo libre"
			],
			medicalHistory: []
		}

	];
	testPatient = {
		_id: new mongoose.Types.ObjectId('5e3a60fb7be8f029b54a16c9'),
		name: 'Ana',
		surname: 'Durcal',
		dni: '555555',
		city: "Huelva",
		profession: [
			"Frutera",
			"Monitora de tiempo libre"
		],
		medicalHistory: []
	};
	//test = await Patient.collection.insertMany(data);
});


// Close connection
after((done) => {
	// mongoose.connection.close()
	// conn1.close()
	// conn2.close()
	done()
});

//TESTS
describe("BBDD Tests", function () {

	describe('Config Server', function() {
        it('Config Server should be up, running and well configured', async function(done) {
            this.score = 1.0;
            this.msg_ok = "The config Server is up, running and well configured";
            this.msg_err = "The config server is not running or is not enable on port 27001";


		    connConfigServer = mongoose.createConnection("mongodb://localhost:27001/admin",{ serverSelectionTimeoutMS: 2000});
		    connConfigServer.on('error', (err) => {
		    	assert.equal(null, err);
			    done()
			});
			connConfigServer.on('connected', async function() {
			    console.log("connection established successfully");
			    this.msg_err = "The config server is not started on replica mode";
			    result = await connConfigServer.db.command({"replSetGetConfig":1 });
			    console.log(result)
			    done()
			});
		    // console.log(connConfigServer.readyState)
		    // result = await connConfigServer.db.command({"replSetGetConfig":1 });
		    // console.log(result)
            // connConfigServer = mongoose.createConnection("mongodb://localhost:27001/admin");
			// result = await conn.db.command({"replSetGetConfig":1 });
			// let server1 = result.config.members.find(obj => { return obj.host === 'localhost:27001'})
			//should.equal(server1.priority, 900);
		})
    });
	
    // describe('Get Patients list', function() {
    //     it('Getting the list of all available patients', async function() {
    //         this.score = 2;
    //         this.msg_err = "The patients have not been listed correctly"
    //         this.msg_ok = "Patients listed correctly!"
    //         const patients = await controller.list();
    //         assert.isAtLeast(patients.length, 7)
    //     })
    // });
	
  //   describe('Number of replicas',function() {
  //       it('The numer of replicas should be at most 4', async function() {
  //       	this.score = 1.5;
  //           this.msg_err = "The  number of members of the replica is not correct";
  //           this.msg_ok = "The number of members of the replica is correct!";
  //           result0 = await conn0.db.command({"replSetGetConfig":1 });
		// 	result1 = await conn1.db.command({"replSetGetConfig":1 });
		// 	result2 = await conn2.db.command({"replSetGetConfig":1 });
		// 	result3 = await conn3.db.command({"dbStats": 1 });
		// 	console.log("-------------------CONFIG_SERVERS----------------------")
		// 	console.log(result0.config.members)
		// 	console.log("--------------------SHARD1-------------")
		// 	console.log(result1.config.members)
		// 	console.log("---------------------SHARD2--------------------")
		// 	console.log(result2.config.members)
		// 	console.log("------------------------MONGOS-----------------")
		// 	console.log(result3)
		// 	console.log("-----------------------------------------")
		// 	assert.isAtLeast(result0.members.length, 1)
		// })
  //   });

  //   describe('Check Priority in replica 1', function() {
  //       it('Priority of localhost:27001 should be 900', async function() {
  //           this.score = 1.5;
  //           this.msg_err = "The priority number is not correct in node 1";
  //           this.msg_ok = "The priority number is correct in node 1!";
		// 	result = await conn.db.command({"replSetGetConfig":1 });
		// 	let server1 = result.config.members.find(obj => { return obj.host === 'localhost:27001'})
		// 	should.equal(server1.priority, 900);
		// })
  //   });

  //   describe('Check Priority in replica 4', function() {
  //       it('Priority of localhost:27004 should be 0', async function() {
  //           this.score = 1.5;
  //           this.msg_err = "The priority number is not correct in node 4";
  //           this.msg_ok = "The priority number is correct in node 4!";
		// 	result = await conn.db.command({"replSetGetConfig":1 });
		// 	let server4 = result.config.members.find(obj => { return obj.host === 'localhost:27004'})
		// 	should.equal(server4.priority, 0);
		// })
  //   });

  //   describe('Check slaveDelay in replica 4', function() {
  //       it('SlaveDelay of localhost:27004 should be 60', async function() {
  //           this.score = 1.5;
  //           this.msg_err = "The slaveDelay time is not correct in node 4";
  //           this.msg_ok = "The slaveDelay number is correct in node 4!";
		// 	result = await conn.db.command({"replSetGetConfig":1 });
		// 	let delays = result.config.members.map(a => a.slaveDelay || a.secondaryDelaySecs);
		// 	expect(delays).to.include(60)
		// })
  //   });

  //   describe('Check if there is arbiter', function() {
  //       it('Shpuld exists an instance of mongo configured as arbiter', async function() {
  //           this.score = 2;
  //           this.msg_err = "Arbiter not found";
  //           this.msg_ok = "Arbiter found!";
		// 	result = await conn.db.command({"replSetGetConfig":1 });
		// 	let arbiters = result.config.members.map(a => a.arbiterOnly);
		// 	expect(arbiters).to.include(true)
		// })
  //   });

});
