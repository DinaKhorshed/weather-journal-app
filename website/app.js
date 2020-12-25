/* Global Variables */

//API Key
const apiKey = 'a7a119a6a12a8858333ebc05a918646c';

// Measuring unit for temperature
const desiredUnit = 'metric';

// API Link without Zip Code value
let apiLink = `http://api.openweathermap.org/data/2.5/weather?units=${desiredUnit}&appid=${apiKey}&zip=`;

// Get UI elements
const submitButton = document.getElementById('generate');
const zipCodeInput = document.getElementById('zip');
const feelingsTextArea = document.getElementById('feelings');
const dateSection = document.getElementById('date');
const tempSection = document.getElementById('temp');
const contentSection = document.getElementById('content');

// Create a new date instance dynamically with JS
let d = new Date();
let newDate = d.getMonth() + '.' + d.getDate() + '.' + d.getFullYear();

// Validate Inputs
validateFields = (zipCodeLength, feelingsLength) => {
    const errorMessage = document.getElementById('errorMessage');

    if (zipCodeLength >= 5 && feelingsLength > 0) {
        if (errorMessage) errorMessage.remove();
        if (zipCodeInput.classList && zipCodeInput.classList.contains('error')) zipCodeInput.classList.remove("error");
        if (feelings.classList && feelings.classList.contains('error')) feelings.classList.remove("error");
    }
    if (zipCodeLength < 5 && feelingsLength === 0) {
        if (errorMessage) errorMessage.remove();
        zipCodeInput.parentNode.insertAdjacentHTML('beforebegin', `<div id="errorMessage" class="error-message"><p>Zip Code Must be at least 5 numbers</p><p>Feelings must not be empty</p></div>`);
        if (zipCodeInput.classList && !zipCodeInput.classList.contains('error')) zipCodeInput.classList.add("error");
        if (feelings.classList && !feelings.classList.contains('error')) feelings.classList.add("error");
    }
    if (zipCodeLength < 5 && feelingsLength > 0) {
        if (errorMessage) errorMessage.remove();
        zipCodeInput.parentNode.insertAdjacentHTML('beforebegin', `<div id="errorMessage" class="error-message"><p>Zip Code Must be at least 5 numbers</p></div>`);
        if (zipCodeInput.classList && !zipCodeInput.classList.contains('error')) zipCodeInput.classList.add("error");
        if (feelings.classList && feelings.classList.contains('error')) feelings.classList.remove("error");
    }
    if (zipCodeLength >= 5 && feelingsLength === 0) {
        if (errorMessage) errorMessage.remove();
        zipCodeInput.parentNode.insertAdjacentHTML('beforebegin', `<div id="errorMessage" class="error-message"><p>Feelings must not be empty</p></div>`);
        if (zipCodeInput.classList && zipCodeInput.classList.contains('error')) zipCodeInput.classList.remove("error");
        if (feelings.classList && !feelings.classList.contains('error')) feelings.classList.add("error");
    }
}

/* Get Temperature, add new entry and render the results in the UI on `Generate button click` */
showLatestInput = (e) => {

    // get user input values
    const zipCode = zipCodeInput.value;
    const zipCodeLength = zipCode.trim().length;
    const feelings = feelingsTextArea.value;
    const feelingsLength = feelings.trim().length;
    let fullLink = `${apiLink}${zipCode}`;

    if (zipCodeLength >= 5 && feelingsLength > 0) {
        getWeatherAPIResponse(fullLink)
            .then((serverResponse) => {
                let newEntry = { date: newDate, temp: serverResponse.main.temp, content: feelings };

                postData('/add', newEntry)
            }).then(function (newData) {
                renderNewUI();
            });
    } else {
        e.preventDefault();
    }
    validateFields(zipCodeLength, feelingsLength);
}

/* Call OpenWeather API and get the response*/
const getWeatherAPIResponse = async (url) => {
    // serverResponse equals to the result of fetch function
    const serverResponse = await fetch(url);
    try {
        // apiResponse equals to the result of fetch function
        const apiResponse = await serverResponse.json();
    if(apiResponse.cod != 200) {
        apiResponse.main = {};
        apiResponse.main.temp = `${apiResponse.message}, Please Make sure you have entered a correct ZIP Code`;
    }
        return apiResponse;
    } catch (error) {
        console.log("error", error);
    }
}

/* Post New Entry data*/
const postData = async (url = '', data = {}) => {
    const serverResponse = await fetch(url, {
        method: "POST",
        credentials: "same-origin",
        headers: {
            "Content-Type": "application/json;charset=UTF-8"
        },
        body: JSON.stringify({
            date: data.date,
            temp: data.temp,
            content: data.content
        })
    })

    try {
        const newData = await serverResponse.json();
        return newData;
    }
    catch (error) {
        console.log(error);
    }
};

// Get All Weather Details and render the last entered element
const renderNewUI = async () => {
    const serverResponse = await fetch('/all');
    try {
        const allData = await serverResponse.json()
        const allDataLength = allData.length - 1;
        // update new entry values
        dateSection.innerHTML = allData[allDataLength].date;
        tempSection.innerHTML = allData[allDataLength].temp;
        contentSection.innerHTML = allData[allDataLength].content;
    }
    catch (error) {
        console.log("error", error);
    }
};
// Call showLatestInput on Button click
submitButton.addEventListener('click', showLatestInput);
