const all = document.querySelector('#all-accounts');

//Creating User Elememt and Render List
function renderList(doc) {

    // <div class="card m-1" style="border-radius: 10px;">
    //     <div class="card-body d-flex justify-content-between">
    //         <div>
    //             <h5 class="card-title">Daksh Sethi</h5>
    //             <h6 class="card-subtitle mb-2 text-muted">Client</h6>
    //         </div>
    //         <div>
    //             <a href="#" class="card-link btn btn-primary float-right" style="border-radius: 22.5px;">Message</a>
    //         </div>
    //     </div>
    // </div>

    let card = document.createElement('DIV');
    card.classList.add('card');
    card.classList.add('m-1');
    card.style.borderRadius = '10px';

    let card_body = document.createElement("DIV");
    card_body.classList.add('card-body');
    card_body.classList.add('d-flex');
    card_body.classList.add('justify-content-between');

    let div1 = document.createElement('DIV');
    let h5 = document.createElement('h5');
    h5.classList.add('card-title');
    h5.textContent = doc.data().name;

    let h6 = document.createElement('h6');
    h6.classList.add('card-subtitle');
    h6.classList.add('mb-2');
    h6.classList.add('text-muted');
    if(doc.data().type==1)
        h6.textContent = 'Crew';
    else
        h6.textContent = 'Client';


    let div2 = document.createElement('DIV');
    let a = document.createElement('A');
    a.classList.add('card-link');
    a.classList.add('btn');
    a.classList.add('btn-primary');
    a.setAttribute('data-id',doc.id);
    a.setAttribute('href','#');
    a.style.borderRadius = '22.5px';
    a.textContent = 'Message';

    card.appendChild(card_body);
    card_body.appendChild(div1);
    card_body.appendChild(div2);
    div1.appendChild(h5);
    div1.appendChild(h6);
    div2.appendChild(a);

    all.appendChild(card);

    //Trigeering Chat Box with Chat
    a.addEventListener('click', (e) => {
        e.preventDefault();

        //Changing the url
        changeURL(a.dataset.id);
    })

}

//Real-time Listener
function gettingData(id) {
    db.collection('userDetails').where('uid','!=',id).get().then(snapshot => {
        let changes = snapshot.docChanges();
        changes.forEach(change => {
            // if(change.type == 'added') {
            //     renderList(change.doc);
            // } else if (change.type == 'removed') {
            //     let text = itemList.querySelector('[data-id=' + change.doc.id + ']');
            //     itemList.removeChild(text);
            // }
            renderList(change.doc);
        })
    });
}

function changeURL(id) {
    // Construct URLSearchParams object instance from current URL querystring.
    var queryParams = new URLSearchParams(window.location.search);
        
    // Set new or modify existing parameter value. 
    queryParams.set("id", id);
            
    // Replace current querystring with the new one.
    history.replaceState(null, null, "?"+queryParams.toString());

    //Clearing Chat Box
    let chat_box = document.querySelector('#chat_box');
    chat_box.textContent = '';
    
    //Update Data
    updateData();
    
}

function updateData() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const receiver = urlParams.get('id');
    const sender = document.querySelector('#logout').dataset.uid;
    console.log('receiver = ' + receiver);
    console.log('sender   = ' + sender);
    
    //Get the user's chat with the above id
    getChatData(sender, receiver);
}


let x = 0;
async function getChatData(sender, receiver) {
    db.collection('userDetails').doc(receiver).get().then(info => {
        var data = info.data();
        // console.log(data);
        const name = document.getElementById('chat_name');
        name.textContent = data.name;
    });

    const user = [sender, receiver];
    user.sort();
    console.log(user);
    db.collection('message').where('user','==',user).orderBy('timestamp').onSnapshot(snapshot => {
        let messages = snapshot.docChanges();
        messages.forEach(message => {
            if(message.type == 'added')
                renderChat(sender, receiver, message);
        })
    })
}


function renderChat(sender, receiver, message) {
    let msg = message.doc.data();

    let chat_box = document.querySelector('#chat_box');
    let col12 = document.createElement("DIV");
    col12.classList.add('col-12');
    col12.classList.add('d-flex');
    col12.setAttribute('data-id',message.doc.id);

    let msgBox = document.createElement("DIV");
    if(msg.type==1) {
        msgBox.classList.add('py-2');
        msgBox.classList.add('px-3');
        msgBox.classList.add('my-2');
        msgBox.classList.add('chatMsg');
        msgBox.textContent = msg.message;

        if(msg.sid == sender) {
            col12.classList.add('justify-content-end');
            
            msgBox.classList.add('sender');
            
        } else {
            msgBox.classList.add('receiver');
        }
    } else {
        //This is for the Contract Notifications!
        col12.classList.add('justify-content-center');

        msgBox.classList.add('px-5');
        msgBox.classList.add('py-1');
        msgBox.classList.add('notification');
        msgBox.textContent = '🛈 ' + msg.message;
    }

    col12.appendChild(msgBox);
    chat_box.appendChild(col12);
}


//Sending Messages
const add = document.querySelector('#sendMsg');
add.addEventListener('submit', (e) => {
    e.preventDefault();
    
    //Get message for chat
    const message = add['text'].value;

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const receiver = urlParams.get('id');
    const sender = document.querySelector('#logout').dataset.uid;

    const timestamp = Date.now();
    const user = [sender, receiver];
    user.sort();

    db.collection('message').add({
        user: user,
        type: 1,
        sid: sender,
        message: message,
        timestamp: timestamp
    }).catch(error => {
        console.log(error);
    });

    add.text.value = '';
})