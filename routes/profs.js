var express = require('express')
var app = express()
var ObjectId = require('mongodb').ObjectId

// SHOW LIST OF profs
app.get('/', function(req, res, next) {	
	// fetch and sort profs collection by id in descending order
	req.db.collection('profs').find().sort({"_id": -1}).toArray(function(err, result) {
		//if (err) return console.log(err)
		if (err) {
			req.flash('error', err)
			res.render('profs/list', {
				title: 'profs List', 
				data: ''
			})
		} else {
			// render to views/profs/list.ejs template file
			res.render('profs/list', {
				title: 'profs List', 
				data: result
			})
		}
	})
})

// SHOW ADD profs FORM
app.get('/add', function(req, res, next){	
	// render to views/profs/add.ejs
	res.render('profs/add', {
		title: 'Add New profs',
		nom: '',
		prenom: '',
		adresse: '',
		email: ''		
	})
})

// ADD NEW profs POST ACTION
app.post('/add', function(req, res, next){	
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

// SHOW EDIT profs FORM
app.get('/edit/(:id)', function(req, res, next){
	var o_id = new ObjectId(req.params.id)
	req.db.collection('profs').find({"_id": o_id}).toArray(function(err, result) {
		if(err) return console.log(err)
		
		// if profs not found
		if (!result) {
			req.flash('error', 'profs not found with id = ' + req.params.id)
			res.redirect('/profs')
		}
		else { // if profs found
			// render to views/profs/edit.ejs template file
			res.render('profs/edit', {
				title: 'Edit profs', 
				//data: rows[0],
				id: result[0]._id,
				nom: result[0].nom,
				prenom: result[0].prenom,
				adresse: result[0].adresse,
				email: result[0].email					
			})
		}
	})	
})

// EDIT profs POST ACTION
app.post('/edit/(:id)', function(req, res, next) {
	req.assert('nom', 'Name is required').notEmpty()           //Validate name
	req.assert('prenom', 'Name is required').notEmpty()           //Validate name
	req.assert('email', 'Name is required').isEmail()           //Validate name
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
			adresse: req.sanitize('adresse').escape().trim(),
			email: req.sanitize('email').escape().trim()
		}
		
		var o_id = new ObjectId(req.params.id)
		req.db.collection('profs').update({"_id": o_id}, profs, function(err, result) {
			if (err) {
				req.flash('error', err)
				
				// render to views/profs/edit.ejs
				res.render('profs/edit', {
					title: 'Edit profs',
					id: req.params.id,
					nom: req.body.nom,
					prenom: req.body.prenom,
					adresse: req.body.adresse,
					email: req.body.email
				})
			} else {
				req.flash('success', 'Data updated successfully!')
				
				res.redirect('/profs')
				
				// render to views/profs/edit.ejs
				/*res.render('profs/edit', {
					title: 'Edit profs',
					id: req.params.id,
					name: req.body.name,
					age: req.body.age,
					email: req.body.email
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
        res.render('profs/edit', { 
            title: 'Edit profs',            
			id: req.params.id, 
			nom: req.body.nom,
			prenom: req.body.prenom,
			adresse: req.body.adresse,
			email: req.body.email
        })
    }
})

// DELETE profs
app.delete('/delete/(:id)', function(req, res, next) {	
	var o_id = new ObjectId(req.params.id)
	req.db.collection('profs').remove({"_id": o_id}, function(err, result) {
		if (err) {
			req.flash('error', err)
			// redirect to profs list page
			res.redirect('/profs')
		} else {
			req.flash('success', 'profs deleted successfully! id = ' + req.params.id)
			// redirect to profs list page
			res.redirect('/profs')
		}
	})	
})

module.exports = app
