'use strict';
import './src/style.css';

class ITerminal {
    constructor() {
        this.keyUs = "no user key";
        this.trueK = false;
        this.kAPI = "No API key";
        this.scrDlg = "\nТерминал диалога с нейросетью ChatGPT v.3.5.2\n-----------------------------------\nАвтор: Владимир Лунегов\nЛицензия  MIT license\n2023\n\-----------------------------------\n\nЕсли нет ключа, получите его на сайте Openai.\n\nНаписав вопрос, нажмите кнопку Отправить\n\nДля ввода ключа нажмите кнопку справа от выбора языка.\n\nЗадайте вопрос интеллектуальному чату\n\nChatGPT>>\n |\nV\nV";
    }

    getInDialog() {
        return this.scrDlg;
    }
};

const terminal = new ITerminal();
const btn = document.querySelector('.btnSend');
const txtMsg = document.querySelector('.input-text');
const txtDialog = document.querySelector('.dialogue_user');
const answArea = document.querySelector('.setAPIkey');
const selModel = document.querySelector('.chatModel');
const selLang = document.querySelector('.selectLang');
let oJson;
let data;
let sModel;

txtDialog.innerHTML = terminal.scrDlg;

const showModalMessage = (message, t) => {
    const spMsg = document.querySelector('.message_to_user');
    spMsg.innerHTML = message;
    setTimeout(function () {
        spMsg.innerHTML = "";
    }, t)
}

const setAPIkey = () => {
    if (terminal.trueK === true) {
        return;
    }
    answArea.click();
    const keyUs = prompt('Введите значение API ключа');
    if (terminal.trueK === false) {
        const prefix = keyUs.slice(0, 3);

        if (prefix === 'sk-') {
            terminal.trueK = true;
            terminal.kAPI = keyUs;
            txtDialog.value = "\nChatGPT>> Здравствуйте! Как я могу Вам помочь?\n";
            return;
        }
        showModalMessage('Ключ недействителен', 3000);
        return;

    }

}




const sendRequest = () => {
    const sQuestion = txtMsg.value;

    if (!sQuestion) {
        showModalMessage('Вы не написали ничего', 2000);
        txtMsg.focus();
        return;
    }

    const sUrl = "https://api.openai.com/v1/completions";
    sModel = selModel.value;

    if (sModel.indexOf("gpt-3.5-turbo") != -1) {
        const sUrl = "https://api.openai.com/v1/chat/completions";
    };

    const oHttp = new XMLHttpRequest();
    oHttp.open("POST", "https://api.openai.com/v1/chat/completions");
    oHttp.setRequestHeader("Accept", "application/json");
    oHttp.setRequestHeader("Content-Type", "application/json");
    oHttp.setRequestHeader("Authorization", "Bearer " + terminal.kAPI)

    oHttp.onreadystatechange = function () {
        if (oHttp.readyState === 4) {

            if (txtOutput.value != "") txtOutput.value += "\n";

            try {
                oJson = JSON.parse(oHttp.responseText);

            } catch (ex) {
                txtOutput.value += "Ошибка: " + ex.message
            }

            if (oJson.error && oJson.error.message) {
                txtOutput.value += "Ошибка: " + oJson.error.message;

            } else if (oJson.choices) {
                var s = "";
                showModalMessage("ChatGPT думает...", 2200);
                if (oJson.choices[0].text) {
                    s = oJson.choices[0].text;
                    showModalMessage("");
                } else if (oJson.choices[0].message) {
                    s = oJson.choices[0].message.content;
                    showModalMessage("");
                }

                checkLanguage(s);

                if (s == "") {
                    showModalMessage("ChatGPT не ответил", 3000);

                } else {
                    txtOutput.value += "ChatGPT>> " + s + "\n";
                    showModalMessage("Ок, ChatGPT на связи!", 4000);

                }
            }
        }
    };


    const iMaxTokens = 2048;
    const sUserId = "1";
    const dTemperature = 0.7;

    data = {
        model: sModel,
        prompt: sQuestion,
        max_tokens: iMaxTokens,
        user: sUserId,
        temperature: dTemperature,
        frequency_penalty: 0.0,
        presence_penalty: 0.0,
        stop: ["#", ";"]
    }
    if (sModel.indexOf("gpt-3.5-turbo") != -1) {
        data = {
            "model": sModel,
            "messages": [{
                "role": "user",
                "content": sQuestion
            }]
        }

    }

    oHttp.send(JSON.stringify(data));

    if (txtDialog.value != "") txtDialog.value += "\n";
    txtDialog.value += "Мой вопрос: " + sQuestion + "\n";
    txtMsg.value = "";
};

const checkLanguage = (s) => {
    if (selLang.value != "en-US") {
        const a = s.split("?\n");

        if (a.length == 2) {
            s = a[1];
        }
    }
};


btn.addEventListener('click', (event) => {
    const target = event.target;
    if (target && target.classList.contains('btnSend')) {
        sendRequest();
    }
});

answArea.addEventListener('click', (event) => {
    const target = event.target;
    if (target && target.classList.contains('setAPIkey')) {
        setAPIkey();
    }
});