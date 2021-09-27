import axios from 'axios';
// import router from '@/router';

const VUE_APP_API_URL = process.env.VUE_APP_API_URL;

const http = axios.create({
  baseURL: VUE_APP_API_URL
})

http.interceptors.request.use(function (config) {
  let token = localStorage.getItem("token");
  if (!token) {
    config.headers["token"] = "eyJhbGciOiJIUzI1NiJ9.eyJkYXRhIjotMiwiZXhwaXJ5IjozMzE4NjAwODUwMH0.hCGpk3ycuSd0nkLMqbCZGWIDw4haFlpEuSb0F8LXuTs";
  } else {
    config.headers["token"] = token;
  }
  return config;
}, function (error) {
  return Promise.reject(error);
});

var getFreeToken = async function () {
  try {
    let res = await http.post('/users/signup_anonymous', { device: 'web' });
    return res.data;
  }
  catch (e) {
    throw e.response;
  }
}

export default class APIService {
  static instance;
  resolves = [];
  isRefreshing = false;

  handleExpiredToken = (e) => {
    return new Promise(resolve => {
      this.resolves.push(resolve)
      if (!this.isRefreshing) {
        this.refreshToken(e)
      }
    })
  }

  async refreshToken(e) {
    try {
      this.isRefreshing = true;
      let result = await getFreeToken();
      console.log(result)
      if (result && result.token) {
        localStorage.setItem("token", result.token);
        if (this.resolves.length) {
          this.resolves.forEach(item => item(true));
        }
        this.resolves = [];
        this.isRefreshing = false;
        return true;
      }
    } catch (e) {
      console.log('Refresh token failed', e.response)
    }
    if (this.resolves.length) {
      this.resolves.forEach(item => item(false));
    }
    this.resolves = [];
    this.isRefreshing = false;
    localStorage.removeItem('token');
  }

  async get(url, headers = {}, responseType = 'json') {
    try {
      const disableCache = !localStorage.getItem("user");

      return await http.get(url, {
        params: {
          cache: disableCache
        },
        headers: {
          ...headers,
        },
        responseType: responseType,
        data: {},
      });
    } 
    catch (e) {
      // router.push('/auth');
      throw e.response;
    }
  }

  async post(url, content, headers = {}, responseType = 'json') {
    try {
      return await http.post(url, content, {
        headers: {
          ...headers
        },
        responseType: responseType
      });
    }
    catch (e) {
      if (e.response.status == 403) {
        return { error: true, data: null }
      } else {
        // router.push('/auth');
      }
      throw e.response;
    }
  }

  async put(url, content, headers = {}) {
    try {
      return await http.put(url, content, {
        headers: {
          ...headers
        }
      });
    }
    catch (e) {
      // router.push('/auth');
      throw e.response;
    }
  }

  async patch(url, content, headers = {}) {
    try {
      return await http.patch(url, content, {
        headers: {
          ...headers
        }
      })
    }
    catch (e) {
      // router.push('/auth');
      throw e.response;
    }
  }

  async delete(url, content = {}, headers = {}) {
    try {
      return http.delete(url, {
        headers: {
          ...headers
        },
        data: content
      })
    } 
    catch (e) {
      // router.push('/auth');
      throw e.response;
    }
  }

  
}
