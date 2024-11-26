document.getElementById('username').innerText = 'YourUsername';

function openOverlay(action) {
    const body = document.getElementById('overlay-body')
    document.getElementById("fullscreenOverlay").style.display = "flex";
    let isValidAction = true;
    
    if (action === 'Lock State') {
        let isLocked = true
        if (isLocked === true) {
            body.classList.add('bg-danger')
        } else {
            body.classList.add('bg-success')
        }

        let lockElement = body.querySelector('.fa-lock, .fa-unlock')

        if (!lockElement) {
            lockElement = document.createElement('i')
            if (isLocked) {
                lockElement.classList.add('fa', 'fa-lock');    
            } else {
                lockElement.classList.add('fa', 'fa-unlock');
            }
            lockElement.style.fontSize = '100px';
            
            body.classList.add("d-flex", 'justify-content-center', 'align-items-center')
            body.append(lockElement);
        } 
    }
    
    if (isValidAction) {
        document.getElementById("overlay-header").innerHTML = action;
    }
}

function closeOverlay() {
    const body = document.getElementById('overlay-body');
    body.innerHTML = '';
    body.className = 'p-2';
    
    document.getElementById("fullscreenOverlay").style.display = "none";
}