function openOverlay(action) {
    const body = document.getElementById('overlay-body')
    document.getElementById("fullscreenOverlay").style.display = "flex";
    let isValidAction = true;
    
    if (action === 'Lock State') {
        socket.on('lockStateUpdate', (isLocked)=>{
            if (isLocked === true) {
                if (body.classList.contains('bg-success')) {
                    body.classList.remove('bg-success');
                }
                body.classList.add('bg-danger')
            } else {
                if (body.classList.contains('bg-danger')) {
                    body.classList.remove('bg-danger');
                }
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
            } else {
                if (lockElement.classList.contains('fa-lock') && !isLocked) {
                    lockElement.classList.remove('fa-lock');
                    lockElement.classList.add('fa-unlock');
                } else if (lockElement.classList.contains('fa-unlock') && isLocked) {
                    lockElement.classList.remove('fa-unlock');
                    lockElement.classList.add('fa-lock');
                }
            }

        })
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

      socket.on('distanceUpdate', (currentDistance)=>{
        if (distanceSlider.noUiSlider) {
            distanceSlider.noUiSlider.set(currentDistance); // Update the slider value
            console.log(`Slider updated to: ${currentDistance}`);
        } else {
            console.error('noUiSlider is not initialized on the slider element!');
        }
      })
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
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json(); // Parse JSON body
            })
            .then((data) => {
                if (data.success) {
                    console.log('Distance updated successfully!');
                    alert('Successfully updated!');
                } else {
                    console.error('Server error:', data.message);
                    alert(`Update failed: ${data.message}`);
                }
            })
            .catch((error) => {
                console.error('Error:', error);
                alert('An error occurred while updating distance.');
            });
    } else {
        console.error('Slider or noUiSlider instance not found!');
    }
}

function setOledToggleState(state) {
    // Get the toggle switch element by its ID
    const toggleSwitch = document.getElementById('oledToggle');
  
    // Set the state (true for ON, false for OFF)
    toggleSwitch.checked = state;
  
    // Optional: Log the new state or trigger any additional behavior
    console.log('OLED SSD Toggle is now:', state ? 'ON' : 'OFF');
}

function setTouchScreenToggleState(state) {
    // Get the toggle switch element by its ID
    const toggleSwitch = document.getElementById('touchScreenToggle');
  
    // Set the state (true for ON, false for OFF)
    toggleSwitch.checked = state;
  
    // Optional: Log the new state or trigger any additional behavior
    console.log('Touch Screen Toggle is now:', state ? 'ON' : 'OFF');
}

document.getElementById('touchScreenToggle').addEventListener('change', function () {
    if (this.checked) {
        fetch('/api/TouchScreenState', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ isTurnOn: this.checked }),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data) => {
                if (data.success) {
                    alert('Successfully updated!');
                } else {
                    console.error('Server error:', data.message);
                    alert(`Update failed: ${data.message}`);
                }
            })
            .catch((error) => {
                console.error('Error:', error);
                alert('An error occurred while updating oled state.');
            });
    }
});

document.getElementById('oledToggle').addEventListener('change', function () {
    if (this.checked) {
        fetch('/api/OledState', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ isTurnOn: this.checked }),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data) => {
                if (data.success) {
                    alert('Successfully updated!');
                } else {
                    console.error('Server error:', data.message);
                    alert(`Update failed: ${data.message}`);
                }
            })
            .catch((error) => {
                console.error('Error:', error);
                alert('An error occurred while updating oled state.');
            });
    }
});


function decreaseTemp() {
    const tempInput = document.getElementById('tempRange');
    const currentValue = parseInt(tempInput.value, 10);
    if (currentValue > parseInt(tempInput.min, 10)) {
        tempInput.value = currentValue - parseInt(tempInput.step, 10);
    }
}

  // Increase temperature range
function increaseTemp() {
    const tempInput = document.getElementById('tempRange');
    const currentValue = parseInt(tempInput.value, 10);
    if (currentValue < parseInt(tempInput.max, 10)) {
        tempInput.value = currentValue + parseInt(tempInput.step, 10);
    }
}

function updateEmergencyTemperature() {
    const tempInput = document.getElementById('tempRange').value;

    fetch('/api/EmergencyTemperature', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tempInput: tempInput }),
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json(); // Parse JSON body
        })
        .then((data) => {
            if (data.success) {
                console.log('Temperature updated successfully!');
                alert('Successfully updated!');
            } else {
                console.error('Server error:', data.message);
                alert(`Update failed: ${data.message}`);
            }
        })
        .catch((error) => {
            console.error('Error:', error);
            alert('An error occurred while updating temperature.');
        });
}

