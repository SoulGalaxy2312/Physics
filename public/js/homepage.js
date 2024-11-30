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

document.addEventListener('DOMContentLoaded', () => {
    const distanceSlider = document.getElementById('slider-distance');
  
    if (distanceSlider) {
      noUiSlider.create(distanceSlider, {
        start: 30, // Initial value
        range: {
          min: 0,
          max: 100,
        },
        step: 1,
        tooltips: true,
      });
    } else {
      console.error('Slider container not found!');
    }
});
  
function updateDistance() {
    const distanceSlider = document.getElementById('slider-distance');
    if (distanceSlider && distanceSlider.noUiSlider) {
        const updatedDistance = distanceSlider.noUiSlider.get(); // Get slider value

        fetch('/api/distance', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ distance: parseInt(updatedDistance) }),
        })
            .then((response) => {
                if (response.ok) {
                    console.log('Distance updated successfully!');
                } else {
                    console.error('Failed to update distance');
                }
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    } else {
        console.error('Slider or noUiSlider instance not found!');
    }
}