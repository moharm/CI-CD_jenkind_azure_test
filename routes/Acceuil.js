var express = require('express')
var app = express()

app.get('/', function(req, res) {
	// render to views/index.ejs template file
	req.db.collection('Etudiant').find().sort({"_id": -1}).toArray(function(err, result) {
		//if (err) return console.log(err)
		if (err) {
			req.flash('error', err)
			res.render('error', {
				title: 'error', 
				data: ''
			})
		} else {
			// render to views/Acceuil.ejs template file
			res.render('Acceuil', {
				title: 'Acceuil', 
				data: result
			})
		}
	})})

	app.get('/AjouterPost', function(req, res) {
		// render to views/index.ejs template file
		req.db.collection('Etudiant').find().sort({"_id": -1}).toArray(function(err, result) {
			//if (err) return console.log(err)
			if (err) {
				req.flash('error', err)
				res.render('error', {
					title: 'error', 
					data: ''
				})
			} else {
				// render to views/Acceuil.ejs template file
				res.render('AjouterPost', {
					title: 'AjouterPost', 
					data: result
				})
			}
		})})



	app.post('/AjouterPost', function(req, res, next){	
		req.assert('nom', 'Name is required').notEmpty()           //Validate name
		req.assert('prenom', 'Age is required').notEmpty()             //Validate age
		req.assert('email', 'A valid email is required').isEmail()  //Validate email
		req.assert('password', 'Age is required').notEmpty()             //Validate age
		req.assert('adresse', 'Age is required').notEmpty()             //Validate age
	
		var errors = req.validationErrors()
		
		if( !errors ) {   //No errors were found.  Passed Validation!
			
			/********************************************
			 * Express-validator module
			 
			req.body.comment = 'a <span>comment</span>';
			req.body.profsname = '   a profs    ';
	
			req.sanitize('comment').escape(); // returns 'a &lt;span&gt;comment&lt;/span&gt;'
			req.sanitize('profsname').trim(); // returns 'a profs'
			********************************************/
			var profs = {
				nom: req.sanitize('nom').escape().trim(),
				prenom: req.sanitize('prenom').escape().trim(),
				email: req.sanitize('email').escape().trim(),
				adresse: req.sanitize('adresse').escape().trim(),
				password: req.sanitize('password').escape().trim(),
	
			}
					 
			req.db.collection('profs').insert(profs, function(err, result) {
				if (err) {
					req.flash('error', err)
					
					// render to views/profs/add.ejs
					res.render('profs/form', {
						title: 'Add New profs',
						nom: profs.nom,
						prenom: profs.prenom,
						adresse: profs.adresse,
						email: profs.email					
					})
				} else {				
					req.flash('success', 'Data added successfully!')
					
					// redirect to profs list page				
					res.redirect('/profs')
					
					// render to views/profs/add.ejs
					/*res.render('profs/add', {
						title: 'Add New profs',
						name: '',
						age: '',
						email: ''					
					})*/
				}
			})		
		}
		else {   //Display errors to profs
			var error_msg = ''
			errors.forEach(function(error) {
				error_msg += error.msg + '<br>'
			})				
			req.flash('error', error_msg)		
			
			/**
			 * Using req.body.name 
			 * because req.param('name') is deprecated
			 */ 
			res.render('profs/add', { 
				title: 'Add New profs',
				nom: profs.nom,
				prenom: profs.prenom,
				adresse: profs.adresse,
				email: profs.email
			})
		}
	})

/** 
 * We assign app object to module.exports
 * 
 * module.exports exposes the app object as a module
 * 
 * module.exports should be used to return the object 
 * when this file is required in another module like app.js
 */ 
module.exports = app;