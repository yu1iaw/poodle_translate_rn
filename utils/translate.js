import axios from 'axios';

export async function translate(text, from, to) {
    const options = {
        method: "GET",
        url: "https://nlp-translation.p.rapidapi.com/v1/translate",
        params: { text: text, to: to, from: from },
        headers: {
            "X-RapidAPI-Key": "...",
            "X-RapidAPI-Host": "nlp-translation.p.rapidapi.com",
        },
    };

    const response = await axios.request(options)
        .catch((error) => console.error(error));

    if (response.status !== 200) {
        throw new Error('Translate call failed. Response status: ' + response.status);
    }

    return response.data;
}