let requestInFlight = null;
let abortController = null; 

function main() {
    const form = document.querySelector('form'); 
    const input = document.getElementsByName('echo_input')[0];

    form.addEventListener('submit', (event) => {
        event.preventDefault(); 
    });

    input.addEventListener('change', (event) => {
        const inputValue = event.target.value;
        const url = 'https://echo-bot-shy-sea-4425.fly.dev/echo';

        if (abortController) {
            abortController.abort();
            console.warn('Previous request aborted.');
        }

        abortController = new AbortController();
        const signal = abortController.signal;


        setTimeout(async () => {
            try {
                requestInFlight = fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ text: inputValue }),
                    signal: signal, 
                });

                const response = await requestInFlight;

                const data = await response.json();
                const outputDiv = document.getElementById("output");
                outputDiv.innerHTML = data.text;

                console.log('API Response:', data);

            } catch (error) {
                if (error.name === 'AbortError') {
                    console.warn('Request was aborted.');
                } else {
                    console.error('Error:', error);
                }
            } finally {
                requestInFlight = null;
            }
        }, 4000); 
    });
}

document.addEventListener('DOMContentLoaded', main);