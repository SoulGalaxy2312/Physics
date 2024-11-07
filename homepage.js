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
    } else if (action === 'History') {
        // Create the table element
        const table = document.createElement('table');
        table.classList.add('table', 'table-bordered');

        // Create the table header
        const thead = document.createElement('thead');
        thead.classList.add('thead-light');
        const headerRow = document.createElement('tr');

        // Add headers for Date, Time, and Result
        const dateHeader = document.createElement('th');
        dateHeader.classList.add('text-center');
        dateHeader.textContent = 'Date';
        headerRow.appendChild(dateHeader);

        const timeHeader = document.createElement('th');
        timeHeader.classList.add('text-center');
        timeHeader.textContent = 'Time';
        headerRow.appendChild(timeHeader);

        const resultHeader = document.createElement('th');
        resultHeader.classList.add('text-center');
        resultHeader.textContent = 'Result';
        headerRow.appendChild(resultHeader);

        thead.appendChild(headerRow);
        table.appendChild(thead);

        // Create the table body
        const tbody = document.createElement('tbody');

        // Data array: Each object contains Date, Time, and Result
        const data = [
            { Date: '01/01/2024', Time: '10:00 AM', Result: 'Pass' },
            { Date: '02/01/2024', Time: '12:00 PM', Result: 'Fail' },
            { Date: '03/01/2024', Time: '02:00 PM', Result: 'Fail' }
        ];

        // Loop through the data and create a row for each entry
        data.forEach(item => {
            const row = document.createElement('tr');

            // Create and add each data cell for Date, Time, and Result
            const dateCell = document.createElement('td');
            dateCell.classList.add('col-3');  // Set the Date column width to col-3
            dateCell.textContent = item.Date;  // '01/01/2024'
            row.appendChild(dateCell);

            const timeCell = document.createElement('td');
            timeCell.classList.add('col-3');  // Set the Date column width to col-3
            timeCell.textContent = item.Time;  // '10:00 AM'
            row.appendChild(timeCell);

            const resultCell = document.createElement('td');
            resultCell.classList.add('col-3');  // Set the Date column width to col-3
            resultCell.textContent = item.Result;  // 'Pass'
            row.appendChild(resultCell);

            tbody.appendChild(row);
        });

        table.appendChild(tbody);

        // Append the table to the overlay-body div
        const overlayBody = document.getElementById('overlay-body');
        overlayBody.appendChild(table);
    } else if (action === 'Settings') {
        
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