<template>
  <v-container id="login" class="justify-center pt-0" tag="section">
    <v-row justify="center">
      <v-col lg="6" md="6" xl="5" cols="12">
        <v-card class="elevation-4">
          <v-row>
            <v-col cols="12">
              <div class="pa-7 pa-sm-12">
                <v-alert 
                  :type="hasError ? 'error' : 'info'" 
                  v-if="submitted"
                >
                  {{ hasError ? $t('The password is not valid') : $t('The password is changed') }}
                </v-alert>
                <v-form ref="form" v-model="valid" lazy-validation>
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
                  >{{ $t('Reset') }}</v-btn>
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
  name: "NewPassword",
  layout: "AuthLayout",
  data() {
    return {
      valid: true,
      password: "",
      show1: false,
      passwordRules: [
        v => !!v || this.$t("Password is required"),
      ],
      tab: 1,
      submitted: false,
      hasError: false
    }
  },
  methods: {
    ...mapActions("auth", ["setNewPassword"]),
    async submit() {
      var email = this.$route.query && this.$route.query.email;
      var token = this.$route.query && this.$route.query.t;
      this.$refs.form.validate();
      if (this.$refs.form.validate(true)) {
        let payload = {
          password: this.password,
          t: token
        }

        let res = await this.setNewPassword(payload);
        console.log(res);
        if (res.status == "ok") {
          this.submitted = true;
          this.hasError = false;
          setTimeout(() => {
            this.$router.push('/auth');
          }, 1000);
        } else {
          this.hasError = true;
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped>

</style>
