//Login
const login = document.querySelector('#login');
login.addEventListener('submit', (e) => {
    e.preventDefault();

    //Getting Login Data
    const email = login['email'].value;
    const password = login['password'].value;

    auth.signInWithEmailAndPassword(email, password).then(cred => {
        location.replace('home.html');
    }).catch(error => {
        if(error.code == 'auth/wrong-password')
            alert(error.message);
    })
})

//SignUp
const signup = document.querySelector('#signup');
signup.addEventListener('submit', (e) => {
    e.preventDefault();

    //Getting user data
    const name = signup['name'].value;
    const email = signup['email'].value;
    const password = signup['password'].value;
    const type = parseInt(signup['type'].value);

    auth.createUserWithEmailAndPassword(email, password).then(cred => {
        db.collection('userDetails').add({
            uid: cred.user.uid,
            name: name,
            email: email,
            type: type
        }).catch(error => {
            console.log('error');
        });
    }).catch(error => {
        if(error.code == 'auth/email-already-in-use')
            alert(error.message);
        else if(error.code == 'auth/weak-password')
            alert(error.message)
    });

    signup.name.value = '';
    signup.email.value = '';
    signup.password.value = '';
    document.getElementById('crew').checked = false;
    document.getElementById('client').checked = false;

    //alert('Account Created Successfully!!');
    //location.replace('home.html');
});