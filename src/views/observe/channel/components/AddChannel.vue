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
    icon="mdi-call-received"
    :title="$root.$t('operate.create_c', [$t('resource.channel')])"
    :width="1000"
    @reset="reset"
  >
    <template #content>
      <component :is="formComponent" :ref="formComponent" title="Channel" />
    </template>
    <template #action>
      <v-btn class="float-right mx-2" color="primary" :loading="Circular" text @click="addChannel">
        {{ $root.$t('operate.confirm') }}
      </v-btn>
    </template>
  </BaseDialog>
</template>

<script>
  import { mapGetters, mapState } from 'vuex';

  import messages from '../i18n';
  import ChannelBaseForm from './ChannelBaseForm';
  import { postAddChannel } from '@/api';

  export default {
    name: 'AddChannel',
    i18n: {
      messages: messages,
    },
    components: {
      ChannelBaseForm,
    },
    props: {},
    data() {
      return {
        dialog: false,
        formComponent: 'ChannelBaseForm',
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
      async addChannel() {
        if (this.$refs[this.formComponent].validate()) {
          const data = this.$refs[this.formComponent].getData();
          await postAddChannel(this.Tenant().ID, data);
          this.reset();
          this.$emit('refresh');
        }
      },
      reset() {
        this.dialog = false;
        this.$refs[this.formComponent].reset();
        this.formComponent = 'ChannelBaseForm';
      },
    },
  };
</script>
