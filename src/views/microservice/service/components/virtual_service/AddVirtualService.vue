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
    icon="mdi-cloud-outline"
    :title="$root.$t('operate.create_c', [$root.$t('resource.virtual_service')])"
    :width="1000"
    @reset="reset"
  >
    <template #content>
      <component :is="formComponent" :ref="formComponent" title="VirtualService" />
    </template>
    <template #action>
      <v-btn class="float-right" color="primary" :loading="Circular" text @click="addIstioVirtualService">
        {{ $root.$t('operate.confirm') }}
      </v-btn>
    </template>
  </BaseDialog>
</template>

<script>
  import { mapState } from 'vuex';

  import IstioVirtualServiceBaseForm from './IstioVirtualServiceBaseForm';
  import { postAddIstioVirtualService } from '@/api';
  import BaseResource from '@/mixins/resource';
  import IstioVirtualServiceSchema from '@/utils/schema/virtualservice';

  export default {
    name: 'AddIstioVirtualService',
    components: {
      IstioVirtualServiceBaseForm,
    },
    mixins: [BaseResource],
    data() {
      return {
        dialog: false,
        yaml: false,
        formComponent: 'BaseYamlForm',
      };
    },
    computed: {
      ...mapState(['Circular', 'EnvironmentFilter']),
    },
    methods: {
      open() {
        this.dialog = true;
      },
      async addIstioVirtualService() {
        if (this.$refs[this.formComponent].validate()) {
          let data = '';
          if (this.formComponent === 'BaseYamlForm') {
            data = this.$refs[this.formComponent].getYaml();
            data = this.$yamlload(data);
            if (!this.m_resource_validateJsonSchema(IstioVirtualServiceSchema, data)) {
              return;
            }
          } else if (this.formComponent === 'IstioVirtualServiceBaseForm') {
            data = this.$refs[this.formComponent].getData();
          }
          data = this.m_resource_beautifyData(data);
          if (!this.m_resource_checkDataWithOutNS(data)) return;
          await postAddIstioVirtualService(
            this.EnvironmentFilter.cluster,
            this.EnvironmentFilter.namespace,
            data.metadata.name,
            data,
          );
          this.reset();
          this.$emit('refresh');
        }
      },
      reset() {
        this.dialog = false;
        this.$refs[this.formComponent].reset();
        this.formComponent = 'BaseYamlForm';
        this.yaml = false;
      },
    },
  };
</script>
