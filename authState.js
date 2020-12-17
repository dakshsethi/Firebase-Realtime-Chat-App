// Listen for Auth State Chnages
auth.onAuthStateChanged(user => {
    if (user) {
        console.log('user logged in : ', user.uid);
        //const uid = user.uid;
        //console.log(user.uid);
        // document.querySelector('#logout').setAttribute('data-uid',user.uid);
        db.collection('userDetails').where('uid','==',user.uid).get().then(snapshot => {
            let changes = snapshot.docChanges();
            changes.forEach(change => {
                console.log('user firestore id = ' + change.doc.id);
                document.querySelector('#logout').setAttribute('data-uid',change.doc.id);
                gettingData(user.uid);
            })
        })
        //return user.uid;
        //getData(uid);
    } else {
        alert("Kindly Login First");
        location.replace("index.html");
    }
});


const logout = document.querySelector('#logout');
logout.addEventListener('click', (e) => {
    e.preventDefault();

    auth.signOut().then(() => {
        location.replace('index.html');
    });
})