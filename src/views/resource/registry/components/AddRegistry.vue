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
    icon="mdi-database"
    :title="$root.$t('operate.create_c', [$root.$t('resource.image_registry')])"
    :width="500"
    @reset="reset"
  >
    <template #content>
      <component :is="formComponent" :ref="formComponent" />
    </template>
    <template #action>
      <v-btn class="float-right" color="primary" :loading="Circular" text @click="addRegistry">
        {{ $root.$t('operate.confirm') }}
      </v-btn>
    </template>
  </BaseDialog>
</template>

<script>
  import { mapGetters, mapState } from 'vuex';

  import RegistryBaseForm from './RegistryBaseForm';
  import { postAddRegistry } from '@/api';
  import BaseResource from '@/mixins/resource';

  export default {
    name: 'AddRegistry',
    components: {
      RegistryBaseForm,
    },
    mixins: [BaseResource],
    data() {
      return {
        dialog: false,
        formComponent: 'RegistryBaseForm',
      };
    },
    computed: {
      ...mapState(['Circular']),
      ...mapGetters(['Tenant']),
    },
    methods: {
      open() {
        this.dialog = true;
      },
      async addRegistry() {
        if (this.$refs[this.formComponent].validate()) {
          const data = this.$refs[this.formComponent].getData();
          await postAddRegistry(data.ProjectID, data);
          this.reset();
          this.$emit('refresh');
        }
      },
      reset() {
        this.dialog = false;
        this.$refs[this.formComponent].reset();
      },
    },
  };
</script>
