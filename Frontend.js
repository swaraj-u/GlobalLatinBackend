//This is simple javascript code for html input tag that why we have getElementById() method
//In case of React project we will modify and put this logic in onChange function


const inputElement = document.getElementById('fileInput');

inputElement.addEventListener('change', function(event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onloadend = function() {
        const base64String = reader.result.split(',')[1];

        fetch('https://your-lambda-url.amazonaws.com', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                metadata: { email: 'email'},
                file: base64String
            })
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    };

    reader.readAsDataURL(file); 
});
