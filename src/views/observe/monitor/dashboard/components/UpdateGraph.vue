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
    icon="mdi-chart-areaspline"
    :title="$root.$t('operate.update_c', [$t('tip.graph')])"
    :width="1000"
    @reset="reset"
  >
    <template #content>
      <component
        :is="formComponent"
        :ref="formComponent"
        :edit="true"
        :environment="environment"
        :generator="generator"
        :item="item"
      />
    </template>
    <template #action>
      <v-btn class="float-right" color="primary" :loading="Circular" text @click="updateGraph">
        {{ $root.$t('operate.confirm') }}
      </v-btn>
    </template>
  </BaseDialog>
</template>

<script>
  import { mapState } from 'vuex';

  import messages from '../../i18n';
  import GraphBaseForm from './GraphBaseForm';
  import { putUpdateMonitorDashboard } from '@/api';
  import { deepCopy } from '@/utils/helpers';

  export default {
    name: 'UpdateDashboard',
    i18n: {
      messages: messages,
    },
    components: {
      GraphBaseForm,
    },
    props: {
      dashboard: {
        type: Object,
        default: () => null,
      },
      environment: {
        type: Object,
        default: () => ({}),
      },
    },
    data() {
      return {
        dialog: false,
        formComponent: 'GraphBaseForm',
        index: 0,
        item: null,
        dashboardCopy: null,
        generator: undefined,
      };
    },
    computed: {
      ...mapState(['Circular']),
    },
    watch: {
      dashboard: {
        handler(newValue) {
          if (newValue) {
            this.dashboardCopy = deepCopy(newValue);
          }
        },
        deep: true,
      },
    },
    methods: {
      open() {
        this.dialog = true;
      },
      init(item, index) {
        this.index = index;
        this.item = deepCopy(item);
        this.generator = this.item.promqlGenerator;
      },
      async updateGraph() {
        if (this.$refs[this.formComponent].validate()) {
          let data = '';
          if (this.formComponent === 'GraphBaseForm') {
            data = this.$refs[this.formComponent].getData();
            this.dashboardCopy.graphs[this.index] = data;
          }
          await putUpdateMonitorDashboard(this.environment.value, this.dashboardCopy.id, this.dashboardCopy);
          this.reset();
          this.$emit('refresh');
        }
      },
      reset() {
        this.dialog = false;
        this.$refs[this.formComponent].reset();
        this.index = 0;
      },
    },
  };
</script>
