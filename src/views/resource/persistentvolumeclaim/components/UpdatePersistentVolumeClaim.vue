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
    icon="mdi-database-plus"
    :title="$root.$t('operate.update_c', [$root.$t('resource.persistentvolumeclaim')])"
    :width="1000"
    @reset="reset"
  >
    <template #content>
      <component :is="formComponent" :ref="formComponent" :edit="true" :item="item" title="PersistentVolumeClaim" />
    </template>
    <template #action>
      <v-btn class="float-right" color="primary" :loading="Circular" text @click="updatePersistentVolumeClaim">
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

  import PersistentVolumeClaimBaseForm from './PersistentVolumeClaimBaseForm';
  import { getPersistentVolumeClaimDetail, patchUpdatePersistentVolumeClaim } from '@/api';
  import BaseResource from '@/mixins/resource';
  import { deepCopy, randomString } from '@/utils/helpers';
  import PersistentVolumeClaimSchema from '@/utils/schema/persistentvolumeclaim';

  export default {
    name: 'UpdatePersistentVolumeClaim',
    components: {
      PersistentVolumeClaimBaseForm,
    },
    mixins: [BaseResource],
    data() {
      return {
        dialog: false,
        yaml: false,
        item: null,
        formComponent: 'PersistentVolumeClaimBaseForm',
        switchKey: '',
      };
    },
    computed: {
      ...mapState(['Circular']),
    },
    methods: {
      open() {
        this.dialog = true;
      },
      async updatePersistentVolumeClaim() {
        if (!this.$refs[this.formComponent]) {
          return;
        }
        if (!this.$refs[this.formComponent].checkSaved()) {
          this.$store.commit('SET_SNACKBAR', {
            text: this.$root.$t('tip.save_data'),
            color: 'warning',
          });
          return;
        }
        if (this.$refs[this.formComponent].validate()) {
          let data = '';
          if (this.formComponent === 'BaseYamlForm') {
            data = this.$refs[this.formComponent].getYaml();
            data = this.$yamlload(data);
            if (!this.m_resource_checkDataWithNS(data, this.item.metadata.namespace)) return;
            if (!this.m_resource_validateJsonSchema(PersistentVolumeClaimSchema, data)) {
              return;
            }
          } else if (this.formComponent === 'PersistentVolumeClaimBaseForm') {
            data = this.$refs[this.formComponent].getData();
          }
          data = this.m_resource_beautifyData(data);
          await patchUpdatePersistentVolumeClaim(
            this.ThisCluster,
            this.item.metadata.namespace,
            this.item.metadata.name,
            data,
          );
          this.reset();
          this.$emit('refresh');
        }
      },
      async init(item) {
        this.item = null;
        const data = await getPersistentVolumeClaimDetail(
          this.ThisCluster,
          item.metadata.namespace,
          item.metadata.name,
        );
        this.item = deepCopy(data);
      },
      onYamlSwitchChange() {
        if (this.yaml) {
          const data = this.$refs[this.formComponent].getData();
          this.m_resource_addNsToData(data, this.AdminViewport ? this.item.metadata.namespace : this.ThisNamespace);
          this.formComponent = 'BaseYamlForm';
          this.$nextTick(() => {
            this.$refs[this.formComponent].setYaml(this.$yamldump(data));
          });
        } else {
          const yaml = this.$refs[this.formComponent].getYaml();
          const data = this.$yamlload(yaml);
          this.m_resource_addNsToData(data, this.AdminViewport ? this.item.metadata.namespace : this.ThisNamespace);
          if (!this.m_resource_validateJsonSchema(PersistentVolumeClaimSchema, data)) {
            this.yaml = true;
            this.switchKey = randomString(6);
            return;
          }
          this.formComponent = 'PersistentVolumeClaimBaseForm';
          this.$nextTick(() => {
            this.$refs[this.formComponent].setData(data);
          });
        }
      },
      reset() {
        this.dialog = false;
        this.$refs[this.formComponent].reset();
        this.formComponent = 'PersistentVolumeClaimBaseForm';
        this.yaml = false;
      },
    },
  };
</script>
