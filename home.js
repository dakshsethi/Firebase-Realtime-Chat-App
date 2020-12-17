const all = document.querySelector('#all-accounts');

//Creating User Elememt and Render List
function renderList(sender, doc) {

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

    // <span class="btn btn-primary mx-1" style="border-radius: 50%;">11</span>
    let unseen_msg = document.createElement('SPAN');
    unseen_msg.classList.add('btn');
    unseen_msg.classList.add('btn-primary');
    unseen_msg.classList.add('mx-1');
    unseen_msg.style.borderRadius = '50%';

    
    const receiver = a.dataset.id;
    const user = [sender, receiver];
    user.sort();
    console.log(user);

    // db.collection('message').where('user','==',user).where('sid','==',receiver).get().then(snapshot => {
    //     let messages = snapshot.docChanges();
    //     //console.log(messages);
    //     let count = 0;
    //     messages.forEach(message => {
    //         console.log(message);
    //         if(messages.type == 'added' || message.type == 'modified')
    //             count++;
    //         count++;
    //         //console.log(count);
    //     })
    //     if(count!=0) {
    //         unseen_msg.textContent = count;
    //         div2.appendChild(unseen_msg);
    //     }
    // })

    db.collection('message').where('user','==',user).get().then(snapshot => {
        let messages = snapshot.docChanges();
        messages.forEach(message => {
            console.log(message.doc.data().message);
        })
    })

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
            renderList(id, change.doc);
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
    
    const user = [sender, receiver];
    user.sort();
    
    
    //Get the user's chat with the above id
    getChatData(sender, receiver);

    //Make all the messages as seen
    msgSeen(user, receiver);
}

function msgSeen(user, receiver) {
    db.collection('message').where('user','==',user).where('sid','==',receiver).where('seen','==',false).orderBy('timestamp').onSnapshot(snapshot => {
        let messages = snapshot.docChanges();
        messages.forEach(message => {
            const msgid = message.doc.id;
            const queryString = window.location.search;
            const urlParams = new URLSearchParams(queryString);
            const r = urlParams.get('id');
            if(r == receiver) {
                db.collection('message').doc(msgid).update({
                    seen: true
                });
            }
        });
    })
}

async function getChatData(sender, receiver) {
    //Printing the receiver
    db.collection('userDetails').doc(receiver).get().then(info => {
        var data = info.data();
        // console.log(data);
        const name = document.getElementById('chat_name');
        name.textContent = data.name;
    });

    const user = [sender, receiver];
    user.sort();

    db.collection('message').where('user','==',user).orderBy('timestamp').onSnapshot(snapshot => {
        let messages = snapshot.docChanges();
        messages.forEach(message => {
            const queryString = window.location.search;
            const urlParams = new URLSearchParams(queryString);
            const r = urlParams.get('id');
            if(r == receiver) {
                if(message.type == 'added')
                    renderChat(sender, receiver, message);
            }
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

    const x = chat_box.lastChild;
    if(x!=null) {
        const ele = x.firstChild;
        if((ele.classList.contains('sender') && msg.sid==sender) || (ele.classList.contains('receiver') && msg.sid==receiver))
            col12.style.marginTop = '-14px';
    }

    let msgBox = document.createElement("DIV");

    let ti = document.createElement("SPAN");
    ti.setAttribute('id',message.doc.id);

    let tick = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 15" width="16" height="15">
                    <path fill="currentColor" d="M15.01 3.316l-.478-.372a.365.365 0 0 0-.51.063L8.666 9.879a.32.32 0 0 1-.484.033l-.358-.325a.319.319 0 0 0-.484.032l-.378.483a.418.418 0 0 0 .036.541l1.32 1.266c.143.14.361.125.484-.033l6.272-8.048a.366.366 0 0 0-.064-.512zm-4.1 0l-.478-.372a.365.365 0 0 0-.51.063L4.566 9.879a.32.32 0 0 1-.484.033L1.891 7.769a.366.366 0 0 0-.515.006l-.423.433a.364.364 0 0 0 .006.514l3.258 3.185c.143.14.361.125.484-.033l6.272-8.048a.365.365 0 0 0-.063-.51z"></path>
                </svg>`;

    if(msg.type==1) {
        msgBox.classList.add('py-2');
        msgBox.classList.add('px-3');
        msgBox.classList.add('my-2');
        msgBox.classList.add('chatMsg');
        msgBox.innerHTML = msg.message;

        if(msg.sid == sender) {
            col12.classList.add('justify-content-end');
            
            msgBox.classList.add('sender');
            msgBox.innerHTML = msg.message;
            msgBox.appendChild(ti);
            ti.innerHTML = tick;
            if(msg.seen == true) {
                ti.style.color = '#3686ff';
            } else {
                ti.style.color = 'gray';
            }
            
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

    var ele = document.querySelector('#chat_box');
    ele.scrollIntoView(false); // Bottom
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
        timestamp: timestamp,
        seen: false
    }).catch(error => {
        console.log(error);
    });

    add.text.value = '';
})