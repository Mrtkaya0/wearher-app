const form = document.querySelector('.top-banner form');
const input = document.querySelector('.top-banner input');
const msg = document.querySelector('.top-banner .msg');
const list = document.querySelector('.ajax-section .cities');
const apiKey = '373151c7ad4191ccebf3b03118874ce0';

form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Girilen text yazısını alma 
    let inputVal = input.value;

    // Eğer şehir listesinde bir şehir varsa kontrol et
    const listItems = list.querySelectorAll('.ajax-section .city');
    const listItemsArray = Array.from(listItems);

    if (listItemsArray.length > 0) {
        const filteredArray = listItemsArray.filter((el) => {
            let content = el.querySelector('.city-name span').textContent.toLocaleLowerCase();
            return content == inputVal.toLocaleLowerCase();
        });
        if (filteredArray.length > 0) {
            // Eğer bir şehir zaten listeye eklenmişse kullanıcıyı uyar
            msg.textContent = `Zaten ${filteredArray[0].querySelector('.city-name span').textContent} şehrin hava durumunu biliyorsun.`;
            form.reset();
            input.focus();
            return;
        }
    }

    // OpenWeatherMap API'den hava durumu verisini al
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${inputVal}&appid=${apiKey}&units=metric`;

    fetch(url)
        .then((response) => response.json())
        .then((data) => {
            if (data.cod === '404') {
                msg.textContent = 'Lütfen geçerli bir şehir ara';
                form.reset();
                input.focus();
                return;
            }

            const { main, name, sys, weather } = data;
            const icon = `https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/${weather[0]['icon']}.svg`;

            // Yeni bir liste öğesi oluştur ve hava durumu bilgilerini ekrana yerleştir
            const li = document.createElement('li');
            li.classList.add('city');
            const markup = `
                <h2 class='city-name' data-name='${name}, ${sys.country}'>
                    <span>${name}</span>
                    <sup>${sys.country}</sup>
                </h2>
                <div class='city-temp'>${Math.round(main.temp)} <sup>°C</sup></div>
                <figure>
                    <img class='city-icon' src='${icon}' alt='${weather[0]['description']}'/>
                    <figcaption>${weather[0]['description']}</figcaption>
                </figure>
            `;
            li.innerHTML = markup;
            list.appendChild(li);
        })
        .catch(() => {
            msg.textContent = 'Lütfen geçerli bir şehir ara';
        });

    msg.textContent = '';
    form.reset();
    input.focus();
});