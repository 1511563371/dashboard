<!--
 * Copyright 2022 The kubegems.io Authors
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *       http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License. 
-->

<template>
  <v-form ref="form" v-model="valid" lazy-validation @submit.prevent>
    <v-expand-transition>
      <v-card v-show="expand" class="my-2 pa-2 kubegems__expand-transition" :elevation="4" flat>
        <v-card-text class="pa-0">
          <v-sheet class="mt-2 px-2">
            <v-flex class="float-left text-subtitle-2 py-1 primary--text kubegems__min-width">
              <span class="ml-2">{{ $t('form.crt') }}</span>
            </v-flex>
            <v-flex class="ml-2">
              <ACEEditor
                v-model="tls['tls.crt']"
                :class="`clear-zoom-${Scale.toString().replaceAll('.', '-')} rounded`"
                height="200"
                lang="yaml"
                :options="Object.assign($aceOptions, { readOnly: false, wrap: true })"
                theme="chrome"
                @keydown.stop
              />
            </v-flex>
            <div class="kubegems__clear-float" />
          </v-sheet>
          <v-sheet class="mt-2 px-2">
            <v-flex class="float-left text-subtitle-2 py-1 primary--text kubegems__min-width">
              <span class="ml-2">{{ $t('form.key') }}</span>
            </v-flex>
            <v-flex class="ml-2">
              <ACEEditor
                v-model="tls['tls.key']"
                :class="`clear-zoom-${Scale.toString().replaceAll('.', '-')} rounded mb-4`"
                height="200"
                lang="yaml"
                :options="Object.assign($aceOptions, { readOnly: false, wrap: true })"
                theme="chrome"
                @keydown.stop
              />
            </v-flex>
            <div class="kubegems__clear-float" />
          </v-sheet>
        </v-card-text>
        <v-card-actions class="pa-0">
          <v-spacer />
          <v-btn color="error" small text @click="closeCard"> {{ $root.$t('operate.cancel') }} </v-btn>
          <v-btn color="primary" small text @click="addData"> {{ $root.$t('operate.save') }} </v-btn>
        </v-card-actions>
      </v-card>
    </v-expand-transition>
  </v-form>
</template>

<script>
  import { Base64 } from 'js-base64';
  import { mapState } from 'vuex';

  import messages from '../../i18n';
  import { deepCopy } from '@/utils/helpers';

  export default {
    name: 'SecretTlsForm',
    i18n: {
      messages: messages,
    },
    props: {
      data: {
        type: Object,
        default: () => null,
      },
    },
    data() {
      return {
        valid: false,
        expand: false,
        dataCopy: {},
        tls: {
          'tls.crt': '',
          'tls.key': '',
        },
      };
    },
    computed: {
      ...mapState(['Scale']),
    },
    watch: {
      data() {
        this.dataCopy = deepCopy(this.data);
      },
    },
    mounted() {
      if (this.labels) {
        this.dataCopy = deepCopy(this.data);
      }
    },
    methods: {
      init(data) {
        this.tls = {
          'tls.crt': data['tls.crt'],
          'tls.key': data['tls.key'],
        };
        this.expand = true;
      },
      addData() {
        if (this.$refs.form.validate(true)) {
          for (const key in this.tls) {
            this.dataCopy[key] = Base64.encode(this.tls[key]);
          }
          this.$emit('addData', this.dataCopy);
          this.closeCard();
        }
      },
      closeCard() {
        this.expand = false;
        this.$refs.form.reset();
        this.tls = {
          'tls.crt': '',
          'tls.key': '',
        };
        this.$emit('closeOverlay');
      },
    },
  };
</script>
