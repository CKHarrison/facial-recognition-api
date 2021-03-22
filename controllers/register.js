const handleRegister = (req, res, db, bcrypt) => {
  const { email, name, password } = req.body;
  // validate for empty data
  if(!email || !name || !password) {
   return res.status(400).json('incorrect form submission');
  }
  // store password and hash it
  const hash = bcrypt.hashSync(password);
  //create transaction
  db.transaction(trx => {
    trx.insert({
      hash: hash,
      email: email,
    })
      .into('login')
      .returning('email')
      .then(loginEmail => {
        //knex has a method that returns the user back to you -- returning
        return trx('users')
          .returning('*') // this returns all columns
          .insert({
            email: loginEmail[0],
            name: name,
            joined: new Date()
          }).then(user => {
            // Always remember to respond -- in this case, the last user(The one that was just registered)
            res.json(user[0]);
          })
      })
      .then(trx.commit)
      .catch(trx.rollback)
  })
    .catch(err => res.status(400).json('unable to register'));
}

module.exports = {
  handleRegister: handleRegister
};