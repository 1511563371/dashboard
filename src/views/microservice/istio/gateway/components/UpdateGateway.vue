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
    icon="mdi-network"
    :title="$root.$t('operate.update_c', [$root.$t('resource.gateway')])"
    :width="1000"
    @reset="reset"
  >
    <template #content>
      <component :is="formComponent" :ref="formComponent" :edit="true" :item="item" title="Gateway" />
    </template>
    <template #action>
      <v-btn class="float-right" color="primary" :loading="Circular" text @click="updateIstioGateway">
        {{ $root.$t('operate.confirm') }}
      </v-btn>
    </template>
  </BaseDialog>
</template>

<script>
  import { mapState } from 'vuex';

  import { getIstioGatewayDetail, patchUpdateIstioGateway } from '@/api';
  import BaseResource from '@/mixins/resource';
  import { deepCopy } from '@/utils/helpers';
  import IstioGatewaySchema from '@/utils/schema/gateway';

  export default {
    name: 'UpdateGateway',
    mixins: [BaseResource],
    data() {
      return {
        dialog: false,
        item: null,
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
      async updateIstioGateway() {
        if (this.$refs[this.formComponent].validate()) {
          let data = '';
          if (this.formComponent === 'BaseYamlForm') {
            data = this.$refs[this.formComponent].getYaml();
            data = this.$yamlload(data);
            if (!this.m_resource_validateJsonSchema(IstioGatewaySchema, data)) {
              return;
            }
            if (!this.m_resource_checkDataWithOutNS(data)) return;
            data = this.m_resource_beautifyData(data);
          }
          await patchUpdateIstioGateway(
            this.EnvironmentFilter.cluster,
            this.item.metadata.namespace,
            this.item.metadata.name,
            data,
          );
          this.reset();
          this.$emit('refresh');
        }
      },
      async init(item) {
        const data = await getIstioGatewayDetail(
          this.EnvironmentFilter.cluster,
          item.metadata.namespace,
          item.metadata.name,
        );
        this.item = deepCopy(data);
      },
      reset() {
        this.dialog = false;
        this.$refs[this.formComponent].reset();
        this.formComponent = 'BaseYamlForm';
      },
    },
  };
</script>
