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
    icon="mdi-ruler"
    :title="$root.$t('operate.update_c', [$root.$t('resource.destination_rule')])"
    :width="1000"
    @reset="reset"
  >
    <template #content>
      <component :is="formComponent" :ref="formComponent" :edit="true" :item="item" title="DestinationRule" />
    </template>
    <template #action>
      <v-btn class="float-right" color="primary" :loading="Circular" text @click="updateIstioDestinationRule">
        {{ $root.$t('operate.confirm') }}
      </v-btn>
    </template>
  </BaseDialog>
</template>

<script>
  import { mapState } from 'vuex';

  import IstioDestinationRuleBaseForm from './IstioDestinationRuleBaseForm';
  import { getIstioDestinationRuleDetail, patchUpdateIstioDestinationRule } from '@/api';
  import BaseResource from '@/mixins/resource';
  import { deepCopy } from '@/utils/helpers';
  import IstioDestinationRuleSchema from '@/utils/schema/destinationrule';

  export default {
    name: 'UpdateIstioDestinationRule',
    components: {
      IstioDestinationRuleBaseForm,
    },
    mixins: [BaseResource],
    data() {
      return {
        dialog: false,
        yaml: null,
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
      async updateIstioDestinationRule() {
        if (this.$refs[this.formComponent].validate()) {
          let data = '';
          if (this.formComponent === 'BaseYamlForm') {
            data = this.$refs[this.formComponent].getYaml();
            data = this.$yamlload(data);
            if (!this.m_resource_checkDataWithOutNS(data)) return;
            if (!this.m_resource_validateJsonSchema(IstioDestinationRuleSchema, data)) {
              return;
            }
          } else if (this.formComponent === 'IstioDestinationRuleBaseForm') {
            data = this.$refs[this.formComponent].getData();
          }
          data = this.m_resource_beautifyData(data);
          await patchUpdateIstioDestinationRule(
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
        const data = await getIstioDestinationRuleDetail(this.EnvironmentFilter.cluster, item.namespace, item.name);
        this.item = deepCopy(data);
        this.$refs[this.formComponent].setYaml(deepCopy(data));
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
