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
  <BaseDialog
    v-model="dialog"
    icon="mdi-eyedropper"
    :title="$root.$t('operate.create_c', [$root.$t('resource.service_monitor')])"
    :width="1000"
    @reset="reset"
  >
    <template #content>
      <component :is="formComponent" :ref="formComponent" title="ServiceMonitor" />
    </template>
    <template #action>
      <v-btn class="float-right" color="primary" :loading="Circular" text @click="addServiceMonitor">
        {{ $root.$t('operate.confirm') }}
      </v-btn>
    </template>
    <template #header-action>
      <v-switch
        :key="switchKey"
        v-model="yaml"
        class="ma-0 pl-2 ml-2 mt-1"
        color="white"
        hide-details
        :style="{ marginTop: `8px !important` }"
        @change="onYamlSwitchChange"
      >
        <template #label>
          <span class="text-subject-1 white--text font-weight-medium"> YAML </span>
        </template>
      </v-switch>
    </template>
  </BaseDialog>
</template>

<script>
  import { mapState } from 'vuex';

  import ServiceMonitorBaseForm from './ServiceMonitorBaseForm';
  import { postAddServiceMonitor } from '@/api';
  import BaseResource from '@/mixins/resource';
  import { randomString } from '@/utils/helpers';
  import ServiceMonitorSchema from '@/utils/schema/servicemonitor';

  export default {
    name: 'AddServiceMonitor',
    components: {
      ServiceMonitorBaseForm,
    },
    mixins: [BaseResource],
    data() {
      return {
        dialog: false,
        yaml: false,
        formComponent: 'ServiceMonitorBaseForm',
        switchKey: '',
      };
    },
    computed: {
      ...mapState(['Circular', 'AdminViewport']),
    },
    methods: {
      open() {
        this.dialog = true;
      },
      async addServiceMonitor() {
        if (this.$refs[this.formComponent].validate()) {
          let data = '';
          if (this.formComponent === 'BaseYamlForm') {
            data = this.$refs[this.formComponent].getYaml();
            data = this.$yamlload(data);
            if (!this.checkDataWithNS(data, this.$route.query.namespace)) {
              return;
            }
            if (!this.m_resource_validateJsonSchema(ServiceMonitorSchema, data)) {
              return;
            }
          } else if (this.formComponent === 'ServiceMonitorBaseForm') {
            data = this.$refs[this.formComponent].getData();
          }
          await postAddServiceMonitor(this.$route.query.cluster, this.$route.query.namespace, data.metadata.name, data);
          this.reset();
          this.$emit('refresh');
        }
      },
      onYamlSwitchChange() {
        if (this.yaml) {
          const data = this.$refs[this.formComponent].getData();
          this.formComponent = 'BaseYamlForm';
          this.$nextTick(() => {
            this.$refs[this.formComponent].setYaml(this.$yamldump(data));
          });
        } else {
          const yaml = this.$refs[this.formComponent].getYaml();
          const data = this.$yamlload(yaml);
          if (!this.m_resource_validateJsonSchema(ServiceMonitorSchema, data)) {
            this.yaml = true;
            this.switchKey = randomString(6);
            return;
          }
          this.formComponent = 'ServiceMonitorBaseForm';
          this.$nextTick(() => {
            this.$refs[this.formComponent].setData(data);
          });
        }
      },
      reset() {
        this.dialog = false;
        this.formComponent = 'ServiceMonitorBaseForm';
        if (this.$refs[this.formComponent]) {
          this.$refs[this.formComponent]?.reset();
        }
        this.yaml = false;
      },
    },
  };
</script>
