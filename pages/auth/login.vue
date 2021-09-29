<template>
  <v-container id="login" class="justify-center pt-0" tag="section">
    <v-row justify="center">
      <v-col lg="6" md="6" xl="5" cols="12">
        <v-card class="elevation-4">
          <v-row>
            <v-col cols="12">
              <div class="px-7 px-sm-12">
                <v-tabs
                  :value="tab"
                  background-color="transparent"
                  grow
                >
                  <v-tab to="/auth/signup" class="title">
                    {{ $t('new user') }}
                  </v-tab>
                  <v-tab to="/auth/login" class="title">
                    {{ $t('User exist') }}
                  </v-tab>
                </v-tabs>
              </div>
            </v-col>
            <v-col cols="12">
              <div class="pa-7 pa-sm-12">
                <v-alert 
                  type="error" 
                  v-if="loginFailed"
                >
                  {{ $t('The password is incorrect or the user does not exist') }}
                </v-alert>
                <v-form ref="form" v-model="valid" lazy-validation>
                  <v-text-field
                    v-model="email"
                    :rules="emailRules"
                    :label="$t('Email')"
                    prepend-inner-icon="mdi-email"
                    required
                  ></v-text-field>
                  <v-text-field
                    v-model="password"
                    :rules="passwordRules"
                    :label="$t('Password')"
                    required
                    prepend-inner-icon="mdi-lock"
                    :type="show1 ? 'text' : 'password'"
                  ></v-text-field>
                  <v-btn
                    :disabled="!valid"
                    color="info"
                    block
                    class="mt-10 pa-6 title white--text"
                    submit
                    @click="submit"
                  >{{ $t('Log in') }}</v-btn>

                  <div class="d-block d-sm-flex align-center mb-4 mb-sm-0">
                    <div class="mx-auto mt-10">
                      {{ $t('unable to connect?') }} <a @click="resetPass" class="link blue--text">{{ $t('Reset password') }}</a>
                    </div>
                  </div>
                </v-form>

                <div class="text-center mt-6 py-4 social-login">
                  <img src="~/static/google.png" class="google-login-button mx-6" aria-controls width="56px" height="56px" @click="googleWithLogin"/>
                  <v-facebook-login
                    :app-id="facebookAppId"
                    @login="facebookWithLogin"
                    version="v9.0"
                    logo-class="mr-0 white--text"
                    :use-alt-logo="false">
                    <div slot="login">
                    </div>
                    <div slot="logout">
                    </div>
                    <div slot="working">
                    </div>
                  </v-facebook-login>
                </div>
              </div>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions } from "vuex";
import VFacebookLogin from 'vue-facebook-login-component'
export default {
  name: "Login",
  layout: "AuthLayout",
  components: {
    VFacebookLogin
  },
  data() {
    return {
      valid: true,
      password: "",
      show1: false,
      passwordRules: [
        v => !!v || this.$t("Password is required"),
      ],
      email: "",
      emailRules: [
        v => !!v || this.$t("Email is required"),
        v => /.+@.+\..+/.test(v) || this.$t("Email must be valid")
      ],
      checkbox: false,
      tab: 1,
      facebookAppId: process.env.VUE_APP_FACEBOOK_APP_ID,
      loginFailed: false,
    }
  },
  methods: {
    ...mapActions("auth", ["signUser", "googleLogin", "facebookLogin", "getResetPasswordLink"]),
    resetPass() {
      this.$router.push('/auth/forgotpassword');
    },
    async submit() {
      this.$refs.form.validate();
      if (this.$refs.form.validate(true)) {
        let payload = {
          email: this.email,
          password: this.password,
          device: 'web'
        }

        let res = await this.signUser(payload);
        if (!res) {
          this.loginFailed = true;
          return;
        }
        this.loginFailed = false;
        if (res.token) {
          localStorage.setItem('token', res.token);
          let userInfo = {
            name: res.user.name,
            gender: res.user.gender,
            is_admin: res.user.is_admin
          }
          localStorage.setItem('user', JSON.stringify(userInfo));
          this.$router.push({ path: "/" });
        } else {
          // handle error
          console.log(res);
        }
      }
    },
    async googleWithLogin() {
      const googleUser = await this.$gAuth.signIn();
      if (this.$gAuth.isAuthorized) {
        let payload = {
          access_token: googleUser.Zb.access_token,
          device: 'web'
        }
        let res = await this.googleLogin(payload);
        if (!res) {
          this.loginFailed = true;
          return;
        }
        this.loginFailed = false;
        if (res.token) {
          localStorage.setItem('token', res.token);
          let userInfo = {
            name: res.user.name,
            gender: res.user.gender,
            is_admin: res.user.is_admin
          }
          localStorage.setItem('user', JSON.stringify(userInfo));
          this.$router.push("/");
        } else {
          // handle error
          console.log(res);
        }
      }
    },
    async facebookWithLogin(response) {
      if (response["status"] == 'connected') {
        let payload = {
          access_token: response["authResponse"]["accessToken"],
          device: 'web'
        }
        let res = await this.facebookLogin(payload);
        if (!res) {
          this.loginFailed = true;
          return;
        }
        this.loginFailed = false;
        if (res.token) {
          localStorage.setItem('token', res.token);
          let userInfo = {
            name: res.user.name,
            gender: res.user.gender,
            is_admin: res.user.is_admin
          }
          localStorage.setItem('user', JSON.stringify(userInfo));
          this.$router.push("/");
        } else {
          // handle error
          console.log(res);
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.social-login .v-facebook-login {
  border-radius: 50%;
  width: 56px;
  height: 56px;
  display: inline-flex;
  box-shadow: none;
  margin-left: 24px;
  margin-right: 24px;
  vertical-align: middle;
  background-color: transparent;
  position: relative;

  &:hover {
    background-color: transparent;
  }

  &::before {
    position: absolute;
    content: " ";
    background-image: url('../../static/facebook.png');
    width: 56px;
    height: 56px;
    background-size: contain;
    left: 0;
  }

  ::v-deep span {
    display: none;
  }

  ::v-deep svg {
    display: none;
  }
}

.google-login-button {
  border-radius: 50%;
  display: inline-flex;
  vertical-align: middle;
}
</style>
