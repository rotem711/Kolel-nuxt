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
                  :type="hasError ? 'error' : 'info'" 
                  v-if="submitted || hasError"
                >
                  {{ hasError ? $t('The email is not valid') : $t('Please check your email box') }}
                </v-alert>
                <v-form ref="form" v-model="valid" lazy-validation>
                  <v-text-field
                    v-model="email"
                    :rules="emailRules"
                    :label="$t('Email')"
                    prepend-inner-icon="mdi-email"
                    required
                  ></v-text-field>
                  <v-btn
                    :disabled="!valid || submitted"
                    color="info"
                    block
                    class="mt-10 pa-6 title white--text"
                    submit
                    @click="submit"
                  >{{ $t('Send') }}</v-btn>
                </v-form>
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
export default {
  name: "ForgotPassword",

  layout: "AuthLayout",

  data() {
    return {
      valid: true,
      show1: false,
      email: "",
      emailRules: [
        v => !!v || this.$t("Email is required"),
        v => /.+@.+\..+/.test(v) || this.$t("Email must be valid")
      ],
      checkbox: false,
      tab: 1,
      submitted: false,
      hasError: false
    }
  },
  methods: {
    ...mapActions("auth", ["getResetPasswordLink"]),
    async submit() {
      this.$refs.form.validate();
      if (this.$refs.form.validate(true)) {
        let payload = {
          email: this.email,
          device: 'web'
        }
        let res = await this.getResetPasswordLink(payload);
        if (res.status == "ok") {
          this.submitted = true;
          this.hasError = false;
        } else {
          this.hasError = true;
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
