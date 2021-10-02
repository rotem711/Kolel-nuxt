export default function ({ $axios, $cookies, redirect }) {
    $axios.onRequest(config => {
        console.log('Making request to ' + config.url)
        var token = $cookies.get('token');
        if (token) {
            config.headers.Authorization = $cookies.get('token')
        } else {
            config.headers.Authorization = "eyJhbGciOiJIUzI1NiJ9.eyJkYXRhIjotMiwiZXhwaXJ5IjozMzE4NjAwODUwMH0.hCGpk3ycuSd0nkLMqbCZGWIDw4haFlpEuSb0F8LXuTs";
        }
    })

    $axios.onError(error => {
        const code = parseInt(error.response && error.response.status)
        if (code === 400) {
            redirect('/400')
        }
    })
}