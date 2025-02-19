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
  <v-form v-model="valid" class="my-2" lazy-validation @submit.prevent>
    <v-flex :class="expand ? 'kubegems__overlay' : ''" />
    <v-expand-transition>
      <v-card v-show="expand" class="my-2 pa-2 kubegems__expand-transition" :elevation="4" flat>
        <v-card-text class="pa-0">
          <v-form ref="form" v-model="valid" lazy-validation @submit.prevent>
            <v-sheet class="pt-2 px-2">
              <v-flex class="float-left text-subtitle-2 pt-5 primary--text kubegems__min-width">
                <span>端口级别</span>
              </v-flex>
              <v-flex class="float-left ml-2 kubegems__form-width">
                <v-text-field
                  v-model="obj.port"
                  class="my-0"
                  label="port"
                  required
                  :rules="objRules.portRule"
                  type="number"
                />
              </v-flex>
              <div class="kubegems__clear-float" />
            </v-sheet>

            <v-tabs v-model="tab" class="px-2 rounded-t mt-2 mb-3" height="30">
              <v-tab v-for="item in tabItems" :key="item.value">
                {{ item.text }}
              </v-tab>
            </v-tabs>
            <component
              :is="tabItems[tab].value"
              :ref="tabItems[tab].value"
              :traffic-policy="obj"
              @updateComponentData="updateComponentData"
            />
          </v-form>
        </v-card-text>
        <v-card-actions class="pa-0">
          <v-spacer />
          <v-btn color="error" small text @click="closeCard"> 取消 </v-btn>
          <v-btn color="primary" small text @click="addData"> 保存 </v-btn>
        </v-card-actions>
      </v-card>
    </v-expand-transition>
    <v-sheet
      v-for="(portLevelSetting, index) in trafficPolicyCopy.portLevelSettings
        ? trafficPolicyCopy.portLevelSettings
        : []"
      :key="index"
      class="grey lighten-4 rounded ma-2"
    >
      <v-list-item two-line>
        <v-list-item-content class="py-2">
          <v-list-item-subtitle class="text-body-2 py-0">
            <v-list-item class="float-left pa-0 kubegems__three-width" two-line>
              <v-list-item-content class="py-0">
                <v-list-item-title class="text-subtitle-2 py-1">
                  {{ portLevelSetting.port }}
                </v-list-item-title>
                <v-list-item-subtitle class="text-body-2 py-1"> port </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-list-item class="float-left pa-0 kubegems__three-width" two-line>
              <v-list-item-content class="py-0">
                <v-list-item-title class="text-subtitle-2 py-1">
                  {{ JSON.stringify(portLevelSetting.loadBalancer) !== '{}' ? '已设置' : '未设置' }}
                </v-list-item-title>
                <v-list-item-subtitle class="text-body-2 py-1"> loadBalancer </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-list-item class="float-left pa-0 kubegems__three-width" two-line>
              <v-list-item-content class="py-0">
                <v-list-item-title class="text-subtitle-2 py-1">
                  {{ JSON.stringify(portLevelSetting.connectionPool) !== '{}' ? '已设置' : '未设置' }}
                </v-list-item-title>
                <v-list-item-subtitle class="text-body-2 py-1"> connectionPool </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-list-item class="float-left pa-0 kubegems__three-width" two-line>
              <v-list-item-content class="py-0">
                <v-list-item-title class="text-subtitle-2 py-1">
                  {{ JSON.stringify(portLevelSetting.outlierDetection) !== '{}' ? '已设置' : '未设置' }}
                </v-list-item-title>
                <v-list-item-subtitle class="text-body-2 py-1"> outlierDetection </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-list-item class="float-left pa-0 kubegems__three-width" two-line>
              <v-list-item-content class="py-0">
                <v-list-item-title class="text-subtitle-2 py-1">
                  {{ JSON.stringify(portLevelSetting.tls) !== '{}' ? '已设置' : '未设置' }}
                </v-list-item-title>
                <v-list-item-subtitle class="text-body-2 py-1"> tls </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list-item-subtitle>
          <div class="kubegems__clear-float" />
        </v-list-item-content>
        <v-btn color="primary" dark fab right text x-small @click="updateData(index)">
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
        <v-btn color="error" dark fab right text x-small @click="removeData(index)">
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </v-list-item>
    </v-sheet>
    <v-flex class="grey lighten-4 rounded ma-2">
      <v-list-item two-line>
        <v-list-item-content class="py-2">
          <v-list-item-subtitle class="text-body-2 py-0 text-center">
            <v-btn color="primary" text @click="expandCard">
              <v-icon left small> mdi-plus </v-icon>
              添加端口设置
            </v-btn>
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-flex>
  </v-form>
</template>

<script>
  import ConnectionPool from './ConnectionPool';
  import LoadBalancer from './LoadBalancer';
  import OutlierDetection from './OutlierDetection';
  import TLS from './TLS';
  import { deepCopy } from '@/utils/helpers';
  import { port } from '@/utils/rules';

  export default {
    name: 'PortLevelSettings',
    components: {
      ConnectionPool,
      LoadBalancer,
      OutlierDetection,
      TLS,
    },
    props: {
      trafficPolicy: {
        type: Object,
        default: () => ({}),
      },
    },
    data() {
      return {
        valid: false,
        expand: false,
        tab: 0,
        tabItems: [
          { text: '负载均衡', value: 'LoadBalancer' },
          { text: '连接池', value: 'ConnectionPool' },
          { text: '异常检测', value: 'OutlierDetection' },
          { text: 'TLS', value: 'TLS' },
        ],
        obj: {
          index: -1,
          port: null,
          loadBalancer: {},
          connectionPool: {},
          outlierDetection: {},
          tls: {},
        },
        objRules: {
          portRule: [port],
        },
        trafficPolicyCopy: {},
      };
    },
    watch: {
      trafficPolicy() {
        if (this.trafficPolicy) {
          this.trafficPolicyCopy = deepCopy(this.trafficPolicy);
        }
      },
    },
    mounted() {
      if (this.trafficPolicy) {
        this.trafficPolicyCopy = deepCopy(this.trafficPolicy);
      }
    },
    methods: {
      expandCard() {
        const tabsSliderWrappers = document.querySelectorAll('.v-tabs-slider-wrapper');
        if (tabsSliderWrappers.length > 0) {
          tabsSliderWrappers[tabsSliderWrappers.length - 1].style.width = `201px`;
        }
        this.expand = true;
      },
      closeCard() {
        this.expand = false;
        this.obj = deepCopy(this.$options.data().obj);
        this.$refs.form.resetValidation();
      },
      updateComponentData(data) {
        this.obj = data;
      },
      addData() {
        if (this.$refs.form.validate(true)) {
          if (!this.trafficPolicyCopy.portLevelSettings) {
            this.trafficPolicyCopy.portLevelSettings = [];
          }
          const data = deepCopy(this.obj);
          delete data['index'];
          if (this.obj.index === -1) {
            this.trafficPolicyCopy.portLevelSettings.push(data);
          } else {
            this.$set(this.trafficPolicyCopy.portLevelSettings, this.obj.index, data);
          }
          this.$emit('updateComponentData', this.trafficPolicyCopy);
          this.closeCard();
        }
      },
      removeData(index) {
        this.$delete(this.trafficPolicyCopy.portLevelSettings, index);
        this.$emit('updateComponentData', this.trafficPolicyCopy);
      },
      updateData(index) {
        this.obj = deepCopy(this.trafficPolicyCopy.portLevelSettings[index]);
        this.obj = { ...this.obj, index: index };
        this.expandCard();
      },
    },
  };
</script>
