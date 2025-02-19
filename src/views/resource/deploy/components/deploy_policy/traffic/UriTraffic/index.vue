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
    <v-card-text class="px-0">
      <v-row class="px-2">
        <v-col cols="6">
          <v-autocomplete
            v-model="traffic"
            class="my-0"
            color="primary"
            hide-selected
            :items="trafficItems"
            :label="$t('tip.traffic_weight')"
            :no-data-text="$root.$t('data.no_data')"
            @change="onTrafficChange"
          >
            <template #selection="{ item }">
              <v-chip class="mx-1" color="primary" small>
                {{ item['text'] }}
              </v-chip>
            </template>
          </v-autocomplete>
        </v-col>
        <v-col v-if="traffic === 'true'" cols="6">
          <v-text-field
            v-model="obj.strategy.canary.steps[0].setWeight"
            class="my-0"
            :label="$t('tip.canary_weight')"
            required
            :rules="canaryRules.setWeightRule"
            suffix="%"
            type="number"
            @keyup="onWeightInput"
          />
        </v-col>
        <v-col cols="6">
          <v-switch
            v-model="obj.strategy.canary.trafficRouting.istio.virtualService.ignoreUriCase"
            class="mt-4"
            label="ignoreUriCase"
            @change="onIgnoreUriCaseChange"
          />
        </v-col>
      </v-row>
      <BaseSubTitle :title="`${$t('tip.regex')}(uri)`" />
      <UriMatchForm :data="obj.strategy.canary.trafficRouting.istio.virtualService.uri" @addData="addUriData" />
    </v-card-text>
  </v-form>
</template>

<script>
  import messages from '../../../../i18n';
  import UriMatchForm from './UriMatchForm';
  import { deepCopy } from '@/utils/helpers';
  import { positiveInteger, required } from '@/utils/rules';

  export default {
    name: 'UriTraffic',
    i18n: {
      messages: messages,
    },
    components: {
      UriMatchForm,
    },
    data() {
      return {
        valid: false,
        canaryRules: {
          setWeightRule: [positiveInteger],
          uriRule: [required],
        },
        traffic: 'false',
        obj: {
          strategy: {
            canary: {
              steps: [
                {
                  setWeight: 10,
                },
              ],
              trafficRouting: {
                istio: {
                  virtualService: {
                    uri: null,
                    ignoreUriCase: true,
                  },
                },
              },
            },
          },
        },
      };
    },
    computed: {
      trafficItems() {
        return [
          { text: this.$t('tip.default_traffic_weight'), value: 'false' },
          { text: this.$t('tip.custom_traffic_weight'), value: 'true' },
        ];
      },
    },
    mounted() {
      this.$nextTick(() => {
        this.onTrafficChange();
      });
    },
    methods: {
      init(data) {
        this.obj = deepCopy(data);
      },
      onWeightInput() {
        this.$emit('updateComponentData', this.obj);
      },
      onTrafficChange() {
        if (this.traffic === 'false') {
          this.obj.strategy.canary.steps[0].setWeight = 10;
          this.$emit('updateComponentData', this.obj);
        }
      },
      addUriData(data) {
        this.obj.strategy.canary.trafficRouting.istio.virtualService.uri = data;
        this.$emit('updateComponentData', this.obj);
      },
      onIgnoreUriCaseChange() {
        this.$emit('updateComponentData', this.obj);
      },
      reset() {
        this.obj = deepCopy(this.$options.data().obj);
      },
      validate() {
        return this.$refs.form.validate(true);
      },
    },
  };
</script>
