const apiKey = "1baf113ea41968f6699c30be57d29628";

// Oy nomlari
const oylar = [
    "yanvar","fevral","mart","aprel","may","iyun",
    "iyul","avgust","sentabr","oktabr","noyabr","dekabr"
];

// Sana formatlash
function formatDate(dt) {
    const date = new Date(dt);

    const kun = date.getDate().toString().padStart(2, "0");
    const oy = oylar[date.getMonth()];
    const soat = date.getHours().toString().padStart(2, "0");
    const minut = date.getMinutes().toString().padStart(2, "0");

    return `${kun}-${oy} ${soat}:${minut}`;
}

// ENTER
function handleKey(e) {
    if (e.key === "Enter") getWeather();
}

// MAIN
async function getWeather() {
    const city = document.getElementById("city").value.trim();

    if (!city) {
        document.getElementById("result").innerHTML = "⚠️ Shahar kiriting";
        return;
    }

    const currentURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=uz`;
    const forecastURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric&lang=uz`;

    try {
        // CURRENT
        const res1 = await fetch(currentURL);
        const data = await res1.json();

        if (data.cod != 200) {
            document.getElementById("result").innerHTML = "❌ Shahar topilmadi";
            return;
        }

        let html = `
            <h3>${data.name}</h3>
            <p>🌡 ${data.main.temp}°C (his qilinadi ${data.main.feels_like}°C)</p>
            <p>☁️ ${data.weather[0].description}</p>
            <p>💨 Shamol: ${(data.wind.speed * 3.6).toFixed(1)} km/h</p>
            <p>💧 Namlik: ${data.main.humidity}%</p>
            <hr>
        `;

        // FORECAST
        const res2 = await fetch(forecastURL);
        const forecast = await res2.json();

        // SOATLIK
        html += "<h4>🕒 Soatlik</h4>";
        forecast.list.slice(0, 5).forEach(item => {
            html += `
                <p>
                🕒 ${formatDate(item.dt_txt)} <br>
                🌡 ${item.main.temp}°C | ☁️ ${item.weather[0].description}
                </p>
            `;
        });

        // KUNLIK
        html += "<h4>📅 Kunlik</h4>";
        forecast.list.filter((item, i) => i % 8 === 0).forEach(item => {
            html += `
                <p>
                📅 ${formatDate(item.dt_txt).split(" ")[0]} <br>
                🌡 ${item.main.temp}°C | ☁️ ${item.weather[0].description}
                </p>
            `;
        });

        document.getElementById("result").innerHTML = html;

    } catch (err) {
        document.getElementById("result").innerHTML = "⚠️ Internet yoki API xato";
        console.error(err);
    }
}